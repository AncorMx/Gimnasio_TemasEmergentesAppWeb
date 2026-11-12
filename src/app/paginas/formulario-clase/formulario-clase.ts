import { Component, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CATEGORIAS, type Categoria, type ClaseNueva } from '../../modelos/clase';

const bloquesDeCinco: ValidatorFn = (
  control: AbstractControl,
): ValidationErrors | null => {
  if (control.value === null || control.value === '') return null;

  const valor = Number(control.value);
  return Number.isFinite(valor) && valor % 5 === 0
    ? null
    : { bloquesDeCinco: true };
};

@Component({
  selector: 'app-formulario-clase',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  styleUrl: './formulario-clase.css',
  templateUrl: './formulario-clase.html',
})
export class FormularioClase {
  private readonly fb = inject(FormBuilder);

  readonly categorias = CATEGORIAS;
  readonly objetoListo = signal('');

  readonly formulario = this.fb.group({
    nombre: ['', [Validators.required, Validators.maxLength(80)]],
    categoria: this.fb.control<Categoria | null>(null, Validators.required),
    descripcion: ['', [Validators.required, Validators.maxLength(255)]],
    duracionMin: [
      45,
      [Validators.required, Validators.min(10), bloquesDeCinco],
    ],
    imagen: ['', [Validators.required, Validators.maxLength(120)]],
  });

  guardar(): void {
    this.objetoListo.set('');

    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    const valor = this.formulario.getRawValue();
    const clase: ClaseNueva = {
      nombre: valor.nombre ?? '',
      categoria: valor.categoria as Categoria,
      descripcion: valor.descripcion ?? '',
      duracionMin: Number(valor.duracionMin),
      imagen: valor.imagen ?? '',
    };

    this.objetoListo.set(JSON.stringify(clase, null, 2));
  }
}

