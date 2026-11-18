export default function PlaceholderPage({ message = 'Esta página todavía no está disponible.' }) {
  return <p className="muted">{message}</p>
}