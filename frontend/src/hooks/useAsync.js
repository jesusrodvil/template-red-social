import { useCallback, useEffect, useState } from 'react'

export function useAsync(loader) {
  const [state, setState] = useState({ data: null, loading: true, error: null })
  const [version, setVersion] = useState(0)

  useEffect(() => {
    let cancelled = false

    loader().then(
      (data) => !cancelled && setState({ data, loading: false, error: null }),
      (error) => !cancelled && setState({ data: null, loading: false, error }),
    )

    return () => {
      cancelled = true
    }
  }, [loader, version])

  const reload = useCallback(() => setVersion((current) => current + 1), [])

  return { ...state, reload }
}