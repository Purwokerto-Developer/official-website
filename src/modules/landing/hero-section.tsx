import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"

const HeroSection = () => {
  return (
    <section id="hero" className='relative z-0 flex min-h-screen w-full flex-col items-start justify-start overflow-hidden'>
      <BackgroundRippleEffect  rows={15}/>
       <div className="mt-60 w-full z-10">
     <h1 className='text-8xl text-center font-black z-10'>PURWOKERTO<span className='font-light'>DEV</span></h1>
        <p className="relative  mx-auto mt-4 max-w-xl text-center text-neutral-800 dark:text-neutral-500">
          Hover over the boxes above and click.To be used on backgrounds of hero
          sections OR Call to Action sections. I beg you don&apos;t use it
          everywhere.
        </p>
      </div>
      <div className="z-10 text-center flex flex-col h-full items-center justify-center w-full  px-4">
      </div>
    </section>
  )
}

export default HeroSection