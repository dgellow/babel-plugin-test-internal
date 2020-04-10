# `test-internal` plugin for Babel [![npm version](https://badge.fury.io/js/babel-plugin-test-internal.svg)](https://badge.fury.io/js/babel-plugin-test-internal) and Typescript [![npm version](https://badge.fury.io/js/typescript-plugin-test-internal.svg)](https://badge.fury.io/js/typescript-plugin-test-internal)

## Usage

### Babel plugin

1. Install package
```sh
$ npm install -D babel-plugin-test-internal
$ yarn add -D babel-plugin-test-internal
```

2. Add the plugin to Babel configuration in your `babel.config.js`

```js
// configuration example

module.exports = api => {
  //  1. 👇 are we in a test context?
  const isTest = api.env('test')
  // 2. if yes, then register the plugin 👇
  const plugins = isTest ? ["test-internal"]: []

  return {
  presets: [
  "@babel/preset-env",
  "@babel/preset-typescript",
  "@babel/preset-react",
  ],
  plugins, // 👈  3. don't forget to add the plugins property to the configuration object
  }
}
```

3. In your code, where you want to use internal content (i.e: your tests)

```js
// 1. 👇 import __internal__ from the module you want to test
import {__internal__} from "./your-file"

test("testing some internal things", () => {
  const expected = ...
  // 2. 👇 use the properties you need
  assert(__internal__.doSomething(), expected)
})
```

### Typescript compiler plugin

1. Install package

```
$ npm install -D typescript-plugin-test-internal
$ yarn add -D typescript-plugin-test-internal
```

2. Add the plugin to [ts-loader](https://github.com/TypeStrong/ts-loader/) configuration in your `webpack.config.js`

```js
// configuration example

// 👇 1. import the plugin
var testInternalTranformer = require('typescript-plugin-test-internal').default;

module.exports = {
  mode: 'development',
  entry: './index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'ts-loader',
        options: { // 👈 2. add ts-loader 'options' object
          // 3. 👇 add the method 'getCustomTransformers'
          getCustomTransformers: program => ({
            // 4. register the plugin 👇
            before: [uppercaseStringLiteralTransformer]
          })
        }
      }
    ]
  }
}
```

3. In your code, where you want to use internal content (i.e: your tests)

```ts
// 1. 👇 import '__internal__' from the module you want to test
import {__internal__} from "./your-file"

test("testing some internal things", () => {
  const expected = ...
  // 2. use properties you need 👇
  assert(__internal__.doSomething(), expected)
})
```

## Development

### Babel plugin

```
$ cd ./babel
$ yarn install
$ yarn test
$ yarn build
```

### Typescript plugin

```
$ cd ./typescript
$ yarn install
$ yarn test
$ yarn build
```
