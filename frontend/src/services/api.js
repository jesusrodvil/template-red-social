import appConfig from '../config/app.config'
import * as db from '../data/mock'
import { formatUsername } from '../utils/format'

export class ApiError extends Error {}
const latency = () => new Promise((resolve) => setTimeout(resolve, appConfig.mockLatency))

const SESSION_KEY = 'sessionUserId'

function readSession() {
  try {
    return localStorage.getItem(SESSION_KEY)
  } catch {
    return null
  }
}

function writeSession(userId) {
  try {
    if (userId) localStorage.setItem(SESSION_KEY, userId)
    else localStorage.removeItem(SESSION_KEY)
  } catch {
    // Sin acceso al almacenamiento: la sesión solo dura hasta recargar.
  }
}

const findUser = (id) => db.users.find((user) => user.id === id)
const findGroup = (id) => db.groups.find((group) => group.id === id)
const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
const newId = (prefix) => `${prefix}${Date.now()}`
const deletedSender = { name: 'Eliminado', image: null, avatar: null }
const findAuthor = (id) => findUser(id) ?? { id, name: 'Usuario eliminado', avatar: null }

const withDetails = (post) => ({
  ...post,
  author: findAuthor(post.authorId),
  commentCount: db.comments.filter((c) => c.postId === post.id).length,
})

function getMemberGroup(groupId, user) {
  const group = findGroup(groupId)
  if (!group || !group.members.includes(user.id)) {
    throw new ApiError('El grupo no existe o no perteneces a él.')
  }
  return group
}

function pickNextOwner(group, leavingId) {
  return group.members
    .filter((id) => id !== leavingId)
    .map(findUser)
    .sort(
      (a, b) =>
        a.name.localeCompare(b.name, 'es', { sensitivity: 'base' }) ||
        a.id.localeCompare(b.id),
    )[0]
}

function findPendingInvitation(notificationId, user) {
  const notification = db.notifications.find((n) => n.id === notificationId)
  if (
    !notification ||
    notification.recipientId !== user.id ||
    notification.status !== 'pending'
  ) {
    throw new ApiError('La invitación ya no está disponible.')
  }
  return notification
}

function removeMember(group, userId) {
  if (group.ownerId === userId) {
    const nextOwner = pickNextOwner(group, userId)
    if (!nextOwner) {
      db.groups.splice(db.groups.indexOf(group), 1)
      return
    }
    group.ownerId = nextOwner.id
  }
  group.members = group.members.filter((id) => id !== userId)
}

function readAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function freeCode(handle, userId) {
  const taken = new Set(
    db.users.filter((u) => u.id !== userId && u.handle === handle).map((u) => u.code),
  )
  const free = Array.from({ length: 1000 }, (_, n) => String(n).padStart(3, '0')).filter(
    (code) => !taken.has(code),
  )
  if (free.length === 0) throw new ApiError('Ese usuario no está disponible. Prueba con otro.')
  return free[Math.floor(Math.random() * free.length)]
}

export async function getCurrentUser() {
  await latency()
  const user = findUser(readSession())
  return user ? { ...user } : null
}

export async function login(values) {
  await latency()
  const email = values.email.trim().toLowerCase()
  const user = db.users.find((candidate) => candidate.email === email)
  if (!user || values.password !== db.DEMO_PASSWORD) {
    throw new ApiError('El correo o la contraseña no son correctos.')
  }
  writeSession(user.id)
}

export async function logout() {
  await latency()
  writeSession(null)
}

export async function forgotPassword() {
  await latency()
  console.info('forgotPassword: pendiente de implementar en el backend')
  return 'Si el correo está registrado, te llegará un enlace para crear una contraseña nueva.'
}

export async function getGroupsFeed({ user }) {
  await latency()
  const myGroupIds = db.groups
    .filter((group) => group.members.includes(user.id))
    .map((group) => group.id)

  return db.posts
    .filter((post) => myGroupIds.includes(post.groupId))
    .sort(byNewest)
    .map(withDetails)
}

