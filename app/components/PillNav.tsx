'use client'

import { useRouter, usePathname } from 'next/navigation'

import { playSound, SOUNDS } from '@/app/lib/sound'

export function PillNav() {
  const router = useRouter()
  const pathname = usePathname()
  const active = pathname === '/project' ? 'work' : 'home'

  return (
    <nav className="flex justify-center mb-11">
      <div className="relative inline-flex gap-1 bg-neutral-200/70 rounded-full p-1">
        <div
          className="absolute top-1 left-1 w-10 h-10 bg-white rounded-full shadow-sm transition-transform duration-[380ms] ease-[cubic-bezier(.65,0,.35,1)]"
          style={{ transform: active === 'work' ? 'translateX(44px)' : 'translateX(0)' }}
        />
        <button
          onClick={() => {
            if (active !== 'home') playSound(SOUNDS.info, 0.5)
            router.push('/')
          }}
          aria-label="Home"
          className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ${
            active === 'home' ? 'text-neutral-900' : 'text-neutral-400'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
            <path d="M12 2.6 1.6 11h3.2v10h5.6v-6.4h3.2V21h5.6V11h3.2L12 2.6Z" />
          </svg>
        </button>
        <button
          onClick={() => {
            if (active !== 'work') playSound(SOUNDS.info, 0.5)
            router.push('/project')
          }}
          aria-label="Work"
          className={`relative z-10 w-10 h-10 flex items-center justify-center rounded-full transition-colors duration-300 ${
            active === 'work' ? 'text-neutral-900' : 'text-neutral-400'
          }`}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
            <path d="M9 3a2 2 0 0 0-2 2v1H4.5A2.5 2.5 0 0 0 2 8.5V10h20V8.5A2.5 2.5 0 0 0 19.5 6H17V5a2 2 0 0 0-2-2H9Zm0 2h6v1H9V5ZM2 11.5V17a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-5.5H2Zm9 1.5h2v2h-2v-2Z" />
          </svg>
        </button>
      </div>
    </nav>
  )
}
