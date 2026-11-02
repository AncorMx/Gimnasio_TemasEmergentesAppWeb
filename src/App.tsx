import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';
import { Layout } from './componentes/Layout.tsx';
import { NoEncontrado } from './componentes/NoEncontrado.tsx';
import { RutaProtegida } from './componentes/RutaProtegida.tsx';

// Cada página se carga solo cuando el usuario la visita (code-splitting por ruta).
const PaginaClase             = lazy(() => import('./paginas/PaginaClase.tsx').then(m => ({ default: m.PaginaClase })));
const PaginaClases            = lazy(() => import('./paginas/PaginaClases.tsx').then(m => ({ default: m.PaginaClases })));
const PaginaEntrar            = lazy(() => import('./paginas/PaginaEntrar.tsx'));
const PaginaMisInscripciones  = lazy(() => import('./paginas/PaginaMisInscripciones.tsx').then(m => ({ default: m.PaginaMisInscripciones })));
const PaginaRegistro          = lazy(() => import('./paginas/PaginaRegistro.tsx'));

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/clases" replace />} />

        <Route path="clases">
          {/*
           * Suspense está en el Layout (envuelve el <Outlet />),
           * así que no hace falta repetirlo aquí.
           */}
          <Route index element={<PaginaClases />} />
          <Route path=":id" element={<PaginaClase />} />
        </Route>

        <Route element={<RutaProtegida />}>
          <Route path="mis-inscripciones" element={<PaginaMisInscripciones />} />
        </Route>

        <Route path="entrar" element={<PaginaEntrar />} />
        <Route path="registro" element={<PaginaRegistro />} />

        <Route path="*" element={<NoEncontrado />} />
      </Route>
    </Routes>
  );
}

export default App;
