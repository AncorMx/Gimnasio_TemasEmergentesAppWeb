# Práctica 20 - Signals, servicios y comunicación entre componentes

En esta práctica migré el estado que estaba en el componente principal hacia un servicio (`Catalogo`) usando signals de Angular. También agregué el filtro por categorías, la selección de tarjeta con panel de detalle y la comunicación entre componentes con `input()` y `output()`.

---

## Lo que se implementó

### 1. Servicio del catálogo (`src/app/catalogo.ts`)
Centraliza el estado del catálogo en signals:
- `clases`: signal con la lista de clases disponibles.
- `categoriaElegida`: signal con el filtro actual (`'todas'`, `'fuerza'`, `'cardio'`, `'flexibilidad'`).
- `claseSeleccionada`: signal con la clase seleccionada (o `null` si ninguna está activa).
- `clasesVisibles`: `computed` que filtra las clases según la categoría elegida.
- `minutosTotales`: `computed` que suma los minutos de las clases visibles.
- `clasesLargas`: `computed` con la cantidad de clases de 60 minutos o más.

Al cambiar el filtro, si la clase seleccionada ya no pertenece a la categoría activa, se deselecciona automáticamente para cerrar el detalle.

### 2. Filtro por categoría (`filtro-categoria`)
Componente que inyecta el servicio con `inject(Catalogo)` y muestra los botones de categorías. Al hacer clic en un botón, cambia la categoría en el servicio y todo el tablero se actualiza de inmediato.

### 3. Tarjeta y panel lateral
- `TarjetaClase` ahora recibe un `input()` booleano `activa` para resaltar el borde cuando está seleccionada.
- Emite un `output()` `elegida` con la clase al hacer clic.
- El tablero (`app.html`) muestra a la derecha un panel lateral (`aside.lateral`) con la foto, categoría, nombre, descripción y duración de la clase elegida.

---

## Preguntas de la práctica

### ¿Qué diferencia hay entre un signal y un computed, y cuál se parece a useState y cuál a useMemo?
- **`signal`** guarda un valor de estado que podemos leer y modificar con `.set()` o `.update()`. Equivale al **`useState`** de React.
- **`computed`** es un valor derivado de solo lectura que se calcula a partir de otros signals. Angular rastrea sus dependencias y solo vuelve a calcularlo cuando alguno de esos signals cambia. Equivale al **`useMemo`** de React.

### ¿Qué pasa si el filtro hace `new Catalogo()` en lugar de `inject(Catalogo)`?
Si se usa `new Catalogo()`, se crearía una instancia separada e independiente del servicio, por lo que el filtro modificaría su propia copia del estado y el tablero nunca se enteraría de los cambios (no se filtrarían las tarjetas ni se actualizaría el resumen).

Con `inject(Catalogo)`, Angular entrega la misma instancia del servicio compartida a nivel de aplicación (`providedIn: 'root'`), logrando que todos los componentes lean y modifiquen la misma fuente de datos.

---

## Evidencias
1. **Filtro en Cardio con su resumen**: Muestra las clases filtradas por la categoría Cardio y las estadísticas actualizadas.
2. **Clase elegida con su detalle**: Muestra la tarjeta con borde activo y el panel lateral con la información de la clase.
3. **Aviso provocado (NG8109)**: Captura de consola al intentar llamar a `inject()` fuera del contexto de inyección.
