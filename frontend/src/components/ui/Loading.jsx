import Spinner from './Spinner'
import './Loading.css'

export default function Loading({ label = 'Cargando…', fullScreen = false }) {
  return (
    <div className={fullScreen ? 'loading loading--full' : 'loading'} role="status">
      <Spinner />
      <span className="loading__label">{label}</span>
    </div>
  )
}