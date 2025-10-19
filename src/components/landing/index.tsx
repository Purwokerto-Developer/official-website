import NavbarSection from '@/components/navbar';
import AboutSection from './about-section';
import BlogSection from './blog-section';
import HeroSection from './hero-section';
import JoinSection from './join-section';
import ShowcaseSection from './showcase-section';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';
import { getServerSession } from '@/lib/better-auth/get-session';

const LandingPage = async () => {
  const session = await getServerSession();
  return (
    <div className="max-7xl relative mx-auto h-screen w-full overflow-hidden">
      <NavbarSection session={session} />
      <HeroSection />
      <AboutSection />
      <BlogSection />
      <ShowcaseSection />
      <JoinSection />
      <ProgressiveBlur />
    </div>
  );
};

export default LandingPage;
