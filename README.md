# Práctica 24 - El gimnasio instalable (PWA)

En esta práctica convertí la aplicación de React del gimnasio en una PWA usando `vite-plugin-pwa`. Se agregó el manifiesto, los íconos, la configuración del service worker con caché para usarla sin internet, el botón para instalar la app en la computadora o celular, y dos funciones del teléfono: compartir la clase y vibrar al inscribirse.

---

## Cómo ejecutarlo

1. **Iniciar el backend:**
   ```powershell
   cd backend
   npm run start:dev
   ```
   Corre en `http://localhost:3000`.

2. **Compilar y probar la PWA con preview:**
   Para que el service worker funcione hay que compilar para producción:
   ```powershell
   npm run build
   npm run preview
   ```
   Abrir en el navegador: `http://localhost:4173/clases`.

---

## Preguntas de la práctica

### ¿Cuáles son los tres requisitos de una PWA y qué hace cada uno?
- **El manifiesto**: Le dice al navegador el nombre de la app, sus colores y qué íconos mostrar al instalarla.
- **El service worker**: Corre en segundo plano y se encarga de guardar archivos en caché para que la app pueda abrir aunque no haya internet.
- **Contexto seguro (HTTPS o localhost)**: Es necesario para que el navegador confíe en la app y nos permita registrar el service worker y usar las APIs del dispositivo.

### ¿Qué archivos generó vite-plugin-pwa en dist/ y para qué sirve cada uno?
- **`manifest.webmanifest`**: Guarda los datos de configuración para instalar la app (nombre, íconos, tema y display).
- **`sw.js`**: Es el service worker que controla las estrategias de caché (NetworkFirst y CacheFirst).
- **`registerSW.js`**: Es el script que registra el service worker en el navegador al abrir la página.

### ¿Por qué las clases usan NetworkFirst y las imágenes CacheFirst?
- **Clases (`NetworkFirst`)**: Porque los horarios y los cupos disponibles cambian seguido, así que primero intenta pedir los datos más recientes a la API y si no hay internet muestra lo guardado en caché.
- **Imágenes (`CacheFirst`)**: Porque las imágenes de las clases casi nunca cambian, entonces conviene cargarlas directo desde la caché para que abran al instante y no gasten datos.

### ¿Por qué en npm run dev no hay service worker?
Porque en modo desarrollo se desactiva a propósito para que la caché no estorbe mientras programamos con recarga en vivo (HMR). El service worker solo se genera cuando compilamos para producción con `npm run build`.

### ¿Qué diferencia hay entre una PWA y una aplicación híbrida?
Una PWA es una página web con esteroides que se puede instalar directo desde el navegador y usa APIs web estándar sin pasar por tiendas. Una aplicación híbrida (como con Capacitor o Cordova) se empaqueta dentro de un contenedor nativo (como un APK) para distribuirse en tiendas y accede al sistema por medio de plugins.
