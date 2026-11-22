export const DEMO_PASSWORD = 'demo1234'

export const users = [
  { id: 'admin', email: 'admin@example.com', name: 'Administrador', role: 'admin', avatar: null },
  {
    id: 'lucia',
    email: 'lucia@example.com',
    handle: 'lucia',
    code: '123',
    name: 'Lucía',
    role: 'user',
    avatar: null,
  },
  {
    id: 'pablo',
    email: 'pablo@example.com',
    handle: 'pablo',
    code: '042',
    name: 'Pablo',
    role: 'user',
    avatar: null,
  },
  {
    id: 'marta',
    email: 'marta@example.com',
    handle: 'marta',
    code: '777',
    name: 'Marta',
    role: 'user',
    avatar: null,
  },
]

export const groups = [
  {
    id: 'g1',
    name: 'Amigos del cole',
    description: 'Cenas, quedadas y fotos de toda la vida.',
    image: null,
    ownerId: 'admin',
    members: ['admin', 'lucia', 'pablo'],
  },
  {
    id: 'g2',
    name: 'Equipo de pádel',
    description: 'Partidos de los jueves y la liga del barrio.',
    image: '/mock/foto-1.svg',
    ownerId: 'pablo',
    members: ['admin', 'pablo'],
  },
  {
    id: 'g3',
    name: 'Viaje a Lisboa',
    description: 'Organización del viaje de primavera.',
    image: null,
    ownerId: 'lucia',
    members: ['lucia', 'pablo'],
  },
]

export const posts = [
  {
    id: 'p1',
    groupId: 'g1',
    authorId: 'lucia',
    createdAt: '2026-11-15T19:20:00',
    text: '¿Quedamos el sábado para cenar?',
    image: null,
    likes: 3,
    likedByMe: false,
  },
  {
    id: 'p2',
    groupId: 'g2',
    authorId: 'pablo',
    createdAt: '2026-11-16T10:05:00',
    text: 'Foto del partido de ayer. ¡Revancha la semana que viene!',
    image: '/mock/foto-1.svg',
    likes: 5,
    likedByMe: true,
  },
  {
    id: 'p3',
    groupId: 'g3',
    authorId: 'lucia',
    createdAt: '2026-11-16T12:00:00',
    text: '¿Quién mira vuelos para abril?',
    image: null,
    likes: 0,
    likedByMe: false,
  },
]

export const comments = [
  { id: 'c1', postId: 'p1', authorId: 'pablo', createdAt: '2026-11-15T19:30:00', text: '¡Yo me apunto!' },
  { id: 'c2', postId: 'p1', authorId: 'admin', createdAt: '2026-11-15T20:02:00', text: 'Reservo yo.' },
  { id: 'c3', postId: 'p2', authorId: 'lucia', createdAt: '2026-11-16T10:40:00', text: 'Qué paliza 😂' },
]

export const notifications = [
  {
    id: 'n4',
    type: 'invitation',
    recipientId: 'admin',
    sender: { type: 'group', id: 'g3' },
    text: 'Lucía te ha invitado a unirte al grupo.',
    createdAt: '2026-11-17T09:30:00',
    read: false,
    status: 'pending',
    target: { groupId: 'g3' },
  },
  {
    id: 'n1',
    type: 'post',
    recipientId: 'admin',
    sender: { type: 'user', id: 'pablo' },
    text: 'Ha publicado en Equipo de pádel.',
    createdAt: '2026-11-16T10:05:00',
    read: false,
    target: { groupId: 'g2', postId: 'p2' },
  },
  {
    id: 'n2',
    type: 'member',
    recipientId: 'admin',
    sender: { type: 'group', id: 'g2' },
    text: 'Te han añadido al grupo.',
    createdAt: '2026-11-15T21:00:00',
    read: false,
    target: { groupId: 'g2' },
  },
  {
    id: 'n3',
    type: 'post',
    recipientId: 'admin',
    sender: { type: 'user', id: 'lucia' },
    text: 'Ha publicado en Amigos del cole.',
    createdAt: '2026-11-15T19:20:00',
    read: true,
    target: { groupId: 'g1', postId: 'p1' },
  },
]