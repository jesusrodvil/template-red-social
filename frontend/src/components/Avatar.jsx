import './Avatar.css'

export default function Avatar({ user, size = 40, shape = 'circle' }) {
  const style = { width: size, height: size, fontSize: size * 0.45 }
  const className = `avatar avatar--${shape}`

  if (user?.avatar) {
    return <img className={className} src={user.avatar} alt="" style={style} />
  }

  return (
    <span className={`${className} avatar--fallback`} style={style} aria-hidden="true">
      {user?.name?.charAt(0).toUpperCase() ?? '?'}
    </span>
  )
}