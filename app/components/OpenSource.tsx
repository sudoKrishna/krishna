"use client";

import { Geist_Mono } from "next/font/google";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

type Contribution = {
  id: number;
  repo: string;
  title: string;
  description: string;
  link: string;
};

const contributions: Contribution[] = [
  {
    id: 41800,
    repo: "RocketChat/Rocket.Chat",
    title: "feat: implement message scheduling",
    description:
      "Added the ability to schedule a message to send later — pick a date and time from the composer, then edit or cancel it anytime before it goes out from a new \"Scheduled messages\" view in the room menu.",
    link: "https://github.com/RocketChat/Rocket.Chat/pull/41800",
  },
  {
    id: 41794,
    repo: "RocketChat/Rocket.Chat",
    title: "refactor: fix IEmoji type and standardize emoji pack types",
    description:
      "IEmoji was typed as a bare { [x: string]: any }, which forced unsafe `as any` casts wherever custom emoji were added or updated. Gave it real fields and a shared IEmojiPackEntry type so the casts could go away — no behavior change, just an honest type.",
    link: "https://github.com/RocketChat/Rocket.Chat/pull/41794",
  },
];

export default function OpenSource() {
  return (
    <section className="px-6 py-10 bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto max-w-4xl">
        <h2 className={`${mono.className} text-lg font-semibold text-[var(--foreground)]`}>
          Open Source
        </h2>

        <p className={`${mono.className} mt-2 text-sm text-[var(--muted)]`}>
          One good PR beats ten that just move a comma around. Quality over quantity.
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {contributions.map((c) => (
            <a
              key={c.id}
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/40"
            >
              <div className={`${mono.className} flex flex-wrap items-baseline gap-2 text-sm`}>
                <span className="text-[var(--muted)]">{c.repo}</span>
                <span className="text-[var(--accent)]">#{c.id}</span>
              </div>

              <h3 className={`${mono.className} mt-1 text-base font-medium text-[var(--foreground)]`}>
                {c.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">
                {c.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
