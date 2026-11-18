import { useCallback, useState } from 'react'
import CommentsModal from '../components/CommentsModal'
import PostCard from '../components/PostCard'
import { useApp } from '../context/app-context'
import { useAsync } from '../hooks/useAsync'
import { feedSources } from '../services/api'

export default function FeedPage({ page }) {
  const { user } = useApp()
  const loader = useCallback(
    async () => feedSources[page.source](user),
    [page.source, user],
  )
  const { data: posts, loading, error } = useAsync(loader)
  const [commentsPostId, setCommentsPostId] = useState(null)

  if (loading) return <p className="muted">Cargando…</p>
  if (error) return <p className="muted">No se ha podido cargar el feed.</p>
  if (posts.length === 0) return <p className="muted">Todavía no hay publicaciones.</p>

  return (
    <>
      {posts.map((post) => (
        <PostCard key={post.id} post={post} onOpenComments={setCommentsPostId} />
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