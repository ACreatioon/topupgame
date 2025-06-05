'use client'
import { ArrowBigLeft, Check, Clock, Copy, Download, QrCode, Shield, Wallet } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function TransactionProof({ order }) {
  const [language, setLanguage] = useState('id');
  const [copied, setCopied] = useState(false);

  const t = (id, en) => language === 'id' ? id : en;

  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = () => {
    const newLang = language === 'id' ? 'en' : 'id';
    setLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  const labels = {
    id: { text: 'Indonesia', flag: '/images/IND.jpg' },
    en: { text: 'English', flag: '/images/EN.svg' },
  };

  const gameImages = {
    MOBILELEGEND: '/images/games/MLBB.jpg',
    PUBG: '/images/games/PUBG.jpg',
    FREEFIRE: '/images/games/FF.jpg',
    'GENSHIN IMPACT': '/images/games/GENSHIN.jpg',
  }

  const paymentIcons = {
    qris: <QrCode className="w-5 h-5" />,
    dana: <Wallet className="w-5 h-5" />,
  }

  const copyOrderId = () => {
    navigator.clipboard.writeText(order.id.toString());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString) => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(language === 'id' ? 'id-ID' : 'en-US', options);
  };

  return (
    <div className="mx-auto min-h-screen bg-neutral-950 pb-10">
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/60 border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <a
            href="/"
            className="relative flex items-center gap-1 text-2xl text-indigo-400 font-bold group"
          >
            <ArrowBigLeft /> {t("Beranda", "Home")}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-indigo-400 transition-all duration-500 group-hover:w-full"></span>
          </a>
          <div className="text-gray-300 text-xl">
            <button
              onClick={toggleLanguage}
              className="flex items-center bg-neutral-800 text-indigo-300 border border-indigo-500 rounded-md md:px-4 md:py-2 p-2 cursor-pointer hover:bg-indigo-600 hover:text-white transition"
              title={`Switch language (current: ${labels[language].text})`}
            >
              <img src={labels[language].flag} alt={labels[language].text} className="w-6 h-6 md:mr-2 rounded-full object-cover" />
              <span className='md:block hidden'>{labels[language].text}</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            {t("Transaksi Berhasil!", "Transaction Successful!")}
          </h1>
          <p className="text-gray-300">
            {t("Pesanan Anda telah berhasil diproses", "Your order has been successfully processed")}
          </p>
        </div>
        <div className="bg-neutral-800 rounded-xl shadow-lg shadow-neutral-800 overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-6 py-4">
            <h2 className="text-xl font-bold text-white">
              {t("Detail Transaksi", "Transaction Details")}
            </h2>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between p-4 bg-neutral-700 rounded-lg">
              <div>
                <p className="text-sm text-gray-400">{t("ID Pesanan", "Order ID")}</p>
                <p className="text-lg font-bold text-white">#{order.id}</p>
              </div>
              <button
                onClick={copyOrderId}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              >
                <Copy className="w-4 h-4" />
                {copied ? t("Tersalin!", "Copied!") : t("Salin", "Copy")}
              </button>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={gameImages[order.game] || '/images/games/default.png'}
                    alt={order.game}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <p className="text-sm text-gray-400">{t("Game", "Game")}</p>
                    <p className="text-lg font-semibold text-white capitalize">
                      {order.game.replace(/_/g, ' ')}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400">{t("ID Pengguna", "User ID")}</p>
                  <p className="text-white font-medium">{order.user_id}</p>
                </div>

                {order.zone_id && (
                  <div>
                    <p className="text-sm text-gray-400">{t("Server/Zone", "Server/Zone")}</p>
                    <p className="text-white font-medium">{order.zone_id}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400">{t("Kode Produk", "Product Code")}</p>
                  <p className="text-white font-medium">{order.product_code}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400">{t("Metode Pembayaran", "Payment Method")}</p>
                  <div className="flex items-center gap-2 text-white">
                    {paymentIcons[order.payment_method]}
                    <span className="font-medium capitalize">{order.payment_method}</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-400">{t("Total Harga", "Total Price")}</p>
                  <p className="text-2xl font-bold text-indigo-400">
                    Rp {order.price.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 pt-4 border-t border-neutral-700">
              <div>
                <p className="text-sm text-gray-400">{t("Status", "Status")}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-green-400 font-semibold">
                    {t("Berhasil Diproses", "Successfully Processed")}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-400">{t("Waktu Transaksi", "Transaction Time")}</p>
                <p className="text-white font-medium">{formatDate(order.created_at)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-neutral-800 rounded-xl p-6 mb-6">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-indigo-400" />
            {t("Catatan Penting", "Important Notes")}
          </h3>
          <div className="space-y-3 text-sm text-gray-300">
            <p className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-indigo-400 mt-0.5" />
              {t("Item akan dikirim otomatis ke akun game Anda dalam waktu 1-5 menit",
                 "Items will be automatically sent to your game account within 1-5 minutes")}
            </p>
            <p className="flex items-start gap-2">
              <Shield className="w-4 h-4 text-indigo-400 mt-0.5" />
              {t("Simpan ID Pesanan ini sebagai bukti transaksi",
                 "Save this Order ID as proof of transaction")}
            </p>
            <p className="flex items-start gap-2">
              <QrCode className="w-4 h-4 text-indigo-400 mt-0.5" />
              {t("Jika ada kendala, hubungi customer service dengan menyertakan ID Pesanan",
                 "If you encounter any issues, contact customer service with your Order ID")}
            </p>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => window.print()}
            className="flex items-center justify-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <Download className="w-5 h-5" />
            {t("Unduh Bukti", "Download Proof")}
          </button>

          <a
            href="/"
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white px-6 py-3 rounded-lg transition-all"
          >
            {t("Kembali ke Beranda", "Back to Home")}
          </a>
        </div>
      </div>
    </div>
  )
}
