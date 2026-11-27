import Anime from './DatosM/anime.json'
import Canciones from './DatosM/canciones.json'
import Album from './DatosM/album.json'
import conciertos from './DatosM/conciertos.json'
import libros from './DatosM/libros.json'

export type Kind =
  | 'anime'
  | 'canciones'
  | 'album'
  | 'conciertos'
  | 'libros'

export type Objeto = {
  id: string
  kind: Kind
  nombre: string
  grupo: string
  imagen?: string
  fecha?: string
}

type SectionData = {
  Nombre: string
  Grupo: string
  Imagen?: string
  Fecha?: string
}

function mostrarTodo(): Objeto[] {
  const objetos: Objeto[] = []

  function añadirSeccion(
    sections: SectionData[],
    kind: Kind,
    prefix: string,
  ) {
    sections.forEach((section, index) => {
      objetos.push({
        id: `${prefix}-${index}`,
        kind,
        nombre: section.Nombre,
        grupo: section.Grupo,
        imagen: section.Imagen,
        fecha: section.Fecha,
      })
    })
  }

  añadirSeccion(Anime.sections, 'anime', 'anime')
  añadirSeccion(Canciones.sections, 'canciones', 'canciones')
  añadirSeccion(Album.sections, 'album', 'album')
  añadirSeccion(conciertos.sections, 'conciertos', 'conciertos')
  añadirSeccion(libros.sections, 'libros', 'libros')

  return objetos
}

export const ALL = mostrarTodo()

export function obtObjId(id: string): Objeto | undefined {
  return ALL.find((objeto) => objeto.id === id)
}