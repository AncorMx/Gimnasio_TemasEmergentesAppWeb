import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Catalogo } from '../../catalogo';
import { FiltroCategoriaComponent } from '../../filtro-categoria/filtro-categoria';
import { TarjetaClase } from '../../tarjeta-clase/tarjeta-clase';

@Component({
  selector: 'app-lista-clases',
  standalone: true,
  imports: [RouterLink, FiltroCategoriaComponent, TarjetaClase],
  styleUrl: './lista-clases.css',
  templateUrl: './lista-clases.html',
})
export class ListaClases {
  readonly catalogo = inject(Catalogo);
}

