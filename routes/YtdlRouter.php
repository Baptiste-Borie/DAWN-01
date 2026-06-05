<?php


use App\Http\Controllers\YtdlController;
use Illuminate\Support\Facades\Route;

Route::prefix('ytdl')->group(function () {
    Route::post('/start', [YtdlController::class, 'start']);
    Route::get('/progress/{jobId}', [YtdlController::class, 'progress']);
    Route::get('/file/{jobId}', [YtdlController::class, 'download']);
    Route::delete('/{jobId}', [YtdlController::class, 'destroy']);
});
