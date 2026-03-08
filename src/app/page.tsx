import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 flex flex-col items-center justify-center p-6">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-7xl mb-4 select-none">⚡</div>
        <h1 className="text-5xl font-black text-indigo-700 mb-3">ספארק</h1>
        <p className="text-xl text-gray-600 max-w-lg mx-auto leading-relaxed">
          המורה החכם שמלווה אותך לבנות פרויקטים ומשחקים מגניבים עם לוח ESP32
        </p>
      </div>

      {/* CTA Cards */}
      <div className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl">
        {/* Option A */}
        <Link href="/onboarding?mode=idea" className="flex-1 group">
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent group-hover:border-indigo-400 group-hover:shadow-xl transition-all duration-200 text-center cursor-pointer h-full">
            <div className="text-5xl mb-4">💡</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">יש לי רעיון!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              ספר לי מה אתה רוצה לבנות ואני אדריך אותך שלב-אחר-שלב
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-indigo-600 font-semibold text-sm">
              בואו נתחיל ←
            </div>
          </div>
        </Link>

        {/* Option B */}
        <Link href="/onboarding?mode=suggest" className="flex-1 group">
          <div className="bg-white rounded-3xl p-8 shadow-lg border-2 border-transparent group-hover:border-cyan-400 group-hover:shadow-xl transition-all duration-200 text-center cursor-pointer h-full">
            <div className="text-5xl mb-4">🎯</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">הצע לי פרויקט!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              אספר לי אילו רכיבים יש לי ואציע לך פרויקטים מגניבים שתוכל לבנות
            </p>
            <div className="mt-5 inline-flex items-center gap-2 text-cyan-600 font-semibold text-sm">
              בואו נגלה ←
            </div>
          </div>
        </Link>
      </div>

      {/* Features strip */}
      <div className="mt-16 flex flex-wrap gap-6 justify-center text-sm text-gray-500">
        {[
          { icon: '🔌', text: 'חיבורי חוטים צעד-אחר-צעד' },
          { icon: '💻', text: 'קוד Arduino מוסבר' },
          { icon: '🤖', text: 'עוזר AI תמיד זמין' },
          { icon: '🏆', text: 'מותאם לילדים 8-14' },
        ].map((f) => (
          <div key={f.text} className="flex items-center gap-2">
            <span>{f.icon}</span>
            <span>{f.text}</span>
          </div>
        ))}
      </div>
    </main>
  );
}
