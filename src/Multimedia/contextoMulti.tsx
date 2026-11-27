import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

type Value = {
  seleccionarGrupo: string | null
  setseleccionarGrupo: (value: string | null) => void
  seleccionarCategoria: string | null
  setseleccionarCategoria: (value: string | null) => void
  reinciarFiltro: () => void
  agrupado: boolean
  setagrupado: (value: boolean) => void
}

const ContextoMulti = createContext<Value | null>(null)

export function Proveedor({
  children,
}: {
  children: ReactNode
}) {
  const [seleccionarGrupo, setseleccionarGrupo] = useState<string | null>(null)
  const [seleccionarCategoria, setseleccionarCategoria] = useState<string | null>(null)
  const [agrupado, setagrupado] = useState(false)

  const reinciarFiltro = useCallback(() => {
    setseleccionarGrupo(null)
    setseleccionarCategoria(null)
  }, [])

  const value = useMemo(
    () => ({
      seleccionarGrupo,
      setseleccionarGrupo,
      seleccionarCategoria,
      setseleccionarCategoria,
      reinciarFiltro,
      agrupado,
      setagrupado,
    }),
    [seleccionarGrupo, seleccionarCategoria, reinciarFiltro, agrupado],
  )

  return (
    <ContextoMulti.Provider value={value}>
      {children}
    </ContextoMulti.Provider>
  )
}

export function useMultimedia() {
  const context = useContext(ContextoMulti)

  if (!context) {
    throw new Error('useMultimedia: fuera de Proveedor')
  }

  return context
}
