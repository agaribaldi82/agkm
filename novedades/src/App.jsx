import { novedades } from "./datos_novedades"
import './App.css'

export default function App(props) {
  return(
    <div className="novedades">
      {novedades.map(({ id, img }) => (
        <div key={id}>
          <img src={img.src} alt={img.alt}/>
        </div>
      ))}
    </div>
  )
}