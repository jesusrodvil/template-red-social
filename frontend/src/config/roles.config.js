const rolesConfig = {
  roles: {
    admin: { label: 'Administrador', unique: true },
    user: { label: 'Usuario', unique: false },
  },
  defaultRole: 'user',
}

export default rolesConfig