<?php

use Illuminate\Support\Facades\Route;

Route::prefix('api')->group(function () {
    require __DIR__.'/YtdlRouter.php';
});

Route::get('/{any}', function () {
    return view('welcome');
})->where('any', '.*');
