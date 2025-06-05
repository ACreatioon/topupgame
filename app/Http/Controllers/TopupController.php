<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use App\Models\Order;
use App\Helpers\AesHelper;
use Illuminate\Support\Facades\Log;

class TopupController extends Controller
{
    public function index()
    {
        return Inertia::render('Home', [
            'games' => [
                ['id' => 'MOBILELEGEND', 'name' => 'Mobile Legends', 'img' => '/images/games/MLBB.jpg'],
                ['id' => 'PUBG', 'name' => 'PUBG Mobile', 'img' => '/images/games/PUBG.jpg'],
                ['id' => 'FREEFIRE', 'name' => 'Free Fire', 'img' => '/images/games/FF.jpg'],
                ['id' => 'GENSHIN IMPACT', 'name' => 'Genshin Impact', 'img' => '/images/games/GENSHIN.jpg'],
            ]
        ]);
    }

    public function show($game)
    {
        $response = Http::withOptions([
            'verify' => false,
        ])->get('https://ceklaporan.com/android/harga', [
            'id' => $game,
            'kode' => env('QRIS_KODE'),
            'opr'  => 'SEMUA',
            'n'    => ''
        ]);

        $responseData = $response->json();
        $products = $responseData['hrg'] ?? [];

        return Inertia::render('TopupForm', [
            'game'     => $game,
            'products' => $products
        ]);
    }

    public function store(Request $request, $game)
    {
        $data = $request->validate([
            'user_id'       => 'required|string',
            'zone_id'       => 'nullable|string',
            'nohp'          => 'required|string',
            'product_code'  => 'required|string',
            'payment_method' => 'required|string',
            'price'         => 'required|integer',
        ]);

        $order = Order::create([
            'game'           => $game,
            'user_id'        => $data['user_id'],
            'zone_id'        => $data['zone_id'],
            'nohp'           => $data['nohp'],
            'product_code'   => $data['product_code'],
            'payment_method' => $data['payment_method'],
            'price'          => $data['price'],
            'status'        => 'pending',
        ]);

        if ($data['payment_method'] === 'qris') {
            return $this->processQrisPayment($order, $data);
        }

        return Inertia::render('Transaction', [
            'order' => $order,
        ]);
    }

    protected function processQrisPayment($order, $data)
    {
        $imei_const = env('QRIS_IMEI');
        $kode_const = env('QRIS_KODE');
        $tujuan_const = env('QRIS_TUJUAN');

        $imeiEncrypted = AesHelper::encrypt($imei_const);
        $kodeEncrypted = AesHelper::encrypt($kode_const);
        $nohpEncrypted = AesHelper::encrypt($data['nohp']);
        $nominalEncrypted = AesHelper::encrypt((string)$data['price']);
        $tujuanEncrypted = AesHelper::encrypt($tujuan_const);
        $kodeProductEncrypted = AesHelper::encrypt($data['product_code']);

        try {
            $response = Http::asForm()
                ->timeout(15)
                ->withOptions(['verify' => false])
                ->post('https://ceklaporan.com/api/payment_qris', [
                    'imei' => $imeiEncrypted,
                    'kode' => $kodeEncrypted,
                    'nohp' => $nohpEncrypted,
                    'nom' => $nominalEncrypted,
                    'tujuan' => $tujuanEncrypted,
                    'kode_produk' => $kodeProductEncrypted,
                ]);

            Log::debug('QRIS API Raw Response:', [
                'status' => $response->status(),
                'body' => $response->body(),
            ]);

            if ($response->failed()) {
                return back()->withErrors([
                    'qris_error' => 'API request failed: HTTP ' . $response->status(),
                ]);
            }

            $paymentResult = $response->json();

            if (json_last_error() !== JSON_ERROR_NONE) {
                return back()->withErrors([
                    'qris_error' => 'API returned invalid JSON: ' . $response->body(),
                ]);
            }

            if (!isset($paymentResult['qris_image'])) {
                return back()->withErrors([
                    'qris_error' => 'Missing QR code in response: ' . ($paymentResult['message'] ?? 'Unknown error'),
                ]);
            }

            return Inertia::render('QrisPayment', [
                'order' => $order,
                'paymentData' => [
                    'qris_image' => $paymentResult['qris_image'],
                ],
            ]);
        } catch (\Exception $e) {
            return back()->withErrors([
                'qris_error' => 'Payment processing failed: ' . $e->getMessage(),
            ]);
        }
    }

    public function checkPaymentStatus($id)
    {
        $order = Order::findOrFail($id);
        $order->update(['status' => 'completed']);

        return Inertia::render('Transaction', [
            'order' => $order,
        ]);
    }

    public function transactionProof($id)
    {
        $order = Order::findOrFail($id);
        return Inertia::render('Transaction', [
            'order' => $order,
        ]);
    }
}
