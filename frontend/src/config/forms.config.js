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
}

export default formsConfig