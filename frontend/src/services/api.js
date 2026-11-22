import rolesConfig from '../config/roles.config'
import * as db from '../data/mock'
import { formatUsername } from '../utils/format'

export class ApiError extends Error {}

const findUser = (id) => db.users.find((user) => user.id === id)
const findGroup = (id) => db.groups.find((group) => group.id === id)
const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
const newId = (prefix) => `${prefix}${Date.now()}`
const deletedSender = { name: 'Eliminado', image: null, avatar: null }

const withDetails = (post) => ({
  ...post,
  author: findUser(post.authorId),
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

export async function getCurrentUser() {
  return db.users.find((user) => user.role === rolesConfig.defaultRole)
}

export async function getGroupsFeed({ user }) {
  const myGroupIds = db.groups
    .filter((group) => group.members.includes(user.id))
    .map((group) => group.id)

  return db.posts
    .filter((post) => myGroupIds.includes(post.groupId))
    .sort(byNewest)
    .map(withDetails)
}

export async function getGroupFeed({ user, params }) {
  const group = getMemberGroup(params.groupId, user)

  return db.posts
    .filter((post) => post.groupId === group.id)
    .sort(byNewest)
    .map(withDetails)
}

export async function getComments(postId) {
  return db.comments
    .filter((comment) => comment.postId === postId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((comment) => ({ ...comment, author: findUser(comment.authorId) }))
}

export async function addComment(values, { user, postId }) {
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
  return getMemberGroup(params.groupId, user).name
}

export async function getGroupInfo({ user, groupId }) {
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
  const group = getMemberGroup(groupId, user)

  if (group.ownerId === user.id) {
    const nextOwner = pickNextOwner(group, user.id)
    if (!nextOwner) {
      db.groups.splice(db.groups.indexOf(group), 1)
      return
    }
    group.ownerId = nextOwner.id
  }

  group.members = group.members.filter((id) => id !== user.id)
}

export async function inviteMember(values, { user, groupId }) {
  const group = getMemberGroup(groupId, user)
  if (group.ownerId !== user.id) {
    throw new ApiError('Solo el dueño del grupo puede invitar.')
  }

  const [, id, code] = values.username.trim().match(/^@([\w-]+)#(\d{3})$/) ?? []
  const invited = db.users.find((candidate) => candidate.id === id && candidate.code === code)
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
  const notification = db.notifications.find((n) => n.id === item.id)
  if (notification) notification.read = true
}

export async function acceptInvitation({ user, item }) {
  const invitation = findPendingInvitation(item.id, user)
  const group = findGroup(invitation.target.groupId)
  if (!group) throw new ApiError('El grupo ya no existe.')

  if (!group.members.includes(user.id)) group.members.push(user.id)
  invitation.status = 'accepted'
  invitation.read = true
  invitation.text = 'Te has unido al grupo.'
}

export async function declineInvitation({ user, item }) {
  const invitation = findPendingInvitation(item.id, user)
  invitation.status = 'declined'
  invitation.read = true
  invitation.text = 'Has rechazado la invitación.'
}

export async function createGroup(values, { user }) {
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
  createGroup,
  addComment,
  inviteMember,
}