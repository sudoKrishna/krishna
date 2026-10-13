export function GoltBoltLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden>
      <defs>
        <clipPath id="golt-bolt-left">
          <rect x="0" y="0" width="60" height="120" />
        </clipPath>
        <clipPath id="golt-bolt-right">
          <rect x="60" y="0" width="60" height="120" />
        </clipPath>
      </defs>
      <g clipPath="url(#golt-bolt-left)">
        <path d="M65 50 L65 15 L20 70 L55 70 L55 105 L100 50 Z" fill="#C4B5FD" />
      </g>
      <g clipPath="url(#golt-bolt-right)">
        <path d="M65 50 L65 15 L20 70 L55 70 L55 105 L100 50 Z" fill="#5B21B6" />
      </g>
    </svg>
  );
}
