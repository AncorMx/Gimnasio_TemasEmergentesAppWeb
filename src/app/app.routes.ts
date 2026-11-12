import { Routes } from '@angular/router';
import { FormularioClase } from './paginas/formulario-clase/formulario-clase';
import { Horarios } from './paginas/horarios/horarios';
import { ListaClases } from './paginas/lista-clases/lista-clases';
import { Miembros } from './paginas/miembros/miembros';

export const routes: Routes = [
  { path: 'clases/nueva', component: FormularioClase },
  { path: 'clases', component: ListaClases },
  { path: 'horarios', component: Horarios },
  { path: 'miembros', component: Miembros },
  { path: '', redirectTo: 'clases', pathMatch: 'full' },
  { path: '**', redirectTo: 'clases' },
];

