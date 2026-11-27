import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import Barra from './Nav/barra'
import Inicio from './Inicio/inicio'
import InfoB from './Nav/infoB'
import Redes from './Redes/redes'
import DispoMulti from './Multimedia/dispoMulti'
import Carrusel from './Multimedia/Carrusel/carrusel'
import Elemento from './Multimedia/Elementos/elemento'
import Reproductor from './Multimedia/Elementos/Reproductor/reproductor'
import Tienda from './Tienda/tienda'
import Wikia from './Wikia/wikia'

export default function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={
        <>  
        <InfoB />
        <Inicio />
        </>}/>

        <Route path='/redes' element={<Redes/>}/>

        <Route path='/multimedia' element={<DispoMulti/>}>
          <Route index element = {<Carrusel/>}/>
          <Route path='Objeto/:objetoId' element={<Elemento/>}/>
          <Route path='Objeto/:objetoId/Cap/:capitulo' element={<Reproductor/>}/>
        </Route>

        <Route path='/tienda' element={<Tienda/>}/>
        
        <Route path='/wikia' element={<Wikia/>}/>

        <Route path="*"element={<Navigate to="/" replace />}/>
      </Routes>
      <Barra />
    </>
  )
}
