import appConfig from '../config/app.config'

const dateFormatter = new Intl.DateTimeFormat(appConfig.locale, {
  day: '2-digit',
  month: '2-digit',
  year: '2-digit',
})

export function formatDate(isoDate) {
  return dateFormatter.format(new Date(isoDate))
}

export function formatUsername(user) {
  if (!user?.code) return null
  return `@${user.id}#${user.code}`
}