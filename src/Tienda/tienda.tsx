import './tienda.css'
{/*import Logo from '../assets/Logo.svg'*/}

export default function Tienda() {
  return (
    <div className="tienda">
      <div className="tienda-Box1">
        <div className="tienda-Box2">
            <div className='tienda-Box3'>
            {/* <img src= {Logo} alt="LLPS" className="img" /> */}
            <h1 className="Tien_Nom">Love Live Protection Squad</h1>
            <h2 className='Tien_Info'>Pagina dedicada a vender cosas de love live</h2>
            </div>
            </div>
        </div>
    <div className="tienda-Box4">
        <div className="tienda-Item"><h1 className='Name'>Nesos</h1></div>
        <div className="tienda-Item"><h1 className='Name'>Figma</h1></div>
        <div className="tienda-Item"><h1 className='Name'>Nendroid</h1></div>
        <div className="tienda-Item"><h1 className='Name'>CD</h1></div>
        <div className="tienda-Item"><h1 className='Name'>Blueray</h1></div>
        <div className="tienda-Item"><h1 className='Name'>y más</h1></div>
        </div>
    </div>
  )
}
