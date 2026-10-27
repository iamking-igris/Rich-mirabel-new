export function WaveDiagram() {
  const width = 640;
  const height = 220;
  const mid = 110;
  const amp = 52;
  const points = Array.from({ length: 121 }, (_, i) => {
    const x = 48 + i * 4.6;
    const y = mid - Math.sin((i / 120) * Math.PI * 4) * amp;
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label="Transverse wave showing wavelength and amplitude">
        <line x1="40" y1="16" x2="40" y2="204" stroke="#1a2420" strokeWidth="1.5" />
        <line x1="40" y1={mid} x2="610" y2={mid} stroke="#1a2420" strokeWidth="1.5" />
        <path d={points} fill="none" stroke="#0d6b52" strokeWidth="2.5" />
        <line x1="48" y1={mid - amp} x2="48" y2={mid} stroke="#a6843d" strokeWidth="1.5" />
        <text x="54" y={mid - amp + 14} fill="#a6843d" fontSize="13" fontFamily="Outfit, sans-serif">
          amplitude
        </text>
        <line x1="163" y1="36" x2="394" y2="36" stroke="#1a2420" strokeWidth="1.25" />
        <line x1="163" y1="30" x2="163" y2="42" stroke="#1a2420" strokeWidth="1.25" />
        <line x1="394" y1="30" x2="394" y2="42" stroke="#1a2420" strokeWidth="1.25" />
        <text x="240" y="28" fill="#1a2420" fontSize="13" fontFamily="Outfit, sans-serif">
          wavelength λ
        </text>
        <text x="520" y={mid + 28} fill="#5e6a62" fontSize="12" fontFamily="Outfit, sans-serif">
          distance
        </text>
        <text x="8" y="24" fill="#5e6a62" fontSize="12" fontFamily="Outfit, sans-serif">
          disp.
        </text>
      </svg>
      <figcaption className="border-t border-line px-4 py-3 text-sm text-muted">
        Crest to crest is one wavelength. Amplitude is the height from the rest line, not crest to trough.
      </figcaption>
    </figure>
  );
}

export function CellDiagram() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-surface">
      <svg viewBox="0 0 640 240" className="h-auto w-full" role="img" aria-label="Simple animal cell with labelled parts">
        <ellipse cx="300" cy="120" rx="210" ry="90" fill="#f4efe6" stroke="#0d6b52" strokeWidth="3" />
        <circle cx="250" cy="118" r="36" fill="#fffdf8" stroke="#1a2420" strokeWidth="2" />
        <circle cx="258" cy="114" r="12" fill="#0d6b52" />
        <ellipse cx="360" cy="90" rx="28" ry="14" fill="none" stroke="#a6843d" strokeWidth="2" />
        <ellipse cx="340" cy="150" rx="22" ry="12" fill="none" stroke="#a6843d" strokeWidth="2" />
        <text x="430" y="70" fill="#1a2420" fontSize="14" fontFamily="Outfit, sans-serif">membrane</text>
        <line x1="430" y1="76" x2="500" y2="100" stroke="#1a2420" strokeWidth="1" />
        <text x="168" y="70" fill="#1a2420" fontSize="14" fontFamily="Outfit, sans-serif">nucleus</text>
        <line x1="200" y1="78" x2="230" y2="100" stroke="#1a2420" strokeWidth="1" />
        <text x="390" y="160" fill="#1a2420" fontSize="14" fontFamily="Outfit, sans-serif">mitochondria</text>
        <line x1="390" y1="150" x2="368" y2="108" stroke="#1a2420" strokeWidth="1" />
      </svg>
      <figcaption className="border-t border-line px-4 py-3 text-sm text-muted">
        Animal cell sketch for labelling practice. A plant cell would add a cell wall and chloroplasts.
      </figcaption>
    </figure>
  );
}

export function BalanceDiagram() {
  return (
    <figure className="overflow-hidden rounded-2xl border border-line bg-surface p-4 sm:p-6">
      <div className="grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
        <div className="rounded-xl bg-soft px-4 py-4 text-center">
          <p className="text-sm text-muted">Reactants</p>
          <p className="mt-1 font-display text-2xl text-ink">2H₂ + O₂</p>
          <p className="mt-2 text-sm text-muted">4 H · 2 O</p>
        </div>
        <p className="text-center font-display text-3xl text-primary" aria-hidden>
          →
        </p>
        <div className="rounded-xl bg-soft px-4 py-4 text-center">
          <p className="text-sm text-muted">Products</p>
          <p className="mt-1 font-display text-2xl text-ink">2H₂O</p>
          <p className="mt-2 text-sm text-muted">4 H · 2 O</p>
        </div>
      </div>
      <figcaption className="mt-3 text-sm text-muted">Same atoms on both sides. The coefficients changed; the formulas did not.</figcaption>
    </figure>
  );
}
