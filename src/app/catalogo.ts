import { Injectable, signal, computed } from '@angular/core';
import { CLASES_LOCALES } from './datos/clases-locales';
import type { Clase, Categoria } from './modelos/clase';

export type FiltroCategoria = Categoria | 'todas';

@Injectable({
  providedIn: 'root',
})
export class Catalogo {
  readonly clases = signal<Clase[]>([...CLASES_LOCALES]);
  readonly categoriaElegida = signal<FiltroCategoria>('todas');
  readonly claseSeleccionada = signal<Clase | null>(null);

  // Clases que cumplen con el filtro seleccionado
  readonly clasesVisibles = computed(() => {
    const filtro = this.categoriaElegida();
    const lista = this.clases();

    if (filtro === 'todas') {
      return lista;
    }
    return lista.filter((clase) => clase.categoria === filtro);
  });

  // Minutos acumulados según las clases visibles
  readonly minutosTotales = computed(() => {
    return this.clasesVisibles().reduce((acc, c) => acc + c.duracionMin, 0);
  });

  // Clases de 60 minutos o más visibles
  readonly clasesLargas = computed(() => {
    return this.clasesVisibles().filter((c) => c.duracionMin >= 60).length;
  });

  cambiarCategoria(categoria: FiltroCategoria): void {
    this.categoriaElegida.set(categoria);

    // Si la clase seleccionada ya no entra en el filtro, se deselecciona
    const actual = this.claseSeleccionada();
    if (actual && !this.clasesVisibles().some((c) => c.id === actual.id)) {
      this.claseSeleccionada.set(null);
    }
  }

  seleccionarClase(clase: Clase): void {
    const actual = this.claseSeleccionada();
    this.claseSeleccionada.set(actual?.id === clase.id ? null : clase);
  }

  vaciarCatalogo(): void {
    this.clases.set([]);
    this.claseSeleccionada.set(null);
  }

  restaurarCatalogo(): void {
    this.clases.set([...CLASES_LOCALES]);
    this.categoriaElegida.set('todas');
    this.claseSeleccionada.set(null);
  }
}

