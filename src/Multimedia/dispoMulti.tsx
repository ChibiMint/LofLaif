import { Outlet, useLocation } from 'react-router-dom'
import { Proveedor } from './contextoMulti'
import Multimedia from './multimedia'
import '../App.css'

export default function DispoMulti() {
  const locacion = useLocation()
  const Carrusel = locacion.pathname === '/multimedia'

  return (
    <Proveedor>
      <div className={`multimedia-pag ${Carrusel ? 'multimedia-pag--carrusel' : 'multimedia-pag--detalle'}`}>
        {Carrusel && <Multimedia />}

        <main className="multimedia-carrusel-base">
          <Outlet />
        </main>
      </div>
    </Proveedor>
  )
}