import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import type { Sesion } from '../tipos.ts';
import { entrar as entrarApi, registrar as registrarApi } from '../servicios/sesion.ts';
import { EVENTO_SESION_TERMINADA } from '../servicios/api.ts';
import { useInscripcionesStore } from '../store/inscripciones.ts';

const CLAVE_SESION = 'gimnasio.sesion';

interface ValorSesion {
  sesion: Sesion | null;
  entrar: (correo: string, password: string) => Promise<void>;
  registrar: (nombre: string, correo: string, password: string) => Promise<void>;
  salir: () => void;
}

const SesionContext = createContext<ValorSesion | null>(null);

function leerSesion(): Sesion | null {
  const guardada = localStorage.getItem(CLAVE_SESION);
  if (!guardada) return null;

  try {
    return JSON.parse(guardada) as Sesion;
  } catch {
    localStorage.removeItem(CLAVE_SESION);
    return null;
  }
}

export function SesionProvider({ children }: { children: ReactNode }) {
  const [sesion, setSesion] = useState<Sesion | null>(leerSesion);

  // Acciones del store de inscripciones
  const cargarInscripciones = useInscripcionesStore((s) => s.cargar);
  const vaciarInscripciones = useInscripcionesStore((s) => s.vaciar);

  // Si ya hay sesión guardada al montar, cargar las inscripciones del usuario
  useEffect(() => {
    if (sesion) {
      void cargarInscripciones();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    function cerrarSesion() {
      setSesion(null);
      vaciarInscripciones();
    }

    window.addEventListener(EVENTO_SESION_TERMINADA, cerrarSesion);

    return () => {
      window.removeEventListener(EVENTO_SESION_TERMINADA, cerrarSesion);
    };
  }, [vaciarInscripciones]);

  function guardar(nuevaSesion: Sesion) {
    localStorage.setItem(CLAVE_SESION, JSON.stringify(nuevaSesion));
    setSesion(nuevaSesion);
  }

  async function entrar(correo: string, password: string) {
    const nuevaSesion = await entrarApi(correo, password);
    guardar(nuevaSesion);
    // Cargar las inscripciones del usuario recién autenticado
    await cargarInscripciones();
  }

  async function registrar(nombre: string, correo: string, password: string) {
    const nuevaSesion = await registrarApi(nombre, correo, password);
    guardar(nuevaSesion);
    // El usuario recién registrado no tendrá inscripciones, pero se carga igual
    await cargarInscripciones();
  }

  function salir() {
    localStorage.removeItem(CLAVE_SESION);
    setSesion(null);
    vaciarInscripciones();
  }

  return (
    <SesionContext.Provider value={{ sesion, entrar, registrar, salir }}>
      {children}
    </SesionContext.Provider>
  );
}

export function useSesion() {
  const contexto = useContext(SesionContext);

  if (!contexto) {
    throw new Error('useSesion debe usarse dentro de SesionProvider');
  }

  return contexto;
}
