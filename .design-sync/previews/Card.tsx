// Authored preview for Card — the compound (Card + Header/Title/Description/
// Action/Content/Footer), composed the way the site uses it. Imports resolve
// to window.RimakesUI via the design-sync story-import shim.
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardAction,
  CardContent,
  CardFooter,
  Button,
} from 'rimakes-ui';

export function Basic() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Crear cuenta</CardTitle>
        <CardDescription>Empieza tu prueba gratuita de 14 días.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Sin tarjeta de crédito. Cancela cuando quieras desde los ajustes de tu
          cuenta.
        </p>
      </CardContent>
      <CardFooter className="gap-3">
        <Button>Crear cuenta</Button>
        <Button variant="outline">Cancelar</Button>
      </CardFooter>
    </Card>
  );
}

export function WithAction() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Plan Pro</CardTitle>
        <CardDescription>Facturación mensual</CardDescription>
        <CardAction>
          <Button variant="ghost" size="sm">
            Cambiar
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-semibold">
          19 €{' '}
          <span className="text-sm font-normal text-muted-foreground">/ mes</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Mejorar plan</Button>
      </CardFooter>
    </Card>
  );
}

export function Stat() {
  return (
    <Card className="w-full max-w-xs">
      <CardHeader>
        <CardDescription>Ingresos del mes</CardDescription>
        <CardTitle className="text-3xl tabular-nums">12.480 €</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          +12,5 % respecto al mes anterior
        </p>
      </CardContent>
    </Card>
  );
}
