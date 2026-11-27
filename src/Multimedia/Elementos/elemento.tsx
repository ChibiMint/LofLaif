import { Link, useParams } from 'react-router-dom'
import { obtenerCapsPorObjeto, type CapituloRow } from './Reproductor/detallesElem'
import { obtObjId } from '../catalogo'
import './elemento.css'

function cleanUrl(valor?: string): string {
  if (!valor) {
    return ''
  }

  const markdownMatch = valor.match(
    /\]\((https?:\/\/[^)]+)\)/
  )

  if (markdownMatch) {
    return markdownMatch[1]
  }

  return valor
}


function ChapterCard({
  capitulo,
  objetoId,
}: {
  capitulo: CapituloRow
  objetoId: string
}) {
  const imagen = cleanUrl(capitulo.Imagen)

  return (
    <Link
      to={
        `/multimedia/objeto/${encodeURIComponent(objetoId)}` +
        `/cap/${encodeURIComponent(capitulo.Capitulo)}`
      }
      className="detalle-objeto__capitulo"
    >

      <div className="detalle-objeto__capitulo-imagen-wrapper">

        {imagen ? (
          <img
            src={imagen}
            alt=""
            className="detalle-objeto__capitulo-imagen"
          />
        ) : (
          <div className="detalle-objeto__capitulo-imagen detalle-objeto__capitulo-imagen--empty">
            <span>
              {capitulo.Capitulo}
            </span>
          </div>
        )}

      </div>


      <div className="detalle-objeto__capitulo-contenido">

        <span className="detalle-objeto__capitulo-number">
          {capitulo.Capitulo === 'OVA'
            ? 'OVA'
            : `Ep. ${capitulo.Capitulo}`}
        </span>

        <span className="detalle-objeto__capitulo-titulo">
          {capitulo.Nombre}
        </span>

      </div>

    </Link>
  )
}


function ItemInformation({
  objeto,
}: {
  objeto: NonNullable<ReturnType<typeof obtObjId>>
}) {
  return (
    <section className="detalle-objeto__info">

      <div className="detalle-objeto__portada-wrapper">

        {objeto.imagen ? (
          <img
            src={objeto.imagen}
            alt={objeto.nombre}
            className="detalle-objeto__portada"
          />
        ) : (
          <div className="detalle-objeto__portada detalle-objeto__portada--empty">
            Sin imagen
          </div>
        )}

      </div>


      <div className="detalle-objeto__basico">

        <h1 className="detalle-objeto__titulo">
          {objeto.nombre}
        </h1>


        <div className="detalle-objeto__categorias">

          <span className="detalle-objeto__categoria">
            {objeto.kind}
          </span>

          <span className="detalle-objeto__categoria">
            {objeto.grupo}
          </span>

        </div>


        <div className="detalle-objeto__wiki-seccion">

          <h2>
            Información
          </h2>

          <div className="detalle-objeto__info-tabla">

            <div className="detalle-objeto__info-fila">
              <span className="detalle-objeto__info-label">
                Nombre
              </span>

              <span className="detalle-objeto__info-valor">
                {objeto.nombre}
              </span>
            </div>


            <div className="detalle-objeto__info-fila">
              <span className="detalle-objeto__info-label">
                Grupo
              </span>

              <span className="detalle-objeto__info-valor">
                {objeto.grupo}
              </span>
            </div>


            <div className="detalle-objeto__info-fila">
              <span className="detalle-objeto__info-label">
                Tipo
              </span>

              <span className="detalle-objeto__info-valor">
                {objeto.kind}
              </span>
            </div>

          </div>

        </div>


        <div className="detalle-objeto__wiki-seccion">

          <h2>
            Descripción
          </h2>

          <p className="detalle-objeto__descripcion">
            Información sobre {objeto.nombre}.
          </p>

        </div>

      </div>

    </section>
  )
}


export default function ItemDetail() {

  const {
    objetoId = '',
  } = useParams<{
    objetoId: string
  }>()


  const objeto = obtObjId(
    decodeURIComponent(objetoId)
  )


  if (!objeto) {
    return (
      <div className="detalle-objeto detalle-objeto--error">

        <h1>
          No se encontró este contenido
        </h1>

      </div>
    )
  }


  const capitulos = obtenerCapsPorObjeto(objeto)


  return (
    <div className="detalle-objeto">

      <div className="detalle-objeto__contenedor">



        {/* TÍTULO PRINCIPAL */}

        <header className="detalle-objeto__encavezado">

          <h1>
            {objeto.nombre}
          </h1>

        </header>


        {/* CONTENIDO PRINCIPAL */}

        <div className="detalle-objeto__layout">


          {/* INFORMACIÓN */}

          <main className="detalle-objeto__principal">

            <ItemInformation
              objeto={objeto}
            />

          </main>


          {/* CAPÍTULOS */}

          <aside className="detalle-objeto__barra-lateral">

            <div className="detalle-objeto__barra-lateral-encavezado">

              <div>

                <h2>
                  Episodios
                </h2>

                <p>
                  Lista de capítulos disponibles
                </p>

              </div>

              {capitulos && (
                <span className="detalle-objeto__cap-num">
                  {capitulos.length}
                </span>
              )}

            </div>


            {!capitulos || capitulos.length === 0 ? (

              <div className="detalle-objeto__empty">

                <p>
                  Aún no hay capítulos disponibles
                  para este contenido.
                </p>

              </div>

            ) : (

              <div className="detalle-objeto__capitulo-lista">

                {capitulos.map((capitulo) => (

                  <ChapterCard
                    key={`${capitulo.Capitulo}-${capitulo.Nombre}`}
                    capitulo={capitulo}
                    objetoId={objeto.id}
                  />

                ))}

              </div>

            )}

          </aside>


        </div>

      </div>

    </div>
  )
}
