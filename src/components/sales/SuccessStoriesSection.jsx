export default function SuccessStoriesSection() {
  const stories = [
    {
      metric: '2.3x',
      metricLabel: 'increase in lead conversion',
      quote: 'CampusPlatform completely redefined our digital presence. Their strategic design approach and attention to user behavior boosted our conversion rate significantly. We went from just a pretty site to a performance-driven asset.',
      author: {
        name: 'Sarah Coleman',
        role: 'CMO',
        avatar: '👩'
      },
      logo: 'Google'
    },
    {
      metric: '45%',
      metricLabel: 'Reduced bounce rate',
      quote: 'The team at CampusPlatform not only built us a beautiful platform—they made it fast, smart, and incredibly intuitive. Their UX insights and performance tweaks made a huge difference in keeping users engaged.',
      author: {
        name: 'Marcus Levine',
        role: 'Co-founder',
        avatar: '👨'
      },
      logo: 'Startup'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            We're loved.
          </h2>
          <p className="text-4xl md:text-5xl font-bold text-gray-600">
            Just success stories.
          </p>
        </div>

        {/* Stories Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stories.map((story, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
              {/* Metric */}
              <div className="mb-6">
                <div className="text-5xl font-bold text-gray-900 mb-2">
                  {story.metric}
                </div>
                <div className="text-lg text-gray-600">
                  {story.metricLabel}
                </div>
              </div>

              {/* Quote Icon */}
              <div className="text-red-600 text-6xl mb-6">"</div>

              {/* Quote Text */}
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                {story.quote}
              </p>

              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                  {story.author.avatar}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">
                    {story.author.name}
                  </div>
                  <div className="text-gray-600 text-sm">
                    {story.author.role}
                  </div>
                </div>
                {/* Logo placeholder */}
                <div className="ml-auto text-gray-400 text-sm">
                  {story.logo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

