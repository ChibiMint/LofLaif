import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {obtenerCapsPorNumero, obtenerCapsPorObjeto, type CapituloRow } from './detallesElem'
import { obtObjId } from '../../catalogo'
import './reproductor.css'

type Server = 'Reso' | 'Urses'

function cleanUrl(value?: string): string {
  if (!value) return ''

  const markdownMatch = value.match(/\]\((https?:\/\/[^)]+)\)/)

  if (markdownMatch) {
    return markdownMatch[1]
  }

  return value
}

function getDriveId(url?: string): string {
  if (!url) return ''

  const cleaned = cleanUrl(url)

  const fileMatch = cleaned.match(/\/file\/d\/([^/]+)/)

  if (fileMatch) {
    return fileMatch[1]
  }

  const idMatch = cleaned.match(/[?&]id=([^&]+)/)

  if (idMatch) {
    return idMatch[1]
  }

  return ''
}

function getDriveEmbedUrl(url?: string): string {
  const id = getDriveId(url)

  if (!id) return ''

  return `https://drive.google.com/file/d/${id}/preview`
}

function ChapterThumbnail({
  chapter,
}: {
  chapter: CapituloRow
}) {
  const imagen = cleanUrl(chapter.Imagen)

  if (imagen) {
    return (
      <img
        src={imagen}
        alt=""
        className="reproductor__cap-imagen"
      />
    )
  }

  return (
    <div className="reproductor__cap-imagen reproductor__cap-imagen--vacio">
      <span>{chapter.Capitulo}</span>
    </div>
  )
}

