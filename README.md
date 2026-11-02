# Práctica 18 – Lazy loading, el build y Zustand

## Ejecutar

**Backend:**
```bash
cd backend
npx prisma generate
npx prisma db seed
npm run start:dev
```

**Frontend:**
```bash
npm install
npm run dev
```

---

## Ejercicio 1 – Partir por ruta y medir

Se convirtieron todos los imports de páginas en imports dinámicos con `React.lazy()` en `App.tsx`, y se envolvió el `<Outlet />` del Layout en `<Suspense fallback={<Cargando />}>`.

Además se agregó `loading="lazy"` a las imágenes del catálogo (`PaginaClases.tsx`) para diferir su descarga hasta que entren al viewport.

### ¿Cuánto se ahorró y por qué el ahorro es pequeño en esta aplicación?

El chunk principal (`index-[hash].js`) se redujo considerablemente: el código de cada página ahora vive en su propio chunk que solo se descarga al visitar esa ruta. Sin embargo, el ahorro percibido es pequeño porque el proyecto es todavía chico: el código de aplicación (JSX, lógica) pesa mucho menos que las dependencias (React, React Router, Axios, Zustand). Esas dependencias van al chunk `vendor` y se comparten entre todas las páginas de todas formas. En una aplicación más grande, con docenas de páginas y módulos pesados cargados solo en algunas rutas, el ahorro sería mucho más notable.

### ¿Por qué falla la API si el preview corre en el puerto 4173?

El backend tiene configurado CORS solo para el origen `http://localhost:5173` (el puerto que usa el servidor de desarrollo de Vite). Cuando `vite preview` sirve el build en el puerto **4173** (su puerto predeterminado), el navegador envía la petición con `Origin: http://localhost:4173`. El backend la rechaza con un error CORS porque ese origen no está en su lista blanca, y el navegador bloquea la respuesta antes de que JavaScript la pueda leer.

---

## Ejercicio 2 – Un store para las inscripciones

Se creó `src/store/inscripciones.ts` con Zustand. El store contiene:
- `inscripciones`: la lista de inscripciones del usuario.
- `cargando` y `error`: estados de la petición.
- `cargar()`: pide las inscripciones a la API y las guarda.
- `vaciar()`: limpia el store al cerrar sesión.

El `SesionContext` llama a `cargar()` después de un login exitoso y a `vaciar()` al salir. El `Encabezado` muestra el contador `(N)` junto al enlace *Mis inscripciones*. `PaginaMisInscripciones` lee del store directamente sin hacer su propio fetch. `PaginaClase` marca como `✓ Inscrito` los horarios cuyo id ya está en el store.

### ¿Cuándo conviene un contexto y cuándo un store?

- **Contexto de React** conviene cuando el dato tiene ciclo de vida ligado al árbol de componentes y no necesita actualizarse desde muchos lugares distintos. Ejemplo: la sesión del usuario, el tema de color, el idioma. El proveedor envuelve la app y los consumidores solo leen o modifican a través de funciones expuestas por el contexto.

- **Store de Zustand** conviene cuando varios componentes que no tienen relación de padre–hijo necesitan leer o modificar el mismo dato sin pasar por props ni contexto. También es mejor cuando el dato cambia con frecuencia y no se quiere re-renderizar todo el árbol. Ejemplo: las inscripciones, que las lee el encabezado, la lista de mis inscripciones y el detalle de la clase al mismo tiempo.

---

## Evidencias

Las capturas están en la carpeta `evidencias/`:

- `11-build-antes.png` – build sin lazy: un solo chunk grande de JS
- `12-build-despues.png` – build con lazy: chunks separados por página
- `13-red-clases.png` – pestaña Red mostrando el chunk de PaginaClases al visitarla
- `14-red-mis-inscripciones.png` – chunk de PaginaMisInscripciones descargándose al visitarla
- `15-cors-4173.png` – error de CORS en consola al usar `vite preview` en el puerto 4173
- `16-contador-antes.png` – encabezado con 0 inscripciones
- `17-contador-despues.png` – encabezado con N inscripciones tras inscribirse
