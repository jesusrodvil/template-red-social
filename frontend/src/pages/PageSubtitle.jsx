import { useCallback, useEffect } from 'react'
import { useOutletContext, useParams } from 'react-router'
import { useApp } from '../context/app-context'
import { useAsync } from '../hooks/useAsync'
import { subtitleSources } from '../services/api'

export default function PageSubtitle({ page }) {
  const { setSubtitle } = useOutletContext()
  const { user } = useApp()
  const params = useParams()

  const loader = useCallback(async () => {
    if (page.subtitleSource) {
      return subtitleSources[page.subtitleSource]({ user, params })
    }
    return page.subtitle ?? null
  }, [page, user, params])
  const { data: subtitle } = useAsync(loader)

  useEffect(() => {
    setSubtitle(subtitle)
    return () => setSubtitle(null)
  }, [subtitle, setSubtitle])

  return null
}