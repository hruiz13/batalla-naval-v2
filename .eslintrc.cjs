module.exports = {
  env     : { browser: true, es2020: true },
  extends : [
    'standard-with-typescript'
  ],
  parserOptions : {
    project : './tsconfig.json'
  },
  plugins : ['react-refresh'],
  rules   : {
    'react-refresh/only-export-components'             : 'warn',
    '@typescript-eslint/explicit-function-return-type' : 'off',
    '@typescript-eslint/no-floating-promises'          : 'off',
    '@typescript-eslint/strict-boolean-expressions'    : 'off',
    'key-spacing'                                      : [
      'error',
      {
        singleLine : {
          beforeColon : false,
          afterColon  : true
        },
        multiLine : {
          beforeColon : true,
          afterColon  : true,
          align       : 'colon'
        }
      }
    ],
    indent : [
      'error',
      2,
      {
        ignoredNodes             : ['ConditionalExpression'],
        offsetTernaryExpressions : true,
        SwitchCase               : 1
      }
    ]
  }
}
