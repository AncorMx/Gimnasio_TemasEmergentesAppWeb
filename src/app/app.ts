import { Component } from '@angular/core';
import { CLASES_LOCALES } from './datos/clases-locales';
import type { Clase } from './modelos/clase';
import { TarjetaClase } from './tarjeta-clase/tarjeta-clase';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TarjetaClase],
  templateUrl: './app.html',
})
export class App {
  clases: Clase[] = [...CLASES_LOCALES];

  get totalClases(): number {
    return this.clases.length;
  }

  get minutosSemana(): number {
    return this.clases.reduce((total, clase) => total + clase.duracionMin, 0);
  }

  get clasesLargas(): number {
    return this.clases.filter((clase) => clase.duracionMin >= 60).length;
  }

  vaciarCatalogo(): void {
    this.clases = [];
  }

  restaurarCatalogo(): void {
    this.clases = [...CLASES_LOCALES];
  }
}
