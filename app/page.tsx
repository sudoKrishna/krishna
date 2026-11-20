import Hero from "./components/Hero";
import { CardRow } from "./components/CardRow";
import { EdgeBlur } from "./components/EdgeBlur";
import { PeaceOut } from "./components/PeaceOut";
import { MoreLinks } from "./components/MoreLinks";

export default function Home() {
  return (
    <div className="bg-[var(--background)] text-[var(--foreground)]">
      <EdgeBlur />

      <Hero />

      <CardRow />

      <div className="mx-auto w-full max-w-4xl px-6 pt-16">
        <h2 className="text-[15px] font-medium text-[#1a1a1a]">More</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          <MoreLinks />
        </p>
      </div>

      <PeaceOut />
    </div>
  );
}
