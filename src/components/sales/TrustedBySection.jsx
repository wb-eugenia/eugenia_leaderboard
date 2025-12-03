export default function TrustedBySection() {
  // Placeholder logos - à remplacer par de vrais logos
  const partners = [
    { name: 'Eugenia School', logo: '🏫' },
    { name: 'Albert School', logo: '🎓' },
    { name: 'Partner 3', logo: '⭐' },
    { name: 'Partner 4', logo: '🌟' },
    { name: 'Partner 5', logo: '💼' },
    { name: 'Partner 6', logo: '🚀' }
  ];

  return (
    <section className="py-20 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Trusted by
          </h2>
          <p className="text-gray-600">
            Des écoles qui nous font confiance
          </p>
        </div>

        {/* Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="flex items-center justify-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-center">
                <div className="text-4xl mb-2">{partner.logo}</div>
                <div className="text-sm text-gray-600 font-medium">
                  {partner.name}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

