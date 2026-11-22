import Script from "next/script";

export const metadata = {
  title: "The Quiet Blade — Interactive Garden",
  description: "A small interactive Japanese garden with a wandering samurai.",
};

export default function InteractiveWorldPage() {
  return (
    <>
      <link rel="stylesheet" href="/interactive-world/style.css" />
      <main className="world-page">
        <header><a className="brand" href="/" aria-label="Back to Krishna home"><span className="seal">静</span><span>STILL / PLAY</span></a><div className="topnote">A small place to be.</div><button id="theme" aria-label="Switch to evening">◐ <span>Daylight</span></button></header>
        <section className="intro"><div><p className="eyebrow">AN INTERACTIVE LITTLE WORLD</p><h1>The quiet blade<span>.</span></h1></div><p>Nowhere to go. Nothing to conquer.<br />Just you, a sword, and a little garden.</p></section>
        <section className="garden" aria-label="Interactive samurai garden"><canvas id="scene" tabIndex={0} aria-label="Move your cursor to guide the samurai. Click to dash. Click a tree to release its leaves. You can also use arrow keys to walk and Space to dash." /><div className="scene-label"><span className="live" /><span id="season">Late spring · 16:42</span></div><div className="whisper" id="whisper">Even a warrior needs a quiet afternoon.</div><button className="sound" id="sound" aria-label="Enable garden sounds" aria-pressed="false"><svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M11 4 5 9H2v6h3l6 5z" /><path id="soundpath" d="m16 9 6 6m0-6-6 6" /></svg></button><div className="corner">風と、静けさ。</div></section>
        <footer><div className="instructions"><span><i className="cursor-icon">↖</i> Move to wander</span><span><i className="click-icon" /> Click to flash</span><span className="tree-hint">✿ Click a tree</span><span className="keyboard"><kbd>↑</kbd><kbd>↓</kbd><kbd>←</kbd><kbd>→</kbd> to walk</span></div><button id="reset">Begin again <span>↺</span></button></footer><p className="footnote">Take a breath. Stay a little.</p><div className="sr-only" aria-live="polite" id="announcement" />
      </main>
      <Script src="/interactive-world/garden.js" strategy="afterInteractive" />
    </>
  );
}
