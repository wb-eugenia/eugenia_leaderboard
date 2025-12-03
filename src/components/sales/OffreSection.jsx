export default function OffreSection() {
  const features = [
    {
      title: 'Plateforme Complète',
      description: 'Tout ce dont vous avez besoin pour gérer votre communauté étudiante en un seul endroit.',
      icon: '🎯'
    },
    {
      title: 'Personnalisation Totale',
      description: 'Adaptez la plateforme à votre école avec vos couleurs, votre logo et vos règles.',
      icon: '🎨'
    },
    {
      title: 'Support Dédié',
      description: 'Une équipe à vos côtés pour vous aider à configurer et optimiser votre plateforme.',
      icon: '💬'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Notre Offre
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une solution complète pour valoriser l'engagement et les talents de vos étudiants
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-5xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <button className="px-8 py-4 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors">
            Découvrir l'offre complète
          </button>
        </div>
      </div>
    </section>
  );
}

