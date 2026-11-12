import { httpResource } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { API_URL } from './config';
import type { Categoria, Clase, Sobre } from './modelos/clase';
import { mensajeDeApi } from './servicios/errores';

export type FiltroCategoria = Categoria | 'todas';

@Injectable({
  providedIn: 'root',
})
export class Catalogo {
  private readonly recurso = httpResource<Sobre<Clase[]>>(
    () => `${API_URL}/clases`,
  );

  readonly categoriaElegida = signal<FiltroCategoria>('todas');
  readonly claseSeleccionada = signal<Clase | null>(null);
  readonly cargando = this.recurso.isLoading;

  readonly clases = computed<Clase[]>(() => {
    if (!this.recurso.hasValue()) return [];

    return this.recurso.value().data.map((clase) => ({
      ...clase,
      imagen: clase.imagen.startsWith('http')
        ? clase.imagen
        : `${API_URL}${clase.imagen}`,
    }));
  });

  readonly mensajeError = computed(() => {
    const error = this.recurso.error();
    return error ? mensajeDeApi(error) : '';
  });

  readonly clasesVisibles = computed(() => {
    const filtro = this.categoriaElegida();
    const lista = this.clases();

    if (filtro === 'todas') return lista;
    return lista.filter((clase) => clase.categoria === filtro);
  });

  readonly minutosTotales = computed(() => {
    return this.clasesVisibles().reduce((acc, c) => acc + c.duracionMin, 0);
  });

  readonly clasesLargas = computed(() => {
    return this.clasesVisibles().filter((c) => c.duracionMin >= 60).length;
  });

  cambiarCategoria(categoria: FiltroCategoria): void {
    this.categoriaElegida.set(categoria);

    const actual = this.claseSeleccionada();
    if (actual && !this.clasesVisibles().some((c) => c.id === actual.id)) {
      this.claseSeleccionada.set(null);
    }
  }

  seleccionarClase(clase: Clase): void {
    this.claseSeleccionada.set(clase);
  }

  reintentar(): void {
    this.recurso.reload();
  }
}
