# Angular CLI doesn't transpile .js files

Angular CLI uses Webpack with ts-loader under the hood, and it won't use babel to transpile js files out of the box.

If you have a large app you're turning into a hybrid and it's all written in JavaScript not TypeScript and you need to transpile ES6 code to ES5 (e.g. for IE11) you have two options:

## Re-write all your files into TypeScript

This will mean your ts files will be transpiled into ES5 and it should be all sweet. But if you have a lot of js files this can take a long time.

## Customise the underlying Webpack config and add babel-loader

As of CLI v6 you can now customise the underlying webpack config! 🎉

Use one of the following tools to customise your webpack config and add [babel-loader](https://github.com/babel/babel-loader) to transpike your js files into ES5:

- [@angular-builders/custom-webpack](https://codeburst.io/customizing-angular-cli-6-build-an-alternative-to-ng-eject-a48304cd3b21)

- [ngx-build-plus](https://github.com/manfredsteyer/ngx-build-plus)
