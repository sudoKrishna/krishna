import Image from "next/image";
import { Pixelify_Sans } from "next/font/google";
import { Edu_AU_VIC_WA_NT_Guides } from "next/font/google";
import { Edu_NSW_ACT_Cursive } from "next/font/google";
import MenuBar from "./components/Menubar";
import Build from "./components/Build";
import Pack from "./components/Pack";

const cursiveFont = Edu_NSW_ACT_Cursive({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const eduFont = Edu_AU_VIC_WA_NT_Guides({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const pixelify = Pixelify_Sans({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export default function Home() {
  return (
    <div>
    <main className="relative w-screen h-screen overflow-hidden">
      
      {/* Background */}
      <Image
        src="/download.png"
        alt="Background"
        fill
        className="object-cover brightness-50"
        priority
      />

      <div className="absolute inset-0 bg-black/30" />

      {/* Main Text */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center -translate-y-15 gap-6 text-white">
        
        <h2 className={`${pixelify.className} text-6xl md:text-8xl drop-shadow-lg`}>
          Hi! I am Krishna
        </h2>

        <h1 className={`${cursiveFont.className} text-2xl drop-shadow-lg`}>
          A focused Full Stack Developer.
        </h1>

      </div>

      {/* Choose Your Path */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center translate-y-30 gap-6 text-white">
        
        <h3 className={`${pixelify.className} text-gray-300 text-xl`}>
          ------ CHOOSE YOUR PATH ------
        </h3>

       
        <div className="flex gap-6 mt-4">

        
         {/* Tabs Container */}
<div className="flex gap-6 mt-4">

  {/* WORK TAB */}
  <div className="relative px-25 py-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition cursor-pointer">

    {/* Top-left number */}
    <p className={`${cursiveFont.className} absolute top-3 left-4 text-sm text-white/70`}>
      01
    </p>

    {/* Top-right arrow */}
    <p className="absolute top-3 right-4 text-white/70 text-lg">
      →
    </p>

    {/* Bottom-right label */}
    <p className={`${pixelify.className} absolute bottom-3 right-4 text-lg`}>
      The Life
    </p>

  </div>

  {/* LIFE TAB */}
  <div className="relative px-25 py-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 shadow-lg hover:bg-white/20 transition cursor-pointer">

    {/* Top-left number */}
    <p className={`${cursiveFont.className} absolute top-3 left-4 text-sm text-white/70`}>
      02
    </p>

    {/* Top-right arrow */}
    <p className="absolute top-3 right-4 text-white/70 text-lg">
      →
    </p>

    {/* Bottom-right label */}
    <p className={`${pixelify.className} absolute bottom-3 right-4 text-lg`}>
      The Work
    </p>

  </div>

</div>

        </div>

      </div>

     

    </main>
       <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-99">
        <MenuBar />
      </div>
      <div>
        <Build />
        <Pack />
      </div>
      
    </div>

    
  );
}