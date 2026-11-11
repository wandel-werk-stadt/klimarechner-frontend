/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-prettier/skip-formatting',
    ],
    parserOptions: {
        ecmaVersion: 'latest',
    },
    rules: {
        'no-console': 'off',
        'guard-for-in': 'off',
        'vue/require-default-prop': 'off',
        'vue/multi-word-component-names': 0,
        'vue/no-v-model-argument': 'off',
        'vue/no-multiple-template-root': 0,
        'nuxt/no-cjs-in-config': 'off',
        'no-restricted-syntax': 'off',
        'no-param-reassign': 'off',
        'max-lines': ['error', { max: 500, skipBlankLines: true }],
    },
}
