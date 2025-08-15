import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development'

  if (isDev) {
    return {
      plugins: [react(), tailwindcss()],
      css: {
        postcss: './postcss.config.js'
      }
    }
  }

  // Library build configuration
  return {
    plugins: [
      react(),
      tailwindcss(),
      dts({
        insertTypesEntry: true,
        include: ['src/**/*'],
        exclude: ['src/**/*.test.*', 'src/**/*.stories.*', 'src/main.tsx', 'src/App.tsx', 'src/pages/**/*']
      })
    ],
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'ReactAdvancedKeyboard',
        formats: ['es', 'umd'],
        fileName: (format) => `index.${format}.js`
      },
      rollupOptions: {
        external: ['react', 'react-dom', 'react/jsx-runtime'],
        output: {
          globals: {
            react: 'React',
            'react-dom': 'ReactDOM',
            'react/jsx-runtime': 'jsxRuntime'
          }
        }
      },
      sourcemap: true,
      emptyOutDir: true
    },
    css: {
      postcss: './postcss.config.js'
    }
  }
})
