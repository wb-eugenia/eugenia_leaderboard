import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: 'Comment fonctionne la plateforme ?',
      answer: 'CampusPlatform permet aux étudiants de soumettre leurs actions, projets et réalisations. Les administrateurs valident ces actions et attribuent des points. Un classement en temps réel motive l\'engagement.'
    },
    {
      question: 'Puis-je personnaliser la plateforme pour mon école ?',
      answer: 'Oui, vous pouvez personnaliser les couleurs, le logo, les types d\'actions, les récompenses et toutes les règles de votre plateforme depuis le panel d\'administration.'
    },
    {
      question: 'Combien coûte la plateforme ?',
      answer: 'Contactez-nous pour obtenir un devis personnalisé selon le nombre d\'étudiants et vos besoins spécifiques.'
    },
    {
      question: 'Y a-t-il une période d\'essai ?',
      answer: 'Oui, nous offrons une période d\'essai gratuite de 30 jours pour vous permettre de tester toutes les fonctionnalités.'
    },
    {
      question: 'Quel support est disponible ?',
      answer: 'Nous offrons un support par email, documentation complète, et sessions de formation pour votre équipe administrative.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Questions Fréquentes
          </h2>
          <p className="text-xl text-gray-600">
            Tout ce que vous devez savoir sur CampusPlatform
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? -1 : index)}
                className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-100 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-lg">
                  {faq.question}
                </span>
                <svg
                  className={`w-5 h-5 text-gray-600 transition-transform ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 text-gray-600 leading-relaxed border-t border-gray-200">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

