# Práctica 21 - Rutas, formulario y API

En esta práctica separé el panel en páginas usando Angular Router, creé el formulario reactivo para dar de alta una nueva clase con un validador propio para la duración, y conecté el catálogo al backend usando `httpResource` para dejar de usar los datos locales.

---

## Preguntas de la práctica

### ¿Qué pieza de React Router corresponde a router-outlet, a routerLink y a routerLinkActive?
- **`router-outlet`** corresponde a **`<Outlet />`**: es el espacio donde se pinta el componente de la ruta actual.
- **`routerLink`** corresponde a **`<Link>`**: sirve para navegar entre rutas sin recargar la página.
- **`routerLinkActive`** corresponde a **`<NavLink>`**: le pone la clase CSS activa al enlace cuando estamos en esa ruta.

### ¿Por qué la ruta comodín (**) va al final y la ruta vacía necesita pathMatch: 'full'?
- La ruta `**` atrapa cualquier URL. Como Angular revisa las rutas de arriba hacia abajo en orden, si la ponemos al principio atraparía todo y nunca dejaría entrar a las demás páginas.
- La ruta vacía necesita `pathMatch: 'full'` para que la redirección solo ocurra cuando la URL sea exactamente `/`. Si no se pone, Angular usa coincidencia por prefijo (`prefix`) y redirigiría siempre porque cualquier ruta empieza con una cadena vacía.

### ¿Dónde vive el valor de un campo en un formulario reactivo y en qué se diferencia del useState de React?
El valor vive dentro de su propio `FormControl` adentro del `FormGroup`. La diferencia con React es que allá usamos `useState` y tenemos que actualizar el estado a mano con eventos `onChange`. En Angular el formulario reactivo ya se encarga solo de guardar el valor, registrar si el campo fue tocado (`touched`) y revisar si es válido o no.

### ¿Qué regresa un validador propio cuando el valor es válido y cuando no, y cómo se relaciona con hasError?
- Si el valor es **válido** regresa `null`.
- Si **no es válido** regresa un objeto con el error, por ejemplo `{ bloquesDeCinco: true }`.
Ese objeto se guarda dentro de los errores del control, y con `hasError('bloquesDeCinco')` podemos comprobar desde el HTML si ese error específico ocurrió para pintar el mensaje.

### ¿Qué cambió en el servicio del catálogo y por qué ningún componente se enteró?
Por dentro cambió que ya no usa el arreglo de datos locales, sino que ahora hace la petición a la API con `httpResource`. Los componentes no tuvieron que cambiar nada porque el servicio sigue ofreciendo los mismos signals (`clasesVisibles`, `minutosTotales`, `cargando`, etc.), así que la forma de consumirlo quedó exactamente igual.

### ¿Por qué no hizo falta iniciar sesión para leer el catálogo?
Porque en el backend el endpoint `GET /clases` es una ruta pública, cualquiera puede consultar las clases del gimnasio sin necesidad de mandar un token ni iniciar sesión.
