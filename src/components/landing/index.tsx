import NavbarSection from '@/components/navbar';
import AboutSection from './about-section';
import BlogSection from './blog-section';
import EventSection from './event-section';
import HeroSection from './hero-section';
import JoinSection from './join-section';
import ShowcaseSection from './showcase-section';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';

const LandingPage = () => {
  return (
    <div className="max-7xl relative mx-auto h-screen w-full overflow-hidden">
      <NavbarSection />
      <HeroSection />
      <AboutSection />
      <EventSection />
      <BlogSection />
      <ShowcaseSection />
      <JoinSection />
      <ProgressiveBlur />
    </div>
  );
};

export default LandingPage;
