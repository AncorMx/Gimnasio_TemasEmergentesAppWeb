import { Component, input, output } from '@angular/core';
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

  alSeleccionar(): void {
    this.elegida.emit(this.clase());
  }
}
