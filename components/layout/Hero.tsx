interface HeroProps {
  title?: string;
  description?: string;
}

export default function Hero({ 
  title = "Al-Asr Islamic Service",
  description = "Islamic services, calendar events, and community programs. Stay updated with the latest from Al-Asr Islamic Service."
}: HeroProps) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 md:py-24">
      <div className="absolute inset-0 bg-black/10 dark:bg-black/20" />
      
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-300 rounded-full mix-blend-overlay blur-3xl" />
      </div>

      <div className="container relative mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          {/* Logo/Brand */}
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/20">
            <div className="text-white text-2xl font-bold">ع</div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          
          {/* Description */}
          <p className="text-xl text-blue-100 dark:text-blue-200 mb-8 leading-relaxed max-w-2xl mx-auto">
            {description}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/blog"
              className="inline-flex items-center justify-center px-8 py-3 bg-white text-blue-700 font-semibold rounded-xl hover:bg-blue-50 transition shadow-lg hover:shadow-xl"
            >
              Start Reading
            </a>
            <a
              href="/categories"
              className="inline-flex items-center justify-center px-8 py-3 bg-transparent text-white font-semibold rounded-xl border-2 border-white/30 hover:border-white/60 transition backdrop-blur-sm"
            >
              Browse Categories
            </a>
          </div>
          
          {/* Stats preview (small) */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">1,234+</div>
                <div className="text-sm text-blue-200">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">24</div>
                <div className="text-sm text-blue-200">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">48</div>
                <div className="text-sm text-blue-200">Authors</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white">10K+</div>
                <div className="text-sm text-blue-200">Daily Readers</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}