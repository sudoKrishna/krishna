export function Dotted({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-[4px] h-[4px] opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(90deg, currentColor 0 2px, transparent 2px 5px)",
        }}
      />
    </span>
  );
}
