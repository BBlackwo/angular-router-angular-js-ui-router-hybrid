# Guide - Angular Router and AngularJs UI Router Hybrid

Have a read through the official [Angular Upgrade Docs](https://angular.io/guide/upgrade) first to get a good grasp on how Angular Upgrade works.

At the end of this guide you should be able to set up a hybrid Angular 6+ and AngularJs (Angular 1.x) app with Angular Router and AngularJs UI-Router working nicely together.

## 0. Scaffold New Project With Angular CLI

```sh
npx @angular/cli new your-project-name
```

## 1. Set Up Angular and AngularJs Hybrid App

See [Part 1](./part-1.md)

## 2. Add Angular Router With Config

// ....

## 3. Add UI Router With Config

```sh
npm install --save angular-ui-router
```

```ts
import 'angular-ui-router';

export const legacyApp = angular.module('legacyApp', ['ui.router']);
```


// ...

## 4. Some Fun Hacks

// ...

Generate router service with Angular CLI...

## TODO

- Generate TOC with <https://github.com/jonschlinkert/markdown-toc>
- Note about legacy js files
- Upgrade to Angular 7
