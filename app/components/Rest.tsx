"use client";

import { Geist_Mono } from "next/font/google";
import { Mail } from "lucide-react";

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const socials = [
  {
    icon: "/git.png",
    href: "https://github.com/sudoKrishna",
    label: "GitHub",
  },
  {
    icon: "/x.png",
    href: "https://x.com/cha73066",
    label: "X",
  },
  {
    icon: "/link.png",
    href: "https://www.linkedin.com/in/krishna-chaudhary-1b287526b/",
    label: "LinkedIn",
  },
];

export default function Rest() {
  return (
    <section className="px-6 py-10 bg-[var(--background)]">
      <div className="mx-auto max-w-4xl">
        <h2 className={`${mono.className} text-lg font-semibold text-[var(--foreground)]`}>
          Contact
        </h2>

        <div className="mt-4 flex flex-wrap items-center gap-6">
          <a
            href="mailto:krishnachaudhary2007gt@gmail.com"
            className={`${mono.className} flex items-center gap-2 text-sm text-[var(--accent-cyan)] hover:text-[var(--accent)] hover:underline`}
          >
            <Mail size={16} />
            krishnachaudhary2007gt@gmail.com
          </a>

          {socials.map((social, index) => (
            <a
              key={index}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${mono.className} text-sm text-[var(--muted)] hover:text-[var(--accent)] hover:underline`}
            >
              {social.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
