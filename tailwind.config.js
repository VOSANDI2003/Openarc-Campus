import { defineConfig } from 'tailwindcss'

export default defineConfig({
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.jsx',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
})
