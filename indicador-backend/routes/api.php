<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\Api\IndicatorController;
use App\Http\Controllers\Api\AuthController;
use \App\Http\Controllers\QuestionController;
use \App\Http\Controllers\AlternativeController;
use \App\Http\Controllers\OldDBController;
use \App\Http\Controllers\DiagnosticController;

Route::post('/auth/login', [AuthController::class, 'login']);

Route::middleware('jwt.custom_auth')->group(function () {

    Route::prefix('auth')->group(function () {
        Route::get('/check', function (Request $request) {
            return response()->json([
                'message' => 'valid',
            ]);
        });
        Route::delete('/logout', [AuthController::class, 'logout']);
        Route::get('/refresh', [AuthController::class, 'refresh']);
    });

    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index']);
        Route::post('/', [UserController::class, 'store']);
        Route::get('/{user}', [UserController::class, 'show']);
        Route::put('/{user}', [UserController::class, 'update']);
        Route::delete('/{user}', [UserController::class, 'destroy']);
    });

    Route::prefix('indicators')->group(function () {
        Route::get('/', [IndicatorController::class, 'index']);
        Route::post('/', [IndicatorController::class, 'store']);
        Route::get('/{indicator}', [IndicatorController::class, 'show']);
        Route::get('/series/{seriesId}/disciplines/{disciplineId}', [IndicatorController::class, 'showBySeriesAndDiscipline']);
        Route::get('/series/{seriesId}/disciplines/{disciplineId}/type/{type}', [IndicatorController::class, 'showBySeriesAndDisciplineAndType']);
        Route::put('/{indicator}', [IndicatorController::class, 'update']);
        Route::delete('/{indicator}', [IndicatorController::class, 'destroy']);
    });

    Route::prefix('questions')->group(function () {
        Route::get('/', [QuestionController::class, 'index']);
        Route::post('/', [QuestionController::class, 'store']);
        Route::get('/{question}', [QuestionController::class, 'show']);
        Route::put('/{question}', [QuestionController::class, 'update']);
        Route::delete('/{question}', [QuestionController::class, 'destroy']);
    });

    Route::prefix('alternatives')->group(function () {
        Route::get('/', [AlternativeController::class, 'index']);
        Route::post('/', [AlternativeController::class, 'store']);
        Route::get('/{alternative}', [AlternativeController::class, 'show']);
        Route::put('/{alternative}', [AlternativeController::class, 'update']);
        Route::delete('/{alternative}', [AlternativeController::class, 'destroy']);
    });

    Route::prefix('external')->group(function () {
        Route::get('/institutions', [OldDBController::class, 'getAllInstitution']);
        Route::get('/institutions/{id}', [OldDBController::class, 'getUniqueInstitution']);
        Route::get('/institutions/name/{name}', [OldDBController::class, 'getInstitutionByName']);

        Route::get('/series', [OldDBController::class, 'getAllSeries']);
        Route::get('/series/institution/{institutionId}', [OldDBController::class, 'getSeriesByInstitution']);

        Route::get('/class/series/{seriesId}', [OldDBController::class, 'getClassBySeries']);
        Route::get('/class/institution/{institutionId}/schoolYear/{schoolYear}', [OldDBController::class, 'getClassByInstitutinAndSchoolYear']);
        Route::get('/class/schoolYear/{schoolYear}/seriesId/{seriesId}/institutionId/{institutionId}', [OldDBController::class, 'getClassBySchoolYearAndSeries']);

        Route::get('/disciplines', [OldDBController::class, 'getAllDisciplines']);
        Route::get('/disciplines/series/{seriesId}', [OldDBController::class, 'getDisciplinesBySeries']);

        Route::get('/students/class/{idClass}/schoolYear/{schoolYear}', [OldDBController::class, 'getStudentsByClassAndSchoolYear']);
    });

    Route::prefix('diagnostics')->group(function () {
        Route::get('/filter', [DiagnosticController::class, 'index']);
        Route::post('/', [DiagnosticController::class, 'store']);
        Route::get('/{id}', [DiagnosticController::class, 'show']);
        Route::put('/{id}', [DiagnosticController::class, 'update']);
        Route::delete('/{id}', [DiagnosticController::class, 'destroy']);
    });
});


// Test route without controller dependency
//Route::get('/test', function() {
//    return ['message' => 'API works!'];
//});
