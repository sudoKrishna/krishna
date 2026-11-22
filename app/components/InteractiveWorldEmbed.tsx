import Script from "next/script";

export function InteractiveWorldEmbed() {
  return (
    <section aria-labelledby="world-heading" className="interactive-world-embed mt-20">
      <div className="interactive-world-heading">
        <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-[#8b8f86]">Interactive world</p>
        <h2 id="world-heading" className="mt-2 text-[24px] font-medium tracking-[-0.03em] text-[#1a1a1a] sm:text-[28px]">The Quiet Blade</h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-[#72786f]">Move through a small Japanese garden with a samurai, koi pond, falling petals, and a house.</p>
      </div>
      <div className="interactive-world-frame mt-6">
        <canvas id="scene" tabIndex={0} aria-label="Move your cursor to guide the samurai. Click to dash. Click a tree to release its leaves." />
        <div className="scene-label"><span className="live" /><span id="season">Late spring · 16:42</span></div>
        <div className="whisper" id="whisper">Even a warrior needs a quiet afternoon.</div>
        <button className="sound" id="sound" aria-label="Enable garden sounds" aria-pressed="false"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11 4 5 9H2v6h3l6 5z" /><path id="soundpath" d="m16 9 6 6m0-6-6 6" /></svg></button>
        <div className="interactive-world-caption">move · click · wander</div>
      </div>
      <div className="interactive-world-controls"><span>↖ Move to wander</span><span>◌ Click to flash</span><span>✿ Click a tree for leaves</span><button id="reset">Begin again ↺</button></div>
      <div className="sr-only" aria-live="polite" id="announcement" />
      <Script src="/interactive-world/garden.js" strategy="afterInteractive" />
    </section>
  );
}
