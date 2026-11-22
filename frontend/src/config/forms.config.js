import appConfig from './app.config'

const formsConfig = {
  createGroup: {
    title: 'Crear grupo',
    submitLabel: 'Crear',
    submit: 'createGroup',
    fields: [
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        required: true,
        maxLength: appConfig.limits.groupName,
      },
      {
        name: 'description',
        label: 'Descripción',
        type: 'textarea',
        maxLength: appConfig.limits.groupDescription,
      },
      {
        name: 'image',
        label: 'Foto',
        type: 'image',
      },
    ],
  },
  addComment: {
    submitLabel: 'Publicar',
    submit: 'addComment',
    fields: [
      {
        name: 'text',
        label: 'Escribe un comentario',
        type: 'textarea',
        rows: 2,
        required: true,
        maxLength: appConfig.limits.commentText,
      },
    ],
  },
  inviteMember: {
    submitLabel: 'Invitar',
    submit: 'inviteMember',
    fields: [
      {
        name: 'username',
        label: 'Invitar a un usuario',
        type: 'text',
        required: true,
        placeholder: '@usuario#123',
        pattern: '^@[\\w-]+#\\d{3}$',
        patternMessage: 'El usuario tiene el formato @usuario#123.',
      },
    ],
  },
  profile: {
    submitLabel: 'Guardar',
    submit: 'updateProfile',
    load: 'profile',
    fields: [
      {
        name: 'image',
        label: 'Foto de perfil',
        type: 'image',
      },
      {
        name: 'name',
        label: 'Nombre',
        type: 'text',
        required: true,
        maxLength: appConfig.limits.userName,
        roles: ['user'],
      },
      {
        name: 'handle',
        label: 'Usuario',
        type: 'text',
        required: true,
        maxLength: appConfig.limits.userHandle,
        pattern: '^[\\w-]+$',
        patternMessage: 'Usa solo letras sin tilde, números, guiones y guiones bajos.',
        help: 'Sin @ ni código. Tu código de 3 dígitos se mantiene si está libre.',
        roles: ['user'],
      },
    ],
  },
  password: {
    submitLabel: 'Actualizar contraseña',
    submit: 'updatePassword',
    fields: [
      {
        name: 'password',
        label: 'Nueva contraseña',
        type: 'password',
        required: true,
        autoComplete: 'new-password',
        minLength: appConfig.limits.passwordMin,
      },
      {
        name: 'passwordRepeat',
        label: 'Repetir nueva contraseña',
        type: 'password',
        required: true,
        autoComplete: 'new-password',
        matches: 'password',
        matchesMessage: 'Las contraseñas no coinciden.',
      },
    ],
  },
  login: {
    submitLabel: 'Iniciar sesión',
    submit: 'login',
    fields: [
      {
        name: 'email',
        label: 'Correo electrónico',
        type: 'email',
        required: true,
        autoComplete: 'username',
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        patternMessage: 'Escribe un correo válido, como nombre@ejemplo.com.',
      },
      {
        name: 'password',
        label: 'Contraseña',
        type: 'password',
        required: true,
        autoComplete: 'current-password',
      },
    ],
  },
  forgotPassword: {
    submitLabel: 'Enviar enlace',
    submit: 'forgotPassword',
    fields: [
      {
        name: 'email',
        label: 'Correo electrónico',
        type: 'email',
        required: true,
        autoComplete: 'email',
        pattern: '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$',
        patternMessage: 'Escribe un correo válido, como nombre@ejemplo.com.',
        help: 'Te enviaremos un enlace para crear una contraseña nueva.',
      },
    ],
  },
}

export default formsConfig