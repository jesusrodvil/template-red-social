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
}

export default formsConfig