import { useEffect, useRef, useState, type ClipboardEvent } from "react";
import { useDock } from "@/dock/useDock";

type JobStatus = "pending" | "downloading" | "done" | "error";

interface Job {
  status: JobStatus;
  progress: number;
  speed?: string | null;
  eta?: string | null;
  title?: string | null;
  error?: string;
}

const STATUS_LABEL: Record<JobStatus, string> = {
  pending: "PENDING",
  downloading: "DOWNLOADING",
  done: "DONE",
  error: "ERROR",
};

const QUALITY_STEPS = ["480", "720", "1080", "best"] as const;
const QUALITY_LABEL: Record<(typeof QUALITY_STEPS)[number], string> = {
  "480": "480p",
  "720": "720p",
  "1080": "1080p",
  best: "BEST",
};

export default function YtdlService() {
  const dock = useDock();
  const [url, setUrl] = useState("");
  const [format, setFormat] = useState<"mp3" | "mp4">("mp3");
  const [quality, setQuality] = useState<(typeof QUALITY_STEPS)[number]>("best");
  const [job, setJob] = useState<Job | null>(null);
  const jobId = useRef<string | null>(null);
  const pollTimer = useRef<ReturnType<typeof setInterval>>(undefined);

  const isRunning = !!job && (job.status === "pending" || job.status === "downloading");
  const canStart = url.trim().length > 0 && !isRunning;

  useEffect(() => () => clearInterval(pollTimer.current), []);

  const startPolling = () => {
    pollTimer.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/ytdl/progress/${jobId.current}`);
        const data: Job = await res.json();
        setJob(data);
        if (data.status === "done" || data.status === "error") {
          clearInterval(pollTimer.current);
        }
      } catch {
        clearInterval(pollTimer.current);
        setJob((prev) => (prev ? { ...prev, status: "error" } : prev));
      }
    }, 800);
  };

  const startDownload = async () => {
    if (!canStart) return;
    setJob({ status: "pending", progress: 0, speed: null, eta: null, title: null });

    try {
      const res = await fetch("/api/ytdl/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), format, quality }),
      });
      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      jobId.current = data.job_id;
      startPolling();
    } catch {
      setJob({ status: "error", progress: 0, error: "Request failed" });
    }
  };

  const downloadFile = () => {
    if (jobId.current) window.location.href = `/api/ytdl/file/${jobId.current}`;
  };

  const reset = async () => {
    if (jobId.current) {
      await fetch(`/api/ytdl/${jobId.current}`, { method: "DELETE" }).catch(() => {});
    }
    jobId.current = null;
    setJob(null);
    setUrl("");
  };

  const onPaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData?.getData("text") ?? "";
    if (/youtube\.com|youtu\.be/.test(text)) {
      setUrl(text);
      e.preventDefault();
    }
  };

  const toggleFormat = () => {
    if (isRunning) return;
    setFormat((f) => (f === "mp3" ? "mp4" : "mp3"));
  };

  const statLed =
    !job ? (
      <span className="led led-off" />
    ) : job.status === "pending" ? (
      <span className="led led-amber led-blink" />
    ) : job.status === "downloading" ? (
      <span className="led led-on led-blink" />
    ) : job.status === "done" ? (
      <span className="led led-on" />
    ) : (
      <span className="led led-alert" />
    );

  return (
    <div className="ytdlService-module">
      <div className="ytdlService-inner">
        <div className="ytdlService-topbar">
          <button className="ytdlService-back" onClick={() => dock.goHome()}>
            ◂
          </button>
          <span className="ytdlService-name">YT EXTRACTOR</span>
          <span className="ytdlService-stat">
            {statLed}
            {job ? STATUS_LABEL[job.status] : "IDLE"}
          </span>
        </div>

        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onPaste={onPaste}
          type="text"
          className="ytdlService-url"
          placeholder="https://youtube.com/watch?v=..."
          disabled={isRunning}
        />

        <div className="ytdlService-settings">
          <div className="ytdlService-fmt">
            <span className="ytdlService-cap">FORMAT</span>
            <div className="ytdlService-fmtBody">
              <button
                className={`ytdlService-fmtPos ${format === "mp3" ? "ytdlService-active" : ""}`}
                disabled={isRunning}
                onClick={() => !isRunning && setFormat("mp3")}
              >
                MP3
              </button>
              <button
                className="ytdlService-rot"
                disabled={isRunning}
                onClick={toggleFormat}
                style={{ transform: `rotate(${format === "mp4" ? 38 : -38}deg)` }}
                aria-label="Basculer le format"
              >
                <span className="ytdlService-rotNotch" style={{ top: 12, left: 9 }} />
                <span className="ytdlService-rotNotch" style={{ top: 12, right: 9 }} />
              </button>
              <button
                className={`ytdlService-fmtPos ${format === "mp4" ? "ytdlService-active" : ""}`}
                disabled={isRunning}
                onClick={() => !isRunning && setFormat("mp4")}
              >
                MP4
              </button>
            </div>
          </div>

          <button
            className={`ytdlService-extract ${!canStart ? "ytdlService-dim" : ""}`}
            disabled={!canStart}
            onClick={startDownload}
          >
            {isRunning ? "RUNNING" : "EXTRACT"}
          </button>
        </div>

        <div className={`ytdlService-qual ${format === "mp3" ? "ytdlService-off" : ""}`}>
          <div className="ytdlService-qualHead">
            <span className="ytdlService-cap">QUALITY</span>
            <span className="ytdlService-qualVal">
              {format === "mp4" ? QUALITY_LABEL[quality] : "—"}
            </span>
          </div>
          <div className="ytdlService-hrail">
            <div className="ytdlService-hrailTicks">
              <i /><i /><i /><i />
            </div>
            <div
              className="ytdlService-hhandle"
              style={{
                left:
                  format === "mp4"
                    ? `${(QUALITY_STEPS.indexOf(quality) / (QUALITY_STEPS.length - 1)) * 100}%`
                    : "0%",
                transform: "translateX(-50%)",
              }}
            />
          </div>
          <div className="ytdlService-qualScale">
            {QUALITY_STEPS.map((step) => (
              <button
                key={step}
                className={quality === step ? "ytdlService-active" : ""}
                disabled={isRunning || format === "mp3"}
                onClick={() => setQuality(step)}
              >
                {QUALITY_LABEL[step]}
              </button>
            ))}
          </div>
        </div>

        {job && (
          <div className="ytdlService-prog">
            {job.title && <div className="ytdlService-progTitle">{job.title}</div>}

            <div className="ytdlService-progBar">
              <div className="ytdlService-ptrack">
                <div
                  className={`ytdlService-pfill ${job.status === "error" ? "ytdlService-error" : ""}`}
                  style={{ width: `${job.progress}%` }}
                />
              </div>
              <span className={`ytdlService-ppct ${job.status === "error" ? "ytdlService-error" : ""}`}>
                {Math.round(job.progress)}%
              </span>
            </div>

            <div className="ytdlService-progMeta">
              {job.speed && (
                <span>
                  <b>SPD</b>{job.speed}
                </span>
              )}
              {job.eta && (
                <span>
                  <b>ETA</b>{job.eta}
                </span>
              )}
              {job.status === "error" && (
                <span className="ytdlService-errorMsg">⚠ {job.error}</span>
              )}
            </div>

            {job.status === "done" && (
              <div className="ytdlService-doneRow">
                <button className="ytdlService-saveBtn" onClick={downloadFile}>
                  ↓ SAVE {format.toUpperCase()}
                </button>
                <button className="dark-key" onClick={reset}>
                  NEW
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
