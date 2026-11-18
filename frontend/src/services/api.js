import rolesConfig from '../config/roles.config'
import * as db from '../data/mock'

const findUser = (id) => db.users.find((user) => user.id === id)

export async function getCurrentUser() {
  return db.users.find((user) => user.role === rolesConfig.defaultRole)
}

export async function getGroupsFeed(currentUser) {
  const myGroupIds = db.groups
    .filter((group) => group.members.includes(currentUser.id))
    .map((group) => group.id)

  return db.posts
    .filter((post) => myGroupIds.includes(post.groupId))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((post) => ({
      ...post,
      author: findUser(post.authorId),
      commentCount: db.comments.filter((c) => c.postId === post.id).length,
    }))
}

export async function getComments(postId) {
  return db.comments
    .filter((comment) => comment.postId === postId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    .map((comment) => ({ ...comment, author: findUser(comment.authorId) }))
}

export const feedSources = {
  groupsFeed: getGroupsFeed,
}