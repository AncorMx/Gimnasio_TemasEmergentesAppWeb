import { Component, inject } from '@angular/core';
import { Catalogo } from './catalogo';
import { FiltroCategoriaComponent } from './filtro-categoria/filtro-categoria';
import { TarjetaClase } from './tarjeta-clase/tarjeta-clase';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TarjetaClase, FiltroCategoriaComponent],
  templateUrl: './app.html',
})
export class App {
  readonly catalogo = inject(Catalogo);

  provocarNG8109(): void {
    inject(Catalogo);
  }
}