export async function getGroupFeed({ user, params }) {
  await latency()
  const group = getMemberGroup(params.groupId, user)

  return db.posts
    .filter((post) => post.groupId === group.id)
    .sort(byNewest)
    .map(withDetails)
}

export async function getComments(postId) {
  await latency()
  return db.comments
    .filter((comment) => comment.postId === postId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((comment) => ({ ...comment, author: findAuthor(comment.authorId) }))
}

export async function addComment(values, { user, postId }) {
  await latency()
  const post = db.posts.find((candidate) => candidate.id === postId)
  if (!post) throw new ApiError('La publicación ya no existe.')
  getMemberGroup(post.groupId, user)

  db.comments.push({
    id: newId('c'),
    postId,
    authorId: user.id,
    createdAt: new Date().toISOString(),
    text: values.text.trim(),
  })
}

export async function getGroupName({ user, params }) {
  await latency()
  return getMemberGroup(params.groupId, user).name
}

export async function getGroupInfo({ user, groupId }) {
  await latency()
  const group = getMemberGroup(groupId, user)
  const members = group.members
    .map(findUser)
    .sort((a, b) => (b.id === group.ownerId) - (a.id === group.ownerId))

  const isOwner = group.ownerId === user.id

  return {
    id: group.id,
    name: group.name,
    isOwner,
    nextOwnerName: isOwner ? (pickNextOwner(group, user.id)?.name ?? null) : null,
    members: members.map((member) => ({
      id: member.id,
      title: member.name,
      subtitle: [formatUsername(member), member.id === group.ownerId && 'Dueño']
        .filter(Boolean)
        .join(' · '),
      image: member.avatar,
      imageShape: 'circle',
    })),
  }
}

export async function leaveGroup({ user, groupId }) {
  await latency()
  const group = getMemberGroup(groupId, user)
  removeMember(group, user.id)
}

export async function inviteMember(values, { user, groupId }) {
  await latency()
  const group = getMemberGroup(groupId, user)
  if (group.ownerId !== user.id) {
    throw new ApiError('Solo el dueño del grupo puede invitar.')
  }

  const [, handle, code] = values.username.trim().match(/^@([\w-]+)#(\d{3})$/) ?? []
  const invited = db.users.find(
    (candidate) => candidate.handle === handle && candidate.code === code,
  )
  if (!invited) throw new ApiError('No existe ningún usuario con ese nombre.')
  if (group.members.includes(invited.id)) {
    throw new ApiError(`${invited.name} ya está en el grupo.`)
  }

  const alreadyInvited = db.notifications.some(
    (n) =>
      n.type === 'invitation' &&
      n.status === 'pending' &&
      n.recipientId === invited.id &&
      n.target.groupId === group.id,
  )
  if (alreadyInvited) {
    throw new ApiError(`${invited.name} ya tiene una invitación pendiente.`)
  }

  db.notifications.push({
    id: newId('n'),
    type: 'invitation',
    recipientId: invited.id,
    sender: { type: 'group', id: group.id },
    text: `${user.name} te ha invitado a unirte al grupo.`,
    createdAt: new Date().toISOString(),
    read: false,
    status: 'pending',
    target: { groupId: group.id },
  })

  return `Invitación enviada a ${invited.name}.`
}

export async function getMyGroups({ user }) {
  await latency()
  return db.groups
    .filter((group) => group.members.includes(user.id))
    .map((group) => ({
      id: group.id,
      title: group.name,
      subtitle: group.description,
      image: group.image,
      imageShape: 'square',
      link: { page: 'grupo', params: { groupId: group.id } },
    }))
}

export async function getNotifications({ user }) {
  await latency()
  return db.notifications
    .filter((notification) => notification.recipientId === user.id)
    .sort(byNewest)
    .map((notification) => {
      const { sender, target } = notification
      const isGroup = sender.type === 'group'
      const from = (isGroup ? findGroup(sender.id) : findUser(sender.id)) ?? deletedSender
      const isPending = notification.status === 'pending'
      const canOpen =
        !isPending && notification.status !== 'declined' && Boolean(findGroup(target.groupId))

      return {
        id: notification.id,
        title: from.name,
        subtitle: notification.text,
        image: isGroup ? from.image : from.avatar,
        imageShape: isGroup ? 'square' : 'circle',
        date: notification.createdAt,
        unread: !notification.read,
        link: canOpen && {
          page: 'grupo',
          params: { groupId: target.groupId },
          hash: target.postId && `post-${target.postId}`,
        },
        actions: isPending && [
          { id: 'accept', label: 'Aceptar', action: 'acceptInvitation', primary: true },
          { id: 'decline', label: 'Rechazar', action: 'declineInvitation' },
        ],
      }
    })
}

export async function markNotificationRead({ item }) {
  await latency()
  const notification = db.notifications.find((n) => n.id === item.id)
  if (notification) notification.read = true
}

export async function acceptInvitation({ user, item }) {
  await latency()
  const invitation = findPendingInvitation(item.id, user)
  const group = findGroup(invitation.target.groupId)
  if (!group) throw new ApiError('El grupo ya no existe.')

  if (!group.members.includes(user.id)) group.members.push(user.id)
  invitation.status = 'accepted'
  invitation.read = true
  invitation.text = 'Te has unido al grupo.'
}

export async function declineInvitation({ user, item }) {
  await latency()
  const invitation = findPendingInvitation(item.id, user)
  invitation.status = 'declined'
  invitation.read = true
  invitation.text = 'Has rechazado la invitación.'
}

export async function getProfileValues({ user }) {
  await latency()
  const stored = findUser(user.id)
  return {
    image: stored.avatar ? { url: stored.avatar } : null,
    name: stored.name,
    handle: stored.handle ?? '',
  }
}

export async function updateProfile(values, { user }) {
  await latency()
  const stored = findUser(user.id)
  if (!stored) throw new ApiError('Tu cuenta ya no existe.')

  const isAdmin = stored.role === 'admin'
  const handle = isAdmin ? stored.handle : values.handle.trim()
  const taken =
    !isAdmin &&
    db.users.some((u) => u.id !== stored.id && u.handle === handle && u.code === stored.code)
  const code = taken ? freeCode(handle, stored.id) : stored.code
  const avatar = values.image?.file
    ? await readAsDataUrl(values.image.file)
    : (values.image?.url ?? null)

  stored.avatar = avatar
  if (isAdmin) return 'Perfil actualizado.'

  stored.name = values.name.trim()
  stored.handle = handle
  stored.code = code
  return `Perfil actualizado. Tu usuario es @${handle}#${code}.`
}

export async function updatePassword(values, { user }) {
  await latency()
  if (!findUser(user.id)) throw new ApiError('Tu cuenta ya no existe.')
  console.info('updatePassword: pendiente de implementar en el backend')
  return 'Contraseña actualizada.'
}

export async function deleteAccount({ user }) {
  await latency()
  const stored = findUser(user.id)
  if (!stored) throw new ApiError('Tu cuenta ya no existe.')
  if (stored.role === 'admin') {
    throw new ApiError('La cuenta de administrador no se puede borrar.')
  }

  db.groups
    .filter((group) => group.members.includes(stored.id))
    .forEach((group) => removeMember(group, stored.id))
  db.users.splice(db.users.indexOf(stored), 1)
}

export async function createGroup(values, { user }) {
  await latency()
  console.info('createGroup: pendiente de implementar en el backend', {
    ...values,
    ownerId: user.id,
  })
}

export const feedSources = {
  groupsFeed: getGroupsFeed,
  groupFeed: getGroupFeed,
}

export const listSources = {
  myGroups: getMyGroups,
  notifications: getNotifications,
}

export const subtitleSources = {
  groupName: getGroupName,
}

export const itemActions = {
  markNotificationRead,
  acceptInvitation,
  declineInvitation,
}

export const formActions = {
  login,
  forgotPassword,
  createGroup,
  addComment,
  inviteMember,
  updateProfile,
  updatePassword,
}

export const formLoaders = {
  profile: getProfileValues,
}

export const confirmActions = {
  deleteAccount,
}