import { Inter } from "next/font/google";

import { PillNav } from "./PillNav";
import { KrishnaName } from "./KrishnaName";
import { Dotted } from "./Dotted";
import { FigmaText } from "./FigmaText";

const inter = Inter({ subsets: ["latin"], weight: ["400", "500"] });

export default function Hero() {
  return (
    <div className={`${inter.className} flex min-h-screen flex-col px-6`}>
      <div className="pt-8">
        <PillNav />
      </div>

      <div className="flex flex-1 items-center justify-center pb-48">
        <div className="max-w-[520px] w-full space-y-5 text-[17px] leading-relaxed text-neutral-500">
          <p className="text-neutral-400 text-[15px]">Hey,</p>

          <p>
            I&apos;m <KrishnaName /> —{" "}
            a 19-year-old <FigmaText /> based in <Dotted>India</Dotted>.
          </p>

          <p>
            I like <span className="font-medium text-neutral-800">building</span> clean projects
            that feel effortless, the kind that make products feel more{" "}
            <span className="font-medium text-neutral-800">alive</span>.
          </p>

          <p>
            Reach out at{" "}
            <span className="inline-flex items-center bg-neutral-100 text-neutral-600 text-[15px] px-2.5 py-0.5 rounded-md">
              krishnachaudhary2007gt@gmail.com
            </span>
            . I&apos;m open to work.
          </p>
        </div>
      </div>
    </div>
  );
}
