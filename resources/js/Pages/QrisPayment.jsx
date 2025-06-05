import { useState, useEffect } from 'react';
import { QrCode, Clock, CheckCircle, XCircle, Copy, ArrowLeft } from 'lucide-react';

export default function QrisPayment({ order, paymentData }) {
  const [timeLeft, setTimeLeft] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState('waiting');
  const [copied, setCopied] = useState(false);

  // Calculate time left until expiration
  useEffect(() => {
    if (!paymentData.expires_at) return;

    const updateTimer = () => {
      const now = new Date().getTime();
      const expiry = new Date(paymentData.expires_at).getTime();
      const difference = expiry - now;

      if (difference > 0) {
        setTimeLeft(Math.ceil(difference / 1000));
      } else {
        setTimeLeft(0);
        setPaymentStatus('expired');
      }
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);

    return () => clearInterval(timer);
  }, [paymentData.expires_at]);

  // Format time display
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Copy QRIS code to clipboard
  const copyQrisCode = async () => {
    try {
      await navigator.clipboard.writeText(paymentData.qris_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Generate QR code URL using a QR code service
  const getQrCodeUrl = (text, size = 300) => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}`;
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/60 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <a
            href="/"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Kembali</span>
          </a>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-300">
              Waktu tersisa: <span className="font-mono font-bold text-indigo-400">{formatTime(timeLeft)}</span>
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Status Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-indigo-600/20 text-indigo-300 px-4 py-2 rounded-full mb-4">
            <QrCode className="w-5 h-5" />
            <span className="font-medium">Pembayaran QRIS</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Scan QR Code untuk Membayar</h1>
          <p className="text-gray-400">
            Gunakan aplikasi mobile banking atau e-wallet untuk memindai QR code di bawah ini
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* QR Code Section */}
          <div className="bg-neutral-800 rounded-2xl p-6 text-center">
            <h2 className="text-lg font-semibold mb-6">QR Code Pembayaran</h2>

            <div className="relative inline-block">
              <div className="bg-white p-4 rounded-2xl shadow-lg">
                <img
                  src={getQrCodeUrl(paymentData.qris_code, 250)}
                  alt="QRIS QR Code"
                  className="w-64 h-64 mx-auto"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <div
                  style={{ display: 'none' }}
                  className="w-64 h-64 bg-gray-200 rounded-xl flex items-center justify-center text-gray-600"
                >
                  <div className="text-center">
                    <QrCode className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">QR Code tidak dapat dimuat</p>
                  </div>
                </div>
              </div>

              {timeLeft <= 0 && (
                <div className="absolute inset-0 bg-black/70 rounded-2xl flex items-center justify-center">
                  <div className="text-center">
                    <XCircle className="w-12 h-12 text-red-400 mx-auto mb-2" />
                    <p className="text-red-400 font-medium">QR Code Expired</p>
                  </div>
                </div>
              )}
            </div>

            {/* Manual Copy Option */}
            <div className="mt-6 p-4 bg-neutral-700 rounded-xl">
              <p className="text-sm text-gray-300 mb-2">Atau salin kode QRIS:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={paymentData.qris_code}
                  readOnly
                  className="flex-1 bg-neutral-600 text-white px-3 py-2 rounded-lg text-xs font-mono"
                />
                <button
                  onClick={copyQrisCode}
                  className="bg-indigo-600 hover:bg-indigo-700 px-3 py-2 rounded-lg transition"
                >
                  {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              {copied && (
                <p className="text-green-400 text-xs mt-1">Kode berhasil disalin!</p>
              )}
            </div>
          </div>

          {/* Payment Info Section */}
          <div className="space-y-6">
            {/* Order Details */}
            <div className="bg-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Detail Pesanan</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Game:</span>
                  <span className="font-medium capitalize">{order.game.replace(/_/g, ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">User ID:</span>
                  <span className="font-medium">{order.user_id}{order.zone_id && ` (${order.zone_id})`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Produk:</span>
                  <span className="font-medium">{order.product_code}</span>
                </div>
                <div className="flex justify-between text-lg">
                  <span className="text-gray-400">Total:</span>
                  <span className="font-bold text-indigo-400">Rp {order.price.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Payment Instructions */}
            <div className="bg-neutral-800 rounded-2xl p-6">
              <h3 className="text-lg font-semibold mb-4">Cara Pembayaran</h3>
              <ol className="space-y-2 text-sm text-gray-300">
                <li className="flex gap-3">
                  <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">1</span>
                  <span>Buka aplikasi mobile banking atau e-wallet (DANA, GoPay, OVO, dll)</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">2</span>
                  <span>Pilih menu "Scan QR" atau "QRIS"</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">3</span>
                  <span>Arahkan kamera ke QR code di atas</span>
                </li>
                <li className="flex gap-3">
                  <span className="bg-indigo-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">4</span>
                  <span>Konfirmasi pembayaran sebesar Rp {order.price.toLocaleString('id-ID')}</span>
                </li>
              </ol>
            </div>

            {/* Timer Warning */}
            {timeLeft > 0 && timeLeft <= 120 && (
              <div className="bg-yellow-600/20 border border-yellow-600/50 rounded-xl p-4">
                <div className="flex items-center gap-2 text-yellow-400">
                  <Clock className="w-5 h-5" />
                  <span className="font-medium">Waktu pembayaran hampir habis!</span>
                </div>
                <p className="text-yellow-300 text-sm mt-1">
                  Selesaikan pembayaran dalam {formatTime(timeLeft)} atau transaksi akan dibatalkan.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.location.reload()}
            className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-xl transition"
          >
            Refresh Status Pembayaran
          </button>
        </div>
      </div>
    </div>
  );
}
