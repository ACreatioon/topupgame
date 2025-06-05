'use client'
import { useForm } from '@inertiajs/react'
import { ArrowBigLeft, HandCoins, QrCode, Shield, Stars, Wallet, AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react';

export default function TopupForm({ game, products, errors }) {
  const [language, setLanguage] = useState('id');
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const { data, setData, post, processing } = useForm({
    user_id: '',
    zone_id: '',
    nohp: '',
    product_code: products[0]?.kode || '',
    payment_method: 'qris',
    price: products[0] ? Number(products[0].hrg.replace(/\./g, '')) : 0,
  })

  const handleProductChange = (selectedProduct) => {
    setData('product_code', selectedProduct.kode)
    setData('price', Number(selectedProduct.hrg.replace(/\./g, '')))
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.user_id.trim()) {
      alert(t('ID tidak boleh kosong', 'ID cannot be empty'));
      return;
    }

    if (!data.nohp.trim()) {
      alert(t('Nomor HP tidak boleh kosong', 'Phone number cannot be empty'));
      return;
    }

    if (!data.product_code) {
      alert(t('Pilih produk terlebih dahulu', 'Please select a product first'));
      return;
    }

    setIsSubmitting(true);

    post(`/topup/${game}`, {
      onSuccess: () => {
        console.log('Form submitted successfully');
      },
      onError: (errors) => {
        console.error('Form submission errors:', errors);
        setIsSubmitting(false);
      },
      onFinish: () => {
        setIsSubmitting(false);
      }
    });
  };

  const gameImages = {
    MOBILELEGEND: '/images/games/MLBB.jpg',
    PUBG: '/images/games/PUBG.jpg',
    FREEFIRE: '/images/games/FF.jpg',
    'GENSHIN IMPACT': '/images/games/GENSHIN.jpg',
  }

  const paymentMethods = [
    { id: 'qris', name: 'QRIS', icon: <QrCode className="w-6 h-6" />, provider: 'QRIS' },
    { id: 'dana', name: 'DANA', icon: <Wallet className="w-6 h-6" />, provider: 'DANA' },
  ]

  return (
    <div className="mx-auto min-h-screen pb-10">
      <nav className="sticky top-0 z-50 backdrop-blur bg-black/60 border-b border-white/10 shadow-md">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <a
            href="/"
            className="relative flex items-center gap-1 text-2xl text-indigo-400 font-bold group"
          >
            <ArrowBigLeft /> {t("Kembali", "Back")}
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

      {(errors?.error || errors?.qris_error) && (
        <div className="max-w-7xl mx-auto px-4 py-4 z-50">
          <div className="bg-red-700 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-200 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-200 font-medium">
                {errors.error || errors.qris_error}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative h-[30rem] w-full overflow-hidden mb-12 -mt-16 -z-10">
        <img
          src={gameImages[game] || '/images/games/default.png'}
          alt={game}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>

        <div className="relative z-10 container mx-auto px-4 h-full flex flex-col justify-end pb-6">
          <div className="flex md:flex-row flex-col items-end gap-6">
            <img
              src={gameImages[game] || '/images/games/default.png'}
              alt={game}
              className="h-60 object-cover rounded-lg shadow-xl transform -rotate-6 border-2 border-indigo-400"
            />
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 capitalize">{game.replace(/_/g, ' ')}</h1>
              <div className="flex gap-4 text-gray-300">
                <p className="flex items-center gap-1 text-sm"><Shield className="w-4 h-4 text-indigo-400" /> {t("Terpercaya", "Trusted")}</p>
                <p className="flex items-center gap-1 text-sm"><HandCoins className="w-4 h-4 text-indigo-400" />{t(" Pembayaran Digital", "Digital Payments")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col lg:flex-row gap-8 px-4 lg:px-20">
          <div className="container px-4 space-y-6">
            <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-lg shadow-neutral-800">
              <div className="flex items-center bg-indigo-400 px-6 py-3">
                <span className="flex items-center justify-center w-6 h-6 bg-black text-indigo-400 rounded-full mr-3 font-bold">1</span>
                <span className="font-bold text-black">{t("Masukkan Data Akun", "Enter Account Data")}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">ID</label>
                  <input
                    type="text"
                    placeholder={t("Masukkan ID", "Enter ID")}
                    value={data.user_id}
                    onChange={e => setData('user_id', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-700 text-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                    required
                  />
                  {errors?.user_id && <p className="text-red-400 text-sm mt-1">{errors.user_id}</p>}
                </div>
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Server</label>
                  <input
                    type="text"
                    placeholder={t("Masukkan Server", "Enter Server")}
                    value={data.zone_id}
                    onChange={e => setData('zone_id', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-700 text-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                  />
                  {errors?.zone_id && <p className="text-red-400 text-sm mt-1">{errors.zone_id}</p>}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Nomor HP</label>
                  <input
                    type="text"
                    placeholder={t("Masukkan Nomor HP", "Enter Phone Number")}
                    value={data.nohp}
                    onChange={e => setData('nohp', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg bg-neutral-700 text-white border border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
                    required
                  />
                  {errors?.nohp && <p className="text-red-400 text-sm mt-1">{errors.nohp}</p>}
                </div>
              </div>
            </div>

            <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-lg shadow-neutral-800">
              <div className="flex items-center bg-indigo-400 px-6 py-3">
                <span className="flex items-center justify-center w-6 h-6 bg-black text-indigo-400 rounded-full mr-3 font-bold">2</span>
                <span className="font-bold text-black">{t("Pilih Nominal", "Select Nominal")}</span>
              </div>
              <div className="px-6 pt-4 pb-2 text-sm text-gray-300 font-medium">{t("Item Special", "Special Items")}</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
                {products.map(product => (
                  <button
                    key={product.kode}
                    type="button"
                    onClick={() => handleProductChange(product)}
                    className={`rounded-xl p-5 text-left transition-all duration-300 ${data.product_code === product.kode
                      ? 'bg-gradient-to-br from-indigo-500/20 to-indigo-700/20 border-2 border-indigo-400 shadow-lg shadow-indigo-400/20'
                      : 'bg-neutral-700 hover:bg-neutral-600 border-2 border-transparent hover:border-indigo-400/30'
                      }`}
                  >
                    <div className="font-bold text-white mb-2">{product.nama}</div>
                    <div className="text-indigo-400 text-xl font-extrabold mb-3">Rp {product.hrg}</div>
                    <div className="text-xs bg-indigo-400 text-gray-900 font-bold inline-block px-3 py-1 rounded-full">
                      {t("Pengiriman INSTAN", "INSTANT delivery")}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-xl overflow-hidden shadow-lg shadow-neutral-800 p-6">
              <h3 className="text-lg font-bold text-white mb-4">{t("Metode Pembayaran", "Payment Method")}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {paymentMethods.map(method => (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setData('payment_method', method.id)}
                    className={`flex flex-col items-start rounded-xl p-4 transition-all duration-300 ${data.payment_method === method.id
                      ? 'bg-gradient-to-br from-indigo-500/20 to-indigo-700/20 border-2 border-indigo-400'
                      : 'bg-neutral-700 hover:bg-gray-600 border-2 border-transparent'
                      }`}
                  >
                    <div className="flex items-center gap-3 w-full">
                      <span className="text-indigo-400 flex items-center justify-center">
                        {method.icon}
                      </span>
                      <div className="text-left">
                        <span className="font-bold text-white block capitalize">{method.name}</span>
                        <span className="text-xs text-gray-300 block">{method.provider}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={!data.user_id || !data.nohp || processing || isSubmitting}
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-400 hover:to-indigo-500 disabled:from-gray-600 disabled:to-gray-600 disabled:cursor-not-allowed text-gray-900 font-extrabold py-4 rounded-xl shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <span>
                {processing || isSubmitting
                  ? t("Memproses...", "Processing...")
                  : t("Bayar Sekarang", "Pay Now")
                }
              </span>
              <span className="text-sm bg-black/30 px-3 py-1 rounded-full">
                Rp{data.price.toLocaleString('id-ID')}
              </span>
            </button>
          </div>

          <div className="w-full lg:w-[26rem] px-0 lg:px-0 sticky top-20 self-start">
            <div className='bg-neutral-800 text-white p-4 rounded-xl shadow-lg shadow-neutral-800'>
              <h1 className='text-base font-bold'>{t("Ulasan Rating", "Review Ratings")}</h1>
              <div className='flex md:flex-row flex-col items-start gap-1 md:items-center'>
                <p className='text-6xl font-bold'>4.99</p>
                <p className='text-indigo-600 flex gap-1 items-center font-bold'><Stars size={40} /><Stars size={40} /><Stars size={40} /><Stars size={40} /><Stars size={40} /></p>
              </div>
              <p className='text-xs md:text-end text-start mt-3 font-bold'>{t("berdasarkan 30rb orang ulasan", "based on 30k people reviews")}</p>
            </div>
            <div className="bg-neutral-800 mt-10 text-white p-6 rounded-xl shadow-lg shadow-neutral-800 space-y-4">
              <h1 className="text-base font-bold">{t("Kepercayaan & Ulasan", "Trust & Reviews")}</h1>

              <div className="flex flex-col gap-3">
                <p className="text-sm text-gray-300">{t("Berdasarkan", "Based on")} <span className="font-bold text-white">30.000+</span>{t("ulasan dari pelanggan", "Based on 30,000+ customer reviews")}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-gray-400">
                  <div className="flex items-start gap-2">
                    <Shield className="text-indigo-400 mt-1" size={18} />
                    <div>
                      <p className="text-white font-semibold">{t("Transaksi Aman", "Secure Transactions")}</p>
                      <p>{t("100% aman dengan QRIS & DANA TUNAI", "100% safe with QRIS & CASH FUNDS")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <HandCoins className="text-indigo-400 mt-1" size={18} />
                    <div>
                      <p className="text-white font-semibold">{t("Harga Transparan", "Transparent Pricing")}</p>
                      <p>{t("Tidak ada biaya tersembunyi, sesuai harga", "No hidden fees, fair price")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Stars className="text-indigo-400 mt-1" size={18} />
                    <div>
                      <p className="text-white font-semibold">{t("Tingkat Kepuasan", "Level Of Satisfaction")}</p>
                      <p>{t("98% pengguna puas dengan layanan kami", "98% of users are satisfied with our service")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <QrCode className="text-indigo-400 mt-1" size={18} />
                    <div>
                      <p className="text-white font-semibold">{t("Pengiriman Instan", "Instant Delivery")}</p>
                      <p>{t("Produk dikirim otomatis dalam hitungan detik", "Products are sent automatically in seconds")}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
