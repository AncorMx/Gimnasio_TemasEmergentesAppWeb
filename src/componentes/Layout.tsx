// <Layout> — el marco que comparten todas las páginas.
// Envuelve el <Outlet /> en Suspense para mostrar un indicador de carga
// mientras se descarga el chunk de la página pedida (lazy loading).
import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { Encabezado } from './Encabezado.tsx';
import { PiePagina } from './PiePagina.tsx';
import { Cargando } from './Cargando.tsx';

export function Layout() {
  return (
    <div className="disposicion">
      <Encabezado />
      <main className="disposicion__contenido">
        {/* Suspense muestra <Cargando /> mientras el chunk de la ruta se descarga */}
        <Suspense fallback={<Cargando />}>
          <Outlet />
        </Suspense>
      </main>
      <PiePagina />
    </div>
  );
}
