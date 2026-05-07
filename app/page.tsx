import Image from "next/image";
import { Pixelify_Sans } from "next/font/google";
import { Edu_AU_VIC_WA_NT_Guides } from "next/font/google";
import {
  Edu_NSW_ACT_Cursive,
} from "next/font/google";


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
    <main className="relative w-screen h-screen overflow-hidden">
      
      {/* Background Image */}
      <Image
        src="/download.png"
        alt="Background"
        fill
        className="object-cover brightness-50"
        priority
      />

     
      <div className="absolute inset-0 bg-black/30" />

      
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center -translate-y-15 gap-6 text-white">
        <h2
          className={`${pixelify.className} text-8xl md:text-8xl  drop-shadow-lg`}
        >
          Hi! I am Krishna
        </h2>

        <h1 className={`${cursiveFont.className} text-2xl  drop-shadow-lg`}>
           A focused Full Stack Developer.
        </h1>

      </div>
    </main>
  );
}