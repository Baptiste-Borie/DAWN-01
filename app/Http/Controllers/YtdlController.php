<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Symfony\Component\HttpFoundation\StreamedResponse;

class YtdlController extends Controller
{
    /**
     * Start a download job.
     * Spawns yt-dlp in the background, writes progress to a JSON status file.
     *
     * POST /api/ytdl/start
     * Body: { url: string, format: 'mp3'|'mp4', quality: '1080'|'720'|'480'|'best' }
     */
    public function start(Request $request): \Illuminate\Http\JsonResponse
    {
        $validated = $request->validate([
            'url'     => ['required', 'url', 'regex:/^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/'],
            'format'  => ['required', 'in:mp3,mp4'],
            'quality' => ['nullable', 'in:best,1080,720,480'],
        ]);

        $jobId   = Str::uuid()->toString();
        $outDir  = storage_path("app/ytdl/{$jobId}");
        $quality = $validated['quality'] ?? 'best';

        if (!mkdir($outDir, 0755, true) && !is_dir($outDir)) {
            return response()->json(['error' => 'Could not create output directory'], 500);
        }

        $statusFile = "{$outDir}/status.json";
        file_put_contents($statusFile, json_encode([
            'status'   => 'pending',
            'progress' => 0,
            'eta'      => null,
            'speed'    => null,
            'title'    => null,
            'filename' => null,
            'error'    => null,
        ]));

        $command = $this->buildCommand($validated['url'], $validated['format'], $quality, $outDir);

        // Run in background — progress is captured via --progress-template into status.json
        $scriptPath = "{$outDir}/run.sh";
        file_put_contents($scriptPath, $this->buildShellScript($command, $statusFile));
        chmod($scriptPath, 0755);

        shell_exec("bash {$scriptPath} > {$outDir}/yt-dlp.log 2>&1 &");

        return response()->json(['job_id' => $jobId]);
    }

    /**
     * Poll job progress.
     * GET /api/ytdl/progress/{jobId}
     */
    public function progress(string $jobId): \Illuminate\Http\JsonResponse
    {
        if (!$this->isValidJobId($jobId)) {
            return response()->json(['error' => 'Invalid job ID'], 400);
        }

        $statusFile = storage_path("app/ytdl/{$jobId}/status.json");

        if (!file_exists($statusFile)) {
            return response()->json(['error' => 'Job not found'], 404);
        }

        $status = json_decode(file_get_contents($statusFile), true);

        return response()->json($status);
    }

    /**
     * Stream the completed file back to the client.
     * GET /api/ytdl/file/{jobId}
     */
    public function download(string $jobId): StreamedResponse|\Illuminate\Http\JsonResponse
    {
        if (!$this->isValidJobId($jobId)) {
            return response()->json(['error' => 'Invalid job ID'], 400);
        }

        $statusFile = storage_path("app/ytdl/{$jobId}/status.json");

        if (!file_exists($statusFile)) {
            return response()->json(['error' => 'Job not found'], 404);
        }

        $status = json_decode(file_get_contents($statusFile), true);

        if ($status['status'] !== 'done' || empty($status['filename'])) {
            return response()->json(['error' => 'File not ready'], 409);
        }

        $filePath = storage_path("app/ytdl/{$jobId}/{$status['filename']}");

        if (!file_exists($filePath)) {
            return response()->json(['error' => 'File missing on disk'], 500);
        }

        return response()->streamDownload(function () use ($filePath) {
            readfile($filePath);
        }, $status['filename'], [
            'Content-Type'        => mime_content_type($filePath),
            'Content-Length'      => filesize($filePath),
            'Content-Disposition' => 'attachment; filename="' . $status['filename'] . '"',
        ]);
    }

    /**
     * Delete job files (cleanup).
     * DELETE /api/ytdl/{jobId}
     */
    public function destroy(string $jobId): \Illuminate\Http\JsonResponse
    {
        if (!$this->isValidJobId($jobId)) {
            return response()->json(['error' => 'Invalid job ID'], 400);
        }

        $dir = storage_path("app/ytdl/{$jobId}");

        if (is_dir($dir)) {
            array_map('unlink', glob("{$dir}/*"));
            rmdir($dir);
        }

        return response()->json(['deleted' => true]);
    }

    // -------------------------------------------------------------------------
    // Helpers
    // -------------------------------------------------------------------------

    private function ytdlpBin(): string
    {
        // php shell_exec runs with a minimal PATH — resolve the binary at boot time
        foreach (['/home/borie/miniconda3/bin/yt-dlp', '/usr/local/bin/yt-dlp', '/usr/bin/yt-dlp'] as $bin) {
            if (is_executable($bin)) return $bin;
        }
        return 'yt-dlp';
    }

    private function buildCommand(string $url, string $format, string $quality, string $outDir): string
    {
        $bin         = $this->ytdlpBin();
        $nodeBin     = '/home/borie/.nvm/versions/node/v22.22.2/bin/node';
        $escapedUrl  = escapeshellarg($url);
        $template    = escapeshellarg("{$outDir}/%(title)s.%(ext)s");
        $progressTpl = escapeshellarg('%(progress._percent_str)s|%(progress._speed_str)s|%(progress._eta_str)s|%(info.title)s');

        $base = "{$bin} --cookies-from-browser firefox "
            . "--js-runtimes " . escapeshellarg("node:{$nodeBin}") . " "
            . "--remote-components ejs:github "
            . "--newline --progress-template {$progressTpl} ";

        if ($format === 'mp3') {
            return "{$base} -x --audio-format mp3 --audio-quality 0 -o {$template} {$escapedUrl}";
        }

        $formatSelector = escapeshellarg(match ($quality) {
            '1080'  => 'bestvideo[height<=1080][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=1080]+bestaudio/best',
            '720'   => 'bestvideo[height<=720][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=720]+bestaudio/best',
            '480'   => 'bestvideo[height<=480][ext=mp4]+bestaudio[ext=m4a]/bestvideo[height<=480]+bestaudio/best',
            default => 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
        });

        return "{$base} -f {$formatSelector} --merge-output-format mp4 -o {$template} {$escapedUrl}";
    }

    private function buildShellScript(string $command, string $statusFile): string
    {
        $sf = escapeshellarg($statusFile);

        return <<<BASH
#!/bin/bash

STATUS_FILE={$sf}

update_status() {
    local status="\$1" progress="\$2" speed="\$3" eta="\$4" title="\$5"
    python3 -c "
import json, sys
with open(sys.argv[1], 'r+') as f:
    d = json.load(f)
    raw = sys.argv[3].replace('%', '').strip()
    try:
        pct = float(raw)
    except ValueError:
        pct = d.get('progress', 0)
    d.update({'status': sys.argv[2], 'progress': pct,
              'speed': sys.argv[4] or None, 'eta': sys.argv[5] or None,
              'title': sys.argv[6] or d.get('title')})
    f.seek(0); json.dump(d, f); f.truncate()
" "\$STATUS_FILE" "\$status" "\$progress" "\$speed" "\$eta" "\$title" || true
}

{$command} 2>&1 | while IFS= read -r line; do
    if [[ "\$line" == *"|"* ]]; then
        IFS='|' read -r pct speed eta title <<< "\$line"
        update_status "downloading" "\${pct:-0}" "\${speed:-}" "\${eta:-}" "\${title:-}"
    fi
done

EXIT_CODE=\${PIPESTATUS[0]}

if [ "\$EXIT_CODE" -eq 0 ]; then
    FILE=\$(find "\$(dirname "\$STATUS_FILE")" -maxdepth 1 -type f ! -name "*.json" ! -name "*.sh" ! -name "*.log" | head -1)
    BASENAME=\$(basename "\$FILE")
    python3 -c "
import json, sys
with open(sys.argv[1], 'r+') as f:
    d = json.load(f)
    d.update({'status': 'done', 'progress': 100, 'filename': sys.argv[2]})
    f.seek(0); json.dump(d, f); f.truncate()
" "\$STATUS_FILE" "\$BASENAME"
else
    python3 -c "
import json, sys
with open(sys.argv[1], 'r+') as f:
    d = json.load(f)
    d.update({'status': 'error', 'error': 'yt-dlp exited with code ' + sys.argv[2]})
    f.seek(0); json.dump(d, f); f.truncate()
" "\$STATUS_FILE" "\$EXIT_CODE"
fi
BASH;
    }

    private function isValidJobId(string $jobId): bool
    {
        return (bool) preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/', $jobId);
    }
}
