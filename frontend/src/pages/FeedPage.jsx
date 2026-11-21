import { useCallback, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import CommentsModal from '../components/CommentsModal'
import PostCard from '../components/PostCard'
import { useApp } from '../context/app-context'
import { useAsync } from '../hooks/useAsync'
import { feedSources } from '../services/api'

export default function FeedPage({ page }) {
  const { user } = useApp()
  const params = useParams()
  const { hash } = useLocation()
  const highlightedId = hash.slice(1)
  const loader = useCallback(
    async () => feedSources[page.source]({ user, params }),
    [page.source, user, params],
  )
  const { data: posts, loading, error } = useAsync(loader)
  const [commentsPostId, setCommentsPostId] = useState(null)

  useEffect(() => {
    if (!posts || !highlightedId) return
    document.getElementById(highlightedId)?.scrollIntoView({ block: 'center' })
  }, [posts, highlightedId])

  if (loading) return <p className="muted">Cargando…</p>
  if (error) return <p className="muted">No se ha podido cargar el feed.</p>
  if (posts.length === 0) return <p className="muted">Todavía no hay publicaciones.</p>

  return (
    <>
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onOpenComments={setCommentsPostId}
          highlighted={highlightedId === `post-${post.id}`}
        />
      ))}
      {commentsPostId && (
        <CommentsModal
          postId={commentsPostId}
          onClose={() => setCommentsPostId(null)}
        />
      )}
    </>
  )
}