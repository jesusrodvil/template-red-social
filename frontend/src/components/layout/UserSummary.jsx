import { Link } from 'react-router'
import { menuConfig } from '../../config/pages.config'
import { useApp } from '../../context/app-context'
import { formatUsername } from '../../utils/format'
import Avatar from '../ui/Avatar'
import './UserSummary.css'

export default function UserSummary({ avatarSize = 56, onNavigate }) {
  const { user } = useApp()
  const username = formatUsername(user)

  return (
    <Link to={menuConfig.userSectionLink} className="user-summary" onClick={onNavigate}>
      <Avatar user={user} size={avatarSize} />
      <div>
        <p className="user-summary__name">{user.name}</p>
        {username && <p className="user-summary__username">{username}</p>}
      </div>
    </Link>
  )
}