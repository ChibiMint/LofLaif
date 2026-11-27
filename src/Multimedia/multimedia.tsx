import './multimedia.css'
import { useMultimedia } from './contextoMulti'

const GRUPOS = [
  "μ's",
  'Aquors',
  'Nijigasaki',
  'Liella!',
  'Hasu no sora',
  'IKIZULIVE!',
  'Musical'
] as const

const CATEGORIAS = [
  'Anime',
  'Musica',
  'Conciertos',
  'Libros',
  'Revistas',
  'Extras'
] as const

export default function Multimedia() {
  const {
    seleccionarGrupo,
    setseleccionarGrupo,
    seleccionarCategoria,
    setseleccionarCategoria,
    reinciarFiltro,
    agrupado,
    setagrupado,
  } = useMultimedia()

  return (
    <div className="canciones">
      <div className="grupos">
        {GRUPOS.map((grupo) => (
          <div
            key={grupo}
            className={`grupo ${
              seleccionarGrupo === grupo ? 'active' : ''
            }`}
            onClick={() =>
              setseleccionarGrupo(
                seleccionarGrupo === grupo ? null : grupo,
              )
            }
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setseleccionarGrupo(
                  seleccionarGrupo === grupo ? null : grupo,
                )
              }
            }}
          >
            <p>{grupo}</p>
          </div>
        ))}
      </div>

      <div className="categorias">
        {CATEGORIAS.map((categoria) => (
          <div
            key={categoria}
            className={`categoria ${
              seleccionarCategoria === categoria ? 'active' : ''
            }`}
            onClick={() =>
              setseleccionarCategoria(
                seleccionarCategoria === categoria ? null : categoria,
              )
            }
            role="button"
            tabIndex={0}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                setseleccionarCategoria(
                  seleccionarCategoria === categoria ? null : categoria,
                )
              }
            }}
          >
            <p>{categoria}</p>
          </div>
        ))}

        <div
          className="filtro"
          onClick={reinciarFiltro}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              reinciarFiltro()
            }
          }}
        >
          <p>Filtros</p>
        </div>

        <div
          className={`agrupar ${agrupado ? 'active' : ''}`}
          onClick={() => setagrupado(!agrupado)}
          role="button"
          tabIndex={0}
          aria-pressed={agrupado}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              setagrupado(!agrupado)
            }
          }}
        >
          <p>{agrupado ? 'Ver capítulos' : 'Agrupar'}</p>
        </div>
      </div>
    </div>
  )
}
