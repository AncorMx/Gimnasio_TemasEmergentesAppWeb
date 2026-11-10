import { Component, inject } from '@angular/core';
import { CATEGORIAS } from '../modelos/clase';
import { Catalogo, type FiltroCategoria } from '../catalogo';

@Component({
  selector: 'app-filtro-categoria',
  standalone: true,
  templateUrl: './filtro-categoria.html',
})
export class FiltroCategoriaComponent {
  readonly catalogo = inject(Catalogo);
  readonly categorias = CATEGORIAS;

  seleccionar(cat: FiltroCategoria): void {
    this.catalogo.cambiarCategoria(cat);
  }
}
