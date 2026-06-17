// Mini-leyenda discreta: el color "ladrillo" marca los 4 primitivos básicos —
// los cimientos del trabajo agéntico, que valen para cualquier IA, no solo Claude.
// Va al pie, justo antes del callout "Sobre este mapa".
const CORE = 'var(--c-core)';

export function MapLegend() {
  return (
    <div className='mt-12 max-w-[62ch] border-l-2 pl-3' style={{ borderColor: CORE }}>
      <p
        className='mapa-display flex items-center gap-1.5 text-sm italic'
        style={{ color: CORE }}
      >
        <span
          aria-hidden
          className='inline-block'
          style={{ width: 8, height: 8, background: CORE }}
        />
        Los primitivos básicos
      </p>
      <p className='text-[13px]' style={{ color: 'var(--ink-soft)' }}>
        El cuadradito (en color ladrillo) marca los cimientos: los mismos cuatro
        en cualquier IA agéntica, no algo exclusivo de Claude.
      </p>
    </div>
  );
}
