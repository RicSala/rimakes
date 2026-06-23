// Authored preview for Button — each PascalCase export is one graded cell.
// Imports resolve to window.RimakesUI (the real shipped bundle) via the
// design-sync story-import shim. Content mirrors how the site actually uses
// Button (Spanish-first, real action labels).
import { Button } from 'rimakes-ui';

// Inline icons (no icon dep) to exercise the button's [&_svg] sizing rules.
function ArrowRight() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

function Trash() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  );
}

function Row({ children }) {
  return <div className="flex flex-wrap items-center gap-3">{children}</div>;
}

export function Variants() {
  return (
    <Row>
      <Button>Guardar cambios</Button>
      <Button variant="secondary">Cancelar</Button>
      <Button variant="destructive">Eliminar cuenta</Button>
      <Button variant="outline">Más opciones</Button>
      <Button variant="ghost">Saltar</Button>
      <Button variant="link">Saber más</Button>
    </Row>
  );
}

export function Sizes() {
  return (
    <Row>
      <Button size="sm">Pequeño</Button>
      <Button size="default">Por defecto</Button>
      <Button size="lg">Grande</Button>
      <Button size="icon" aria-label="Siguiente">
        <ArrowRight />
      </Button>
    </Row>
  );
}

export function WithIcon() {
  return (
    <Row>
      <Button>
        Continuar <ArrowRight />
      </Button>
      <Button variant="destructive">
        <Trash /> Eliminar
      </Button>
      <Button variant="outline">
        <Trash /> Quitar de la lista
      </Button>
    </Row>
  );
}

export function Disabled() {
  return (
    <Row>
      <Button disabled>Guardar</Button>
      <Button variant="secondary" disabled>
        Cancelar
      </Button>
      <Button variant="outline" disabled>
        Editar
      </Button>
    </Row>
  );
}

export function AsLink() {
  return (
    <Row>
      <Button asChild>
        <a href="#">Ir al panel</a>
      </Button>
      <Button asChild variant="outline">
        <a href="#">Ver documentación</a>
      </Button>
      <Button asChild variant="link">
        <a href="#">Enlace de texto</a>
      </Button>
    </Row>
  );
}
