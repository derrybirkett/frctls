interface HeroProps {
  title: string;
  description: string;
  ctaText?: string;
  ctaHref?: string;
}

export function Hero({ title, description, ctaText = 'Get Started', ctaHref = '#' }: HeroProps) {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
          {description}
        </p>
        <a
          href={ctaHref}
          className="inline-block px-8 py-4 text-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          {ctaText}
        </a>
      </div>
    </div>
  );
}