export default function EpisodeDetail() {
  const {
    objetoId = '',
    capitulo = '',
  } = useParams<{
    objetoId: string
    capitulo: string
  }>()

  const objeto = obtObjId(decodeURIComponent(objetoId))

  const capitulos = objeto
    ? obtenerCapsPorObjeto(objeto)
    : null

  const currentChapter =
    objeto && capitulos && capitulo
      ? obtenerCapsPorNumero(
          objeto,
          decodeURIComponent(capitulo),
        )
      : undefined

  const [server, setServer] = useState<Server>('Reso')

  const videoUrl = useMemo(() => {
    if (!currentChapter) return ''

    const selectedUrl =
      server === 'Reso'
        ? currentChapter.LinkA
        : currentChapter.LinkB

    return getDriveEmbedUrl(selectedUrl)
  }, [currentChapter, server])

  /*
   * CONTENIDO NO ENCONTRADO
   */
  if (!objeto) {
    return (
      <div className="reproductor reproductor--error">
        <p>Y lo que va aqui?.</p>
      </div>
    )
  }

  /*
   * SIN CAPÍTULOS
   */
  if (!capitulos || capitulos.length === 0) {
    return (
      <div className="reproductor reproductor--error">
        <p>Este contenido no tiene capítulos.</p>
      </div>
    )
  }

  /*
   * CAPÍTULO NO ENCONTRADO
   */
  if (!currentChapter) {
    return (
      <div className="reproductor reproductor--error">
        <p>
          No se encontró el capítulo {capitulo}.
        </p>
      </div>
    )
  }

  return (
    <div className="reproductor">
      <div className="reproductor__contenedor">

        {/* =====================================================
            TÍTULO
        ====================================================== */}
        <header className="reproductor__encavezado">
          <h1 className="reproductor__pag-titulo">
            {currentChapter.Nombre}
          </h1>

          {currentChapter.Jap && (
            <p className="reproductor__pag-jap">
              {currentChapter.Jap}
            </p>
          )}

          {currentChapter.Romangi && (
            <p className="reproductor__pag-romaji">
              {currentChapter.Romangi}
            </p>
          )}
        </header>

        {/* =====================================================
            REPRODUCTOR — MODO TEATRO
        ====================================================== */}
        <section className="reproductor__cinema">
          <div className="reproductor__player-wrapper">
            {videoUrl ? (
              <iframe
                key={videoUrl}
                src={videoUrl}
                title={`${currentChapter.Nombre} - ${server}`}
                className="reproductor__player"
                allow="autoplay; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="reproductor__player-vacio">
                <p>
                  Este capítulo no tiene un vídeo disponible
                  para el servidor {server}.
                </p>
              </div>
            )}
          </div>
        </section>

        {/* =====================================================
            INFORMACIÓN + EPISODIOS
        ====================================================== */}
        <div className="reproductor__abajo">

          {/* ===================================================
              INFORMACIÓN DEL EPISODIO
          ==================================================== */}
          <section className="reproductor__info">

            {/* SERVIDORES */}
            <div className="reproductor__server-boton">
              <button
                type="button"
                className={`reproductor__server ${
                  server === 'Reso'
                    ? 'reproductor__server--active'
                    : ''
                }`}
                onClick={() => setServer('Reso')}
                disabled={!currentChapter.LinkA}
              >
                Reso
              </button>

              <button
                type="button"
                className={`reproductor__server ${
                  server === 'Urses'
                    ? 'reproductor__server--active'
                    : ''
                }`}
                onClick={() => setServer('Urses')}
                disabled={!currentChapter.LinkB}
              >
                Urses
              </button>
            </div>

            {/* NÚMERO */}
            <div className="reproductor__numero">
              {currentChapter.Capitulo === 'OVA'
                ? 'OVA'
                : `Episodio ${currentChapter.Capitulo}`}
            </div>

            {/* TÍTULO */}
            <h2 className="reproductor__titulo">
              {currentChapter.Nombre}
            </h2>

            {/* JAPONÉS */}
            {currentChapter.Jap && (
              <p className="reproductor__jap">
                {currentChapter.Jap}
              </p>
            )}

            {/* ROMAJI */}
            {currentChapter.Romangi && (
              <p className="reproductor__romaji">
                {currentChapter.Romangi}
              </p>
            )}

            {/* DATOS */}
            <div className="reproductor__meta">
              {currentChapter.Fecha && (
                <span>
                  📅 {currentChapter.Fecha}
                </span>
              )}

              {currentChapter.Canciones && (
                <span>
                  🎵 {currentChapter.Canciones}
                </span>
              )}
            </div>

            {/* INFORMACIÓN */}
            {currentChapter.Info && (
              <div className="reproductor__description">
                <h2>Información</h2>

                <p>
                  {currentChapter.Info}
                </p>
              </div>
            )}
          </section>

          {/* ===================================================
              EPISODIOS
          ==================================================== */}
          <section className="reproductor__capitulos">

            <div className="reproductor__capitulos-encavezado">
              <div>
                <h2>Episodios</h2>

                <p>
                  Más capítulos de {objeto.nombre}
                </p>
              </div>

              <span>
                {capitulos.length}
              </span>
            </div>

            <div className="reproductor__cap-cuadricula">
              {capitulos.map((chapter) => {
                const isActive =
                  String(chapter.Capitulo) ===
                  String(currentChapter.Capitulo)

                return (
                  <Link
                    key={`${chapter.Capitulo}-${chapter.Nombre}`}
                    to={`/multimedia/objeto/${encodeURIComponent(
                      objeto.id,
                    )}/cap/${encodeURIComponent(
                      chapter.Capitulo,
                    )}`}
                    className={`reproductor__cap ${
                      isActive
                        ? 'reproductor__cap--active'
                        : ''
                    }`}
                  >
                    <ChapterThumbnail
                      chapter={chapter}
                    />

                    <div className="reproductor__cap-info">
                      <span className="reproductor__cap-numero">
                        {chapter.Capitulo === 'OVA'
                          ? 'OVA'
                          : objeto.kind === 'libros'
                            ? `Parte ${chapter.Capitulo}`
                            : `Ep. ${chapter.Capitulo}`}
                      </span>

                      <span className="reproductor__cap-titulo">
                        {chapter.Nombre}
                      </span>
                    </div>
                  </Link>
                )
              })}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}