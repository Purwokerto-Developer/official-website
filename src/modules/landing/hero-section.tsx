import DecryptedText from '@/components/DecryptedText'
import React from 'react'

const HeroSection = () => {
  return (
    <section id="hero" className='w-full mx-auto flex justify-center'>
      <div className="flex gap-2 items-center text-center p-2 text-sm bg-slate-900/10 rounded-full border border-slate-900/10 dark:bg-slate-200/10 dark:border-slate-200/10">
     👋  <DecryptedText animateOn='both' speed={200} parentClassName="all-letters"
encryptedClassName="encrypted" text="Hello, welcome to the club " />
      </div>
    </section>
  )
}

export default HeroSection