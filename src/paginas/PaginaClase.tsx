import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useClase } from '../hooks/useClase.ts';
import { Cargando } from '../componentes/Cargando.tsx';
import { MensajeError } from '../componentes/MensajeError.tsx';
import { useSesion } from '../sesion/SesionContext.tsx';
import { inscribirse } from '../servicios/gimnasio.ts';
import { mensajeDeError } from '../servicios/api.ts';
import { useInscripcionesStore } from '../store/inscripciones.ts';

export function PaginaClase() {
  const { id } = useParams<{ id: string }>();
  const idNumero = id ? Number(id) : NaN;
  const { clase, cargando, error, reintentar } = useClase(idNumero);
  const { sesion } = useSesion();

  // Obtenemos del store la lista de inscripciones y la función para recargarlas
  const inscripciones = useInscripcionesStore((s) => s.inscripciones);
  const cargarInscripciones = useInscripcionesStore((s) => s.cargar);

  const [inscribiendo, setInscribiendo] = useState<number | null>(null);
  const [errorInscripcion, setErrorInscripcion] = useState<string | null>(null);
  const [aviso, setAviso] = useState<string | null>(null);

  async function handleInscribirse(horarioId: number) {
    if (!sesion) return;
    setErrorInscripcion(null);
    setAviso(null);
    setInscribiendo(horarioId);

    try {
      await inscribirse(horarioId);
      // Recargar inscripciones en el store global tras inscribirse
      await cargarInscripciones();
      setAviso('Inscripción realizada correctamente.');
      navigator.vibrate?.(80);
      reintentar();
    } catch (e) {
      setErrorInscripcion(
        mensajeDeError(e, 'No se pudo realizar la inscripción. Intenta de nuevo.')
      );
    } finally {
      setInscribiendo(null);
    }
  }

  async function compartir() {
    if (!clase) return;
    const datos = {
      title: clase.nombre,
      text: `${clase.nombre} en Gimnasio Titanes · ${clase.duracionMin} min`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(datos);
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') return;
      }
    }

    try {
      await navigator.clipboard.writeText(datos.url);
      setAviso('Enlace copiado. Pégalo donde quieras compartirlo.');
    } catch {
      setErrorInscripcion('No se pudo copiar el enlace. Puedes copiarlo desde la barra de direcciones.');
    }
  }

  if (cargando) return <Cargando />;
  if (error) return <MensajeError mensaje={error} onReintentar={reintentar} />;
  if (!clase) return null;

  return (
    <div className="pagina">
      <Link to="/clases" className="enlace-volver">
        ← Todas las clases
      </Link>

      {aviso && <div className="aviso aviso--exito">{aviso}</div>}
      {errorInscripcion && (
        <div className="aviso aviso--error">{errorInscripcion}</div>
      )}

      <div className="detalle-clase">
        <div className="detalle-clase__ilustracion">
          <img src={clase.imagen} alt="" />
        </div>

        <div className="detalle-clase__info">
          <span className="etiqueta-categoria">{clase.categoria}</span>
          <h1>{clase.nombre}</h1>
          <p className="pagina__bajada">
            {clase.descripcion} · {clase.duracionMin} min
          </p>
          <p>
            <button
              type="button"
              className="boton boton--secundario boton--chico"
              onClick={() => void compartir()}
            >
              Compartir
            </button>
          </p>

          <h2>Horarios</h2>
          <ul className="horarios">
            {clase.horarios.map((h) => {
              const cupoLleno = h.disponibles === 0;
              // Verificar si ya está inscrito en este horario leyendo del store
              const yaInscrito = inscripciones.some((i) => i.horario.id === h.id);

              return (
                <li key={h.id} className="horarios__item">
                  <div className="horarios__datos">
                    <strong>
                      {h.dia} · {h.horaInicio}
                    </strong>
                    <span>
                      {h.entrenador} · {h.disponibles} de {h.cupoMaximo} lugares
                    </span>
                  </div>

                  <div className="horarios__accion">
                    {sesion ? (
                      yaInscrito ? (
                        <span className="etiqueta-inscrito">✓ Inscrito</span>
                      ) : cupoLleno ? (
                        <span className="etiqueta-lleno">Lleno</span>
                      ) : (
                        <button
                          className="boton boton--chico"
                          disabled={inscribiendo === h.id}
                          onClick={() => handleInscribirse(h.id)}
                        >
                          {inscribiendo === h.id ? 'Inscribiendo...' : 'Inscribirme'}
                        </button>
                      )
                    ) : cupoLleno ? (
                      <span className="etiqueta-lleno">Lleno</span>
                    ) : (
                      <Link
                        to="/entrar"
                        state={{ volverA: `/clases/${clase.id}` }}
                        className="boton boton--chico boton--secundario"
                      >
                        Inicia sesión para inscribirte
                      </Link>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
