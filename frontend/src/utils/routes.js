import { generatePath } from 'react-router'
import { pages } from '../config/pages.config'

export function pathTo({ page: pageId, params = {}, hash }) {
  const page = pages.find((candidate) => candidate.id === pageId)
  if (!page) throw new Error(`No existe ninguna página con id "${pageId}"`)

  const path = generatePath(page.path, params)
  return hash ? `${path}#${hash}` : path
}