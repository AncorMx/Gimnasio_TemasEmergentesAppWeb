import { create } from 'zustand';
import type { Inscripcion } from '../tipos.ts';
import { traerMisInscripciones } from '../servicios/gimnasio.ts';
import { mensajeDeError } from '../servicios/api.ts';

interface EstadoInscripciones {
  inscripciones: Inscripcion[];
  cargando: boolean;
  error: string | null;
  // Acciones
  cargar: () => Promise<void>;
  vaciar: () => void;
}

export const useInscripcionesStore = create<EstadoInscripciones>((set) => ({
  inscripciones: [],
  cargando: false,
  error: null,

  /** Pide las inscripciones a la API y las guarda en el store. */
  cargar: async () => {
    set({ cargando: true, error: null });
    try {
      const lista = await traerMisInscripciones();
      set({ inscripciones: lista, cargando: false });
    } catch (e) {
      set({
        error: mensajeDeError(e, 'No se pudieron cargar tus inscripciones.'),
        cargando: false,
      });
    }
  },

  /** Limpia el store al cerrar sesión. */
  vaciar: () => set({ inscripciones: [], cargando: false, error: null }),
}));

