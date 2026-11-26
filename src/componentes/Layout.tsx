import { Suspense } from 'react';
import { Outlet } from 'react-router';
import { Cargando } from './Cargando.tsx';
import { Encabezado } from './Encabezado.tsx';
import { PiePagina } from './PiePagina.tsx';
import { useEnLinea } from '../hooks/useEnLinea.ts';

export function Layout() {
  const enLinea = useEnLinea();

  return (
    <div className="disposicion">
      <Encabezado />
      {!enLinea && (
        <p className="aviso aviso--sin-red" role="status">
          Sin conexión · estás viendo lo último que se guardó en este dispositivo.
        </p>
      )}

      <main className="disposicion__contenido">
        <Suspense fallback={<Cargando />}>
          <Outlet />
        </Suspense>
      </main>

      <PiePagina />
    </div>
  );
}
