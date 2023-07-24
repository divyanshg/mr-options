import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Event Space',

  projectId: '3dqpjn46',
  dataset: 'mr-options',

  plugins: [deskTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
