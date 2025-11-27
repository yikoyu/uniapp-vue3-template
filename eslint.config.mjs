import process from 'node:process'
import antfu from '@antfu/eslint-config'

export default antfu({
  unocss: true,
  vue: true,
  ignores: [
    'node_modules/*',
    'node_modules/*/**',
    '**/node_modules/*',
    'dist',
    '**/dist/**',
    'lib',
    '**/lib/**',
  ],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'off' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'unused-imports/no-unused-vars': 'off',
  },
})
