export const users = [
  { id: 'admin', name: 'Administrador', role: 'admin', avatar: null },
  { id: 'lucia', code: '123', name: 'Lucía', role: 'user', avatar: null },
  { id: 'pablo', code: '042', name: 'Pablo', role: 'user', avatar: null },
]

export const groups = [
  { id: 'g1', name: 'Amigos del cole', members: ['admin', 'lucia', 'pablo'] },
  { id: 'g2', name: 'Equipo de pádel', members: ['admin', 'pablo'] },
  { id: 'g3', name: 'Viaje a Lisboa', members: ['lucia', 'pablo'] },
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
    text: 'Este post no debería verse: el administrador no está en este grupo.',
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