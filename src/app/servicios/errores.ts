import { HttpErrorResponse } from '@angular/common/http';

export function mensajeDeApi(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) {
    return 'Algo falló y no fue la red. Revisa la consola.';
  }

  if (error.status === 0) {
    return 'No se pudo contactar la API. ¿Está corriendo en el puerto 3000?';
  }

  const delServidor = mensajesDelCuerpo(error.error).join('. ') || null;

  switch (error.status) {
    case 400:
      return delServidor ?? 'Los datos que mandaste no son válidos.';
    case 401:
      if (delServidor && delServidor !== 'Unauthorized') return delServidor;
      return 'Tu sesión no es válida o venció. Vuelve a entrar.';
    case 403:
      return 'Tu cuenta no tiene permiso para hacer esto.';
    case 404:
      return 'Eso ya no existe.';
    default:
      return error.status >= 500
        ? 'La API tuvo un problema. Inténtalo de nuevo.'
        : (delServidor ?? `Error ${error.status}.`);
  }
}

export function mensajesDelCuerpo(cuerpo: unknown): string[] {
  if (!cuerpo || typeof cuerpo !== 'object') return [];
  const mensaje = (cuerpo as { message?: unknown }).message;
  if (typeof mensaje === 'string') return [mensaje];
  if (Array.isArray(mensaje)) return mensaje.map(String);
  return [];
}

