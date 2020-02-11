module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'plugin:@typescript-eslint/eslint-recommended'],
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    }

};