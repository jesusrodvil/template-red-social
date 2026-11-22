import { useState } from 'react'
import { formatDate, formatUsername } from '../../utils/format'
import Avatar from '../ui/Avatar'
import Icon from '../ui/Icon'
import './PostCard.css'

export default function PostCard({ post, onOpenComments, highlighted = false }) {
  const [liked, setLiked] = useState(post.likedByMe)
  const likes = post.likes - Number(post.likedByMe) + Number(liked)
  const username = formatUsername(post.author)

  return (
    <article
      id={`post-${post.id}`}
      className={highlighted ? 'post post--highlighted' : 'post'}
    >
      <header className="post__header">
        <Avatar user={post.author} size={36} />
        <span className="post__author">
          {post.author.name}
          {username && <span className="post__username">{username}</span>}
        </span>
        <time className="post__date" dateTime={post.createdAt}>
          {formatDate(post.createdAt)}
        </time>
      </header>

      {post.image && <img className="post__image" src={post.image} alt="" />}

      <footer className="post__footer">
        <p className="post__text">{post.text}</p>
        <div className="post__actions">
          <button
            type="button"
            className="post__action post__action--like"
            aria-pressed={liked}
            aria-label={`Me gusta (${likes})`}
            onClick={() => setLiked(!liked)}
          >
            <Icon name="Heart" fill={liked ? 'currentColor' : 'none'} />
            {likes}
          </button>
          <button
            type="button"
            className="post__action"
            aria-label={`Ver comentarios (${post.commentCount})`}
            onClick={() => onOpenComments(post.id)}
          >
            <Icon name="MessageCircle" />
            {post.commentCount}
          </button>
        </div>
      </footer>
    </article>
  )
}