# @webiny/cli-plugin-build
[![](https://img.shields.io/npm/dw/@webiny/cli-plugin-build.svg)](https://www.npmjs.com/package/@webiny/cli-plugin-build) 
[![](https://img.shields.io/npm/v/@webiny/cli-plugin-build.svg)](https://www.npmjs.com/package/@webiny/cli-plugin-build)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

A set of @webiny/cli plugins to deploy Webiny project using serverless components.
   
## Install
```
yarn add @webiny/cli-plugin-build
```

Add plugin to your project by editing `webiny.root.js`:

```js
module.exports = {
    projectName: "my-project",
    cli: {
        plugins: ["@webiny/cli-plugin-build"]
    }
};
```
