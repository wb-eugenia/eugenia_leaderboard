export default function ImpactSection() {
  const metrics = [
    {
      value: '500+',
      label: 'Successful projects delivered',
      description: 'We build high-impact websites and digital experiences for startups and enterprises to scale fast'
    },
    {
      value: '240%',
      label: 'Increased in conversion rate',
      description: 'Purpose-built digital experiences that elevate brands and increase conversion rates at every touchpoint.'
    },
    {
      value: '$100M+',
      label: 'Seed + series A funding',
      description: 'Through strategic design, marketing, and conversion optimization, we\'ve helped businesses scale faster.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className="text-red-600 text-2xl font-bold">//</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Impact</h2>
            <span className="text-red-600 text-2xl font-bold">//</span>
          </div>
          <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            CampusPlatform makes it simple,
          </h3>
          <p className="text-4xl md:text-5xl font-bold text-gray-600">
            and delivers results.
          </p>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-6xl md:text-7xl font-bold text-gray-900 mb-4">
                {metric.value}
              </div>
              <div className="text-xl font-semibold text-gray-900 mb-4">
                {metric.label}
              </div>
              <p className="text-gray-600 leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

