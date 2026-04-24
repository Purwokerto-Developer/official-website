import NavbarSection from '@/components/navbar';
import AboutSection from './about-section';
import EventsSection from './events-section';
import CommunitySection from './community-section';
import HeroSection from './hero-section';
import JoinSection from './join-section';
import FooterSection from './footer-section';
import { getServerSession } from '@/lib/better-auth/get-session';
import { getUpcomingEvents } from '@/action/dashboard-action';

const LandingPage = async () => {
  const session = await getServerSession();
  const upcomingEvents = await getUpcomingEvents();

  return (
    <div className="relative mx-auto w-full">
      <NavbarSection session={session} />
      <HeroSection />
      <AboutSection />
      <EventsSection events={upcomingEvents} />
      <CommunitySection />
      <JoinSection />
      <FooterSection />
    </div>
  );
};

export default LandingPage;
