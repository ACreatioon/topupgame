<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TopupController;


Route::get('/', [TopupController::class, 'index']);
Route::get('/topup/{game}', [TopupController::class, 'show']);
Route::post('/topup/{game}', [TopupController::class, 'store']);
Route::get('/transaction/proof/{id}', [TopupController::class, 'transactionProof'])->name('transaction.proof');
Route::get('/transaction/{id}/check', [TopupController::class, 'checkPaymentStatus'])->name('transaction.check');

require __DIR__.'/auth.php';
