# Práctica 19 - Panel del gimnasio en Angular

En esta práctica armé el panel de administración del gimnasio usando Angular con componentes standalone, señales y el nuevo flujo de control en las plantillas.

## Resumen del tablero
El tablero carga 8 clases locales y muestra:
- Total de clases (8)
- Minutos acumulados por semana (380 min)
- Clases que duran 60 min o más (2)

Cada tarjeta muestra su foto, título, descripción, categoría y tiempo de duración (con la etiqueta `Larga` si dura 60 min o más). También agregué los botones para vaciar el catálogo y volverlo a restaurar. Si se queda sin clases, aparece el mensaje avisando que no hay nada para mostrar.

---

## Preguntas de la práctica

### ¿Qué archivo de Angular hace el papel de main.tsx, de App.tsx y de vite.config.ts?
- **`main.tsx` equivale a `src/main.ts`:** Es el archivo de entrada donde arranca la aplicación (`bootstrapApplication`).
- **`App.tsx` equivale a `src/app/app.ts` y `app.html`:** En Angular la lógica del componente principal va en el `.ts` y la vista en el `.html`.
- **`vite.config.ts` equivale a `angular.json`:** Aquí se define la configuración general del proyecto, assets, estilos globales y opciones de compilación.

### ¿Por qué clase() lleva paréntesis?
Porque al definirlo con `input.required()`, Angular crea un **signal input**. Las señales en Angular funcionan como funciones, así que para leer su valor actual se tienen que mandar llamar con paréntesis: `clase().nombre`.

### ¿Para qué sirve track?
En `@for (clase of clases; track clase.id)`, el `track` le dice a Angular cómo identificar de forma única a cada elemento (usando su `id`). Así, cuando la lista cambia, Angular solo actualiza o mueve el elemento que cambió en vez de volver a renderizar todo el DOM.

---

## Errores probados (evidencias)
- **`NG5002`:** Error de sintaxis en el control de flujo. Ocurrió al escribir mal la estructura del `@for` en el template.
- **`NG8001`:** Error de componente no reconocido (`'app-tarjeta-clase' is not a known element`). Pasó al poner la etiqueta en el HTML sin haber importado `TarjetaClase` en el array `imports` de `app.ts`.

*(Las capturas de ambos errores y del tablero se encuentran en la carpeta `evidencias/`)*.
