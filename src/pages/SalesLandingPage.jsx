import SalesHeader from '../components/shared/SalesHeader';
import SalesFooter from '../components/shared/SalesFooter';
import HeroSection from '../components/sales/HeroSection';
import ImpactSection from '../components/sales/ImpactSection';
import SuccessStoriesSection from '../components/sales/SuccessStoriesSection';
import OffreSection from '../components/sales/OffreSection';
import FAQSection from '../components/sales/FAQSection';
import TrustedBySection from '../components/sales/TrustedBySection';

export default function SalesLandingPage() {
  return (
    <div className="min-h-screen bg-gray-50" style={{
      backgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.02) 1px, transparent 1px)',
      backgroundSize: '20px 20px'
    }}>
      <SalesHeader />
      
      <HeroSection />
      <ImpactSection />
      <SuccessStoriesSection />
      <OffreSection />
      <FAQSection />
      <TrustedBySection />
      
      <SalesFooter />
    </div>
  );
}

