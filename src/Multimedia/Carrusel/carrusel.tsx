import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import useEmblaCarousel from 'embla-carousel-react'
import './carrusel.css'
import t1 from '../../Componentes/t1.svg'
import t2 from '../../Componentes/t2.svg'
import { ALL, type Objeto, type Kind } from '../catalogo.ts'
import { useMultimedia } from '../contextoMulti'
import { obtenerCapsPorObjeto } from '../Elementos/Reproductor/detallesElem.ts'

const tipoCategoria: Record<string, Kind[]> = {
  Anime: ['anime'],
  Musica: ['canciones', 'album'],
  Conciertos: ['conciertos'],
  Libros: ['libros'],
  Revistas: ['revistas'],
}

type objetoCarrusel = Objeto & {
  href: string
}

type deslisarObjeto = objetoCarrusel & {
  loopKey: string
}

function obtenerTiempo(fecha?: string): number {
  if (!fecha?.trim()) return Number.POSITIVE_INFINITY

  const tiempo = Date.parse(fecha)

  return Number.isNaN(tiempo)
    ? Number.POSITIVE_INFINITY
    : tiempo
}

function ordenarPorFecha(objetos: objetoCarrusel[]): objetoCarrusel[] {
  return objetos
    .map((objeto, indice) => ({ objeto, indice }))
    .sort((a, b) => {
      const diferencia =
        obtenerTiempo(a.objeto.fecha) - obtenerTiempo(b.objeto.fecha)

      if (Number.isNaN(diferencia) || diferencia === 0) {
        return a.indice - b.indice
      }

      return diferencia
    })
    .map(({ objeto }) => objeto)
}

function filtrar(
  objetos: objetoCarrusel[],
  grupo: string | null,
  categoria: string | null,
): objetoCarrusel[] {
  let resultado = objetos

  if (categoria) {
    const kinds = tipoCategoria[categoria]

    if (kinds) {
      resultado = resultado.filter((objeto) => kinds.includes(objeto.kind))
    }
  }

  if (grupo) {
    resultado = resultado.filter((objeto) => objeto.grupo === grupo)
  }

  return resultado
}

function construirVistaCapitulos(): objetoCarrusel[] {
  const resultado: objetoCarrusel[] = []

  ALL.forEach((objeto) => {
    if (
      objeto.kind === 'canciones' ||
      objeto.kind === 'album' ||
      objeto.kind === 'conciertos'||
      objeto.kind === 'libros' 
    ) {
      resultado.push({
        ...objeto,
        href: `/multimedia/objeto/${encodeURIComponent(objeto.id)}`,
      })

      return
    }

    const caps = obtenerCapsPorObjeto(objeto)

    if (!caps) return

    caps.forEach((capitulo) => {
      const numero = capitulo.Capitulo ?? capitulo.Edicion ?? capitulo.Nombre
      resultado.push({
        id: `cap-${objeto.id}-${numero}`,
        kind: objeto.kind,
        nombre: capitulo.Nombre || `Capítulo ${numero}`,
        grupo: objeto.grupo,
        imagen: capitulo.Imagen || objeto.imagen,
        fecha: capitulo.Fecha,
        href: `/multimedia/objeto/${encodeURIComponent(
          objeto.id,
        )}/cap/${encodeURIComponent(String(numero))}`,
      })
    })
  })

  return ordenarPorFecha(resultado)
}

function construirVistaOriginal(): objetoCarrusel[] {
  return ALL.map((objeto) => ({
    ...objeto,
    href: `/multimedia/objeto/${encodeURIComponent(objeto.id)}`,
  }))
}

function claseDeslisar(
  indice: number,
  seleccionarIndice: number,
  total: number,
): 'center' | 'adj' | 'edge' | 'edge2' {
  if (indice === seleccionarIndice) return 'center'

  const adelante = (indice - seleccionarIndice + total) % total
  const atras = (seleccionarIndice - indice + total) % total
  const distancia = Math.min(adelante, atras)

  if (distancia === 1) return 'adj'
  if (distancia === 2) return 'edge'

  return 'edge2'
}

const MIN_SLIDES_FOR_LOOP = 18

function expandirObjetosLoop(
  objetos: objetoCarrusel[],
): deslisarObjeto[] {
  if (objetos.length === 0) return []

  if (objetos.length >= MIN_SLIDES_FOR_LOOP) {
    return objetos.map((objeto) => ({
      ...objeto,
      loopKey: objeto.id,
    }))
  }

  const resultado: deslisarObjeto[] = []
  let round = 0

  while (resultado.length < MIN_SLIDES_FOR_LOOP) {
    for (const objeto of objetos) {
      resultado.push({
        ...objeto,
        loopKey: `${objeto.id}__r${round}`,
      })
    }

    round += 1
  }

  return resultado
}

export default function Carrusel() {
  const {
    seleccionarGrupo,
    seleccionarCategoria,
    agrupado,
  } = useMultimedia()

  const vistaCapitulos = useMemo(
    () => construirVistaCapitulos(),
    [],
  )

  const vistaOriginal = useMemo(
    () => construirVistaOriginal(),
    [],
  )

  const objetos = useMemo(() => {
    const fuente = agrupado ? vistaOriginal : vistaCapitulos

    return filtrar(fuente, seleccionarGrupo, seleccionarCategoria)
  }, [
    agrupado,
    vistaOriginal,
    vistaCapitulos,
    seleccionarGrupo,
    seleccionarCategoria,
  ])

  const loopDeslisar = useMemo(
    () => expandirObjetosLoop(objetos),
    [objetos],
  )

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: 'center',
    slidesToScroll: 1,
    watchSlides: true,
    watchDrag: (_api, event) =>
      !(event.target as HTMLElement | null)?.closest(
        'a.carrusel-carta--link',
      ),
  })

  const [seleccionarIndice, setSelectedIndex] = useState(0)

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()

    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi) return

    emblaApi.reInit()
    emblaApi.scrollTo(0, true)
  }, [
    emblaApi,
    loopDeslisar,
    agrupado,
    seleccionarGrupo,
    seleccionarCategoria,
  ])

  const total = objetos.length

  const current =
    loopDeslisar.length > 0
      ? loopDeslisar[seleccionarIndice] ?? loopDeslisar[0]
      : null

  return (
    <div className="carrusel">
      <div className="contenedor">
        <img
          src={t1}
          className="botonS"
          alt="Anterior"
          height={100}
          onClick={() => emblaApi?.scrollPrev()}
        />

        <div className="embla" ref={emblaRef}>
          <div className="emblaContenedor">
            {total === 0 ? (
              <div className="emplaDeslisar emplaDeslisar--solo">
                <div className="carrusel-carta">
                  <p>Aquí no hay naida.</p>
                </div>
              </div>
            ) : (
              loopDeslisar.map((objeto, indice) => {
                const ring = claseDeslisar(
                  indice,
                  seleccionarIndice,
                  loopDeslisar.length,
                )

                return (
                  <div
                    className={`emplaDeslisar emplaDeslisar--${ring}`}
                    key={objeto.loopKey}
                    aria-current={
                      ring === 'center' ? 'true' : undefined
                    }
                  >
                    <div className="emplaDeslisar-interno">
                      {ring === 'center' ? (
                        <Link
                          to={objeto.href}
                          className="carrusel-carta carrusel-carta--link"
                          draggable={false}
                          onDragStart={(event) =>
                            event.preventDefault()
                          }
                        >
                          {objeto.imagen ? (
                            <img
                              src={objeto.imagen}
                              alt={objeto.nombre}
                              className="carrusel-cartaImagen"
                            />
                          ) : null}
                        </Link>
                      ) : (
                        <div className="carrusel-carta">
                          {objeto.imagen ? (
                            <img
                              src={objeto.imagen}
                              alt={objeto.nombre}
                              className="carrusel-cartaImagen"
                            />
                          ) : null}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </div>

        <img
          src={t2}
          className="botonS"
          alt="Siguiente"
          height={100}
          onClick={() => emblaApi?.scrollNext()}
        />
      </div>
      <div className="informacion">
        <p>{current?.nombre ?? 'Love Live!'}</p>
      </div>
    </div>
  )
}