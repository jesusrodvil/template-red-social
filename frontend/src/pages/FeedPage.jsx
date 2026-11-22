import { useCallback, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router'
import CommentsModal from '../components/feed/CommentsModal'
import PageActions from '../components/layout/PageActions'
import PostCard from '../components/feed/PostCard'
import Loading from '../components/ui/Loading'
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
  const { data: posts, loading, error, reload } = useAsync(loader)
  const [commentsPostId, setCommentsPostId] = useState(null)

  useEffect(() => {
    if (loading || !highlightedId) return
    document.getElementById(highlightedId)?.scrollIntoView({ block: 'center' })
  }, [loading, highlightedId])

  if (loading) return <Loading />
  if (error) return <p className="muted">No se ha podido cargar el feed.</p>

  return (
    <>
      <PageActions page={page} />
      {posts.length === 0 && <p className="muted">Todavía no hay publicaciones.</p>}
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
          onCommentAdded={reload}
        />
      )}
    </>
  )
}