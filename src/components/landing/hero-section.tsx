'use client'
import DotGrid from "@/components/DotGrid"
import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"
import dynamic from "next/dynamic"

const HeroSection = () => {
  const { resolvedTheme } = useTheme()

  const baseColor = resolvedTheme === "dark" ? "#1F2038" : "#F1F5F9" 
  const activeColor = resolvedTheme === "dark" ? "#2930FF" : "#74d4ff" 

  const textGradientClass =
    resolvedTheme === "dark"
      ? "bg-gradient-to-b from-white to-slate-500"
      : "bg-gradient-to-b from-blue-200 to-blue-700"

  return (
    <section id="hero" className='relative z-0 flex min-h-screen w-full flex-col items-start justify-start overflow-hidden'>

      <div className="absolute inset-0 -z-10 w-full h-full">
        <DotGrid
          dotSize={5}
          gap={15}
          baseColor={baseColor}
          activeColor={activeColor}
          proximity={120}
          shockRadius={250}
          shockStrength={5}
          resistance={750}
          returnDuration={1.5}
          style={{ width: '100vw', height: '100vh' }}
        />
        <div className="hero-radial-gradient" />
      </div>

      <div className="mt-60 w-full z-10 flex flex-col items-center justify-center gap-4">
        <div className="dark:bg-gradient-to-b border dark:from-slate-900/80 dark:to-slate-700/80 opacity-80 hover:scale-105 bg-gradient-to-tr from-slate-200/80 to-slate-100/80 cursor-pointer transition-all duration-200 backdrop-blur-lg rounded-full px-2 py-3 w-fit text-center dark:text-slate-300 text-slate-800 font-medium">
          <span className="bg-gradient-to-b from-primary to-blue-700 text-white p-2 rounded-full mr-4 text-sm">Hello 🎉</span>
          Welcome to the community
        </div>

        <h1
          className={cn(`relative z-10 text-lg md:text-7xl lg:text-[150px] bg-clip-text text-transparent text-center font-sans font-bold capitalize `, textGradientClass)}
        >
          Purwokerto<span className='font-light'>Dev</span>
        </h1>

        <p className="relative mx-auto mt-4 max-w-xl text-center text-slate-400 dark:text-white text-xl">
          Komunitas Developer Purwokerto. Wadah Komunitas Developer Purwokerto untuk Berkreasi, Terkoneksi, dan Berkolaborasi.
        </p>
      </div>
    </section>
  )
}

export default dynamic(() => Promise.resolve(HeroSection), { ssr: false })
