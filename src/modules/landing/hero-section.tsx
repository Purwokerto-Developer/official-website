import { BackgroundRippleEffect } from "@/components/ui/background-ripple-effect"
import  ShinyText  from "@/components/ShinyText"
const HeroSection = () => {
  return (
    <section id="hero" className='relative z-0 flex min-h-screen w-full flex-col items-start justify-start overflow-hidden'>
      <BackgroundRippleEffect  rows={15}/>
       <div className="mt-60 w-full z-10 flex flex-col items-center justify-center gap-4">
        <div className="dark:bg-gradient-to-tr border  dark:from-slate-900/80 dark:to-slate-700/80 opacity-80 hover:scale-105 bg-gradient-to-tr from-slate-200/80 to-slate-100/80 cursor-pointer transition-all duration-200 backdrop-blur-lg rounded-full px-2 py-3 w-fit  text-center dark:text-slate-300 text-slate-800 font-medium"><span className="bg-gradient-to-tr from-primary to-blue-700 text-white p-2 rounded-full mr-4 text-sm">Hello 🎉</span> Welcome to the commmunity</div>
   
    <h1 className="relative z-10 text-lg md:text-7xl lg:text-[150px]  bg-clip-text text-transparent bg-gradient-to-b from-slate-200 to-slate-600  text-center font-sans font-bold capitalize">
          Purwokerto<span className='font-light'>Dev</span></h1>
        <p className="relative  mx-auto mt-4 max-w-xl text-center text-slate-800 dark:text-slate-500 text-xl">
          Komunitas Developer Purwokerto. Wadah Komunitas Developer Purwokerto untuk Berkreasi, Terkoneksi dan Berkolaborasi.
        </p>
      </div>
      <div className="z-10 text-center flex flex-col h-full items-center justify-center w-full  px-4">
      </div>
      <p className="text-[100px] md:text-[500px] lg:text-[900px] font-black absolute -left-96 -bottom-[600px] text-black z-10">Purwokerto</p>
    </section>
  )
}

export default HeroSection