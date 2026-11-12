import { Component, computed, input, output } from '@angular/core';
import { API_URL } from '../config';
import type { Clase } from '../modelos/clase';

@Component({
  selector: 'app-tarjeta-clase',
  standalone: true,
  templateUrl: './tarjeta-clase.html',
})
export class TarjetaClase {
  readonly clase = input.required<Clase>();
  readonly activa = input<boolean>(false);
  readonly elegida = output<Clase>();

  readonly imagenUrl = computed(() => {
    const img = this.clase().imagen;
    return img.startsWith('http') ? img : `${API_URL}${img}`;
  });

  alSeleccionar(): void {
    this.elegida.emit(this.clase());
  }
}
