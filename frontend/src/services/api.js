import rolesConfig from '../config/roles.config'
import * as db from '../data/mock'

const findUser = (id) => db.users.find((user) => user.id === id)
const findGroup = (id) => db.groups.find((group) => group.id === id)
const byNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt)

const withDetails = (post) => ({
  ...post,
  author: findUser(post.authorId),
  commentCount: db.comments.filter((c) => c.postId === post.id).length,
})

function getMemberGroup(groupId, user) {
  const group = findGroup(groupId)
  if (!group || !group.members.includes(user.id)) {
    throw new Error('El grupo no existe o no perteneces a él')
  }
  return group
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

export async function getGroupName({ user, params }) {
  return getMemberGroup(params.groupId, user).name
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
      const from = isGroup ? findGroup(sender.id) : findUser(sender.id)

      return {
        id: notification.id,
        title: from.name,
        subtitle: notification.text,
        image: isGroup ? from.image : from.avatar,
        imageShape: isGroup ? 'square' : 'circle',
        date: notification.createdAt,
        unread: !notification.read,
        link: {
          page: 'grupo',
          params: { groupId: target.groupId },
          hash: target.postId && `post-${target.postId}`,
        },
      }
    })
}

export async function markNotificationRead({ item }) {
  const notification = db.notifications.find((n) => n.id === item.id)
  if (notification) notification.read = true
}

export async function createGroup(values) {
  console.info('createGroup: pendiente de implementar en el backend', values)
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
}

export const formActions = {
  createGroup,
}