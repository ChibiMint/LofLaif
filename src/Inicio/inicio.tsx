import './inicio.css'
import cuadro from '../componentes/BR3.svg'
import iz from '../componentes/t1.svg'
import der from '../componentes/t2.svg'

export default function Inicio() {
    return (
        <div className="inicio">
        <div className="caja">
            <img src={iz} className="iz" alt="iz" />
            <img src={cuadro} className="cuadro" alt="Cuadro" />
            <img src={der} className="der" alt="der" />
        </div>
        <div className="imag">
            <img src={"https://i.idol.st/u/idol/9Minami-Kotori-97bAtR.png"} className="personaje" alt="personaje" />
        </div>
        </div>
    )
}