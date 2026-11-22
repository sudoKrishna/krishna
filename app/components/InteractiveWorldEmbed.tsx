import Script from "next/script";

export function InteractiveWorldEmbed() {
  return (
    <section aria-label="Interactive garden" className="interactive-world-embed mt-20">
      <div className="interactive-world-frame">
        <canvas id="scene" tabIndex={0} aria-label="Move your cursor to guide the samurai. Click to dash. Click a tree to release its leaves." />
        <span className="sr-only" id="season">Late spring · 16:42</span>
        <span className="sr-only" id="whisper">Even a warrior needs a quiet afternoon.</span>
        <button className="sound" id="sound" aria-label="Enable garden sounds" aria-pressed="false"><svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11 4 5 9H2v6h3l6 5z" /><path id="soundpath" d="m16 9 6 6m0-6-6 6" /></svg></button>
        <button id="reset" className="sr-only" aria-label="Reset garden">Begin again</button>
        <div className="sr-only" aria-live="polite" id="announcement" />
      </div>
      <Script src="/interactive-world/garden.js" strategy="afterInteractive" />
    </section>
  );
}
