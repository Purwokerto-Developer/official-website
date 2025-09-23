import AboutSection from './about-section'
import BlogSection from './blog-section'
import EventSection from './event-section'
import HeroSection from './hero-section'
import JoinSection from './join-section'
import ShowcaseSection from './showcase-section'

const LandingPage = () => {
  return (
    <div className="max-7xl w-full mx-auto">   
      <HeroSection />
      <AboutSection />
      <EventSection />
      <BlogSection />
      <ShowcaseSection />
      <JoinSection />
    </div>
  )
}

export default LandingPage