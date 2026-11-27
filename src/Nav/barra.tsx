import { Link } from 'react-router-dom'
import './barra.css'
import b1 from '../componentes/B1.svg'
import b2 from '../componentes/B2.svg'
import b4 from '../componentes/B4.svg'
import b6 from '../componentes/B6.svg'
import b5 from '../componentes/B5.svg'

export default function Barra() {
  return (
    <div className="boton-barra">
      <Link to="/" className="btn inicio">
        <img src={b1} alt="Inicio" height={80} />
      </Link>
        <Link to="/redes" className="btn redes">
          <img src={b2} alt="Redes" height={80} />
        </Link>
      <Link to="/multimedia" className="btn multimedia">
        <img src={b4} alt="Multimedia" height={80} />
      </Link>
      <Link to="/tienda" className="btn tienda">
        <img src={b6} alt="Tienda" height={80} />
      </Link>
      <Link to="/wikia" className="btn wikia">
        <img src={b5} alt="Wikia" height={80} />
      </Link>
    </div>
  )
}
