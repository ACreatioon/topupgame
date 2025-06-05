import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { CloudLightning, Gem, Shield, } from 'lucide-react';
import { FaFacebookF, FaInstagram, FaTwitter, FaDiscord } from 'react-icons/fa'

export default function LandingPage({ games = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [language, setLanguage] = useState('id');
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

  const socialIcons = [
    { name: 'Facebook', icon: FaFacebookF, href: '#' },
    { name: 'Instagram', icon: FaInstagram, href: '#' },
    { name: 'Twitter', icon: FaTwitter, href: '#' },
    { name: 'Discord', icon: FaDiscord, href: '#' },
  ]

  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisitedIdleTopup');
    if (!hasVisited) {
      setShowDialog(true);
      localStorage.setItem('hasVisitedIdleTopup', 'true');
    }
  }, []);

  const gamesList = games.length > 0 ? games : sampleGames;

  const heroSlides = [
    {
      imageInd: '/images/banners/bannerIND1.png',
      imageEn: '/images/banners/bannerEN1.png'
    },
    {
      imageInd: '/images/banners/bannerIND2.png',
      imageEn: '/images/banners/bannerEN2.png'
    },
    {
      imageInd: '/images/banners/bannerIND3.png',
      imageEn: '/images/banners/bannerEN3.png'
    },
  ];
  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-neutral-950 text-gray-100">
      {showDialog && (
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-neutral-900 border border-neutral-700 max-w-md w-full mx-4 p-6 rounded-xl shadow-xl text-white text-center">
            <h2 className="text-2xl font-bold mb-4 text-indigo-400">Selamat Datang di IdleTopUp!</h2>
            <p className="text-gray-300 mb-6">
              Platform top-up game tercepat dan terpercaya. Nikmati berbagai promo menarik dan pelayanan 24/7.
            </p>
            <button
              onClick={() => setShowDialog(false)}
              className="mt-2 bg-indigo-600 hover:bg-indigo-700 transition-colors px-6 py-2 rounded-md text-white font-semibold"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
      <nav className="bg-neutral-900/95 backdrop-blur-sm border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <span className="ml-3 text-2xl font-bold text-indigo-400">
                Idletopup
              </span>
            </div>
            <div className='flex items-center gap-5'>
              <div className="hidden md:flex space-x-8 items-center">
                <a href="#home" className="hover:text-indigo-400 transition-colors">{t("Beranda", "Home")}</a>
                <a href="#games" className="hover:text-indigo-400 transition-colors">{t("Permainan", "Games")}</a>
                <a href="#features" className="hover:text-indigo-400 transition-colors">{t("Fitur", "Features")}</a>
                <a href="#contact" className="hover:text-indigo-400 transition-colors">{t("Kontak", "Contact")}</a>
              </div>
              <button
                onClick={toggleLanguage}
                className="flex items-center bg-neutral-800 text-indigo-300 border outline-none border-indigo-500 rounded-md px-4 py-2 cursor-pointer hover:bg-indigo-600 hover:text-white transition"
                title={`Switch language (current: ${labels[language].text})`}
              >
                <img src={labels[language].flag} alt={labels[language].text} className="w-6 h-6 md:mr-2 rounded-full object-cover" />
                <span className='md:block hidden'>{labels[language].text}</span>
              </button>
            </div>
          </div>
        </div>
      </nav>
      <section id="home" className="relative py-14 px-4 bg-neutral-950">
        <div className="max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-xl border border-neutral-800 bg-neutral-900 transition-all duration-1000">
          <div className="relative h-34 md:h-[32rem] overflow-hidden">
            <img
              src={t(heroSlides[currentSlide].imageInd, heroSlides[currentSlide].imageEn)}
              alt="Hero Banner"
              className="w-full h-full object-cover transition-all duration-1000"
            />
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {heroSlides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`w-3 h-3 rounded-full ${i === currentSlide ? 'bg-indigo-400' : 'bg-gray-500'} transition-all`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      <section id="games" className="py-20 bg-neutral-950">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-indigo-400 mb-2 inline-block">
              {t('GAME POPULER', 'POPULAR GAMES')}
            </span>
            <h2 className="text-3xl font-bold text-white">
              {t('Top Up Game Favorit Kamu', 'Top Up Your Favorite Games')}
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {gamesList.map((game) => (
              <Link
                key={game.id}
                href={`/topup/${game.id}`}
                className="relative overflow-hidden hover:scale-105 rounded-xl border border-gray-800 bg-neutral-900 group hover:shadow-xl transition-all"
              >
                <img
                  src={game.img}
                  alt={game.name}
                  className="w-full h-52 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-4 left-0 right-0 px-4 transform translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out">
                  <div className="flex items-center justify-center gap-1 text-white text-sm font-medium">
                    <Gem className="w-4 h-4 text-indigo-400 animate-pulse" />
                    {game.name}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <section id="features" className="py-20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-indigo-400 mb-2 inline-block">{t("MENGAPA MEMILIH KAMI", "WHY CHOOSE US")}</span>
            <h2 className="text-3xl font-bold text-white">{t("Pengalaman Top Up Premium", "Premium Top-Up Experience")}</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <CloudLightning />,
                title: t("Pengiriman Instan", "Instant Delivery"),
                desc: t("Item dalam game Anda akan dikirim dalam hitungan detik setelah konfirmasi pembayaran", "Your in-game items are delivered within seconds after payment confirmation")
              },
              {
                icon: <Shield />,
                title: t("Transaksi Aman", "Secure Transactions"),
                desc: t("Enkripsi tingkat militer melindungi semua transaksi dan data pribadi Anda", "Military-grade encryption protects all your transactions and personal data")
              },
              {
                icon: <Gem />,
                title: t("Harga Kompetitif", "Competitive Prices"),
                desc: t("Kami menawarkan harga terbaik dengan promosi rutin dan item bonus", "We offer the best prices with regular promotions and bonus items")
              }
            ].map((feature, index) => (
              <div key={index} className="bg-neutral-800 p-8 rounded-xl border border-gray-700 hover:border-indigo-500/50 transition-all group">
                <div className="text-3xl mb-4 text-indigo-400">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-20 bg-neutral-900/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            {[
              { number: "1M+", label: t("Pengguna Aktif", "Active Users") },
              { number: "50+", label: t("Game Didukung", "Supported Games") },
              { number: "99.9%", label: t("Tingkat Sukses", "Success Rate") },
              { number: "24/7", label: t("Dukungan", "Support") }
            ].map((stat, index) => (
              <div key={index} className="p-6 bg-neutral-800/50 rounded-lg border border-gray-700">
                <div className="text-3xl md:text-4xl font-bold text-indigo-400">
                  {stat.number}
                </div>
                <div className="text-gray-400 mt-2 text-sm uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer className="bg-neutral-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <span className="ml-3 text-xl font-bold text-white">
                  IdleTopUp
                </span>
              </div>
              <p className="text-gray-400 leading-relaxed">
                {t("Platform pengisian ulang game premium dengan pengiriman tercepat dan dukungan pelanggan terbaik.", "Premium game top-up platform with the fastest delivery and best customer support.")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">{t("Navigasi", "Navigation")}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">{t("Beranda", "Home")}</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">{t("Permainan", "Games")}</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">{t("Fitur", "Features")}</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">{t("Kontak", "Contact")}</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">{t("Layanan", "Services")}</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">{t("Mata Uang Game", "Game Currency")}</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">{t("Battle Pass", "Battle Pass")}</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">{t("Paket VIP", "VIP Packages")}</a>
                </li>
                <li>
                  <a href="#" className="hover:text-indigo-400 transition-colors">{t("Gift Card", "Gift Cards")}</a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4 text-white">Social Media</h3>
              <div className="flex space-x-3">
                {socialIcons.map(({ name, icon: Icon, href }, index) => (
                  <a
                    key={index}
                    href={href}
                    className="w-10 h-10 bg-gray-800 rounded-md flex items-center justify-center hover:bg-indigo-600 transition-colors text-white"
                    title={name}
                  >
                    <Icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} IdleTopUp. {t("Seluruh hak cipta dilindungi.", "All rights reserved.")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
