import { defineConfig } from '@tanstack/react-start/config'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  // This is the crucial part for hosting
  server: {
    preset: 'node-server',
  },
  vite: {
    plugins: [
      tsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      // Note: tanstackStart() is handled automatically by the defineConfig wrapper
    ],
  },
})
