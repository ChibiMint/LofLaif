import type { Objeto } from '../../catalogo'
import CapitulosSIP1 from '../../DatosM/Capitulos/Cap_SIP1.json'
import CapitulosSIP2 from '../../DatosM/Capitulos/Cap_SIP2.json'
import CapitulosSunshine1 from '../../DatosM/Capitulos/Cap_Sunshine1.json'
import CapitulosNijigasaki1 from '../../DatosM/Capitulos/Cap_Nijigasaki1.json'
import CapitulosSuperstar1 from '../../DatosM/Capitulos/Cap_Superstar1.json'
import CapitulosSunshineMirror from '../../DatosM/Capitulos/Cap_STM.json'
import CapitulosNijiyon from '../../DatosM/Capitulos/Cap_Nijigasaki1.json'
import CapitulosLibroSchoolIdolDiary from '../../DatosM/Capitulos/Cap_SID.json'
import CapitulosLibroManga from '../../DatosM/Capitulos/Cap_Manga.json'
import CapitulosLibroDays from '../../DatosM/Capitulos/LLD.json'


export type CapituloRow = {
  Capitulo: string
  Nombre: string
  Jap?: string
  Romangi?: string
  Imagen?: string
  Canciones?: string
  Fecha?: string
  Info?: string
  LinkA?: string
  LinkB?: string
}


const CHAPTERS_BY_TITLE: Record<string, CapituloRow[]> = {
  'Love live! the school idol project!': CapitulosSIP1.sections,
  'Love live! the school idol project 2!!': CapitulosSIP2.sections,
  'Love live! Sunshine!!': CapitulosSunshine1.sections,
  'Love live! Nijigasaki High School Idol Club': CapitulosNijigasaki1.sections,
  'Love live! Superstar!!': CapitulosSuperstar1.sections,
  'Sunshine in the mirror': CapitulosSunshineMirror.sections,
  'Love live! Nijiyon': CapitulosNijiyon.sections,
  'Love Live! School idol diary': CapitulosLibroSchoolIdolDiary.sections,
  'Love Live! Manga': CapitulosLibroManga.sections,
  'Love Live! Days': CapitulosLibroDays.sections
}


export function obtenerCapsPorObjeto(
  objeto: Objeto
): CapituloRow[] | null {
  if (objeto.kind !== 'anime' && objeto.kind !== 'libros') {
    return null
  }


  const rows = CHAPTERS_BY_TITLE[objeto.nombre]


  return rows !== undefined ? rows : null
}


export function obtenerCapsPorNumero(
  objeto: Objeto,
  chapterNumber: string
): CapituloRow | undefined {
  const chapters = obtenerCapsPorObjeto(objeto)


  if (!chapters) {
    return undefined
  }


  return chapters.find(
    (chapter) =>
      String(chapter.Capitulo) === String(chapterNumber)
  )
}