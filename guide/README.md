# Guide - Angular Router and AngularJs UI Router Hybrid

Have a read through the official [Angular Upgrade Docs](https://angular.io/guide/upgrade) first to get a good grasp on how Angular Upgrade works.

At the end of this guide you should be able to set up a hybrid Angular 6+ and AngularJs (Angular 1.x) app with Angular Router and AngularJs UI-Router working nicely together.

Each part has an accociated commit in this repo. See [repo commits](https://github.com/BBlackwo/angular-router-angular-js-ui-router-hybrid/commits/master).

A note on naming: as per the [Branding Guidelines for Angular and AngularJS](https://blog.angularjs.org/2017/01/branding-guidelines-for-angular-and.html) when referring to Angular 1.x we say "AngularJs" and Angular 2+ is referred to as Angular.

## [Background](./background.md)

## [Part 1: Set Up Angular and AngularJs Hybrid App](./part-1.md)

## [Part 2: Add UI Router With Config](./part-2.md)

## [Part 3: Add Angular Router With Config](./part-3.md)

## [Part 4: Hacks To Get Hybrid Routing Working](./part-4.md)

## [Conclusion](./conclusion.md)

## [Appendix 1: Angular CLI doesn't transpile js files](./appendix-1.md)

## TODO

- Upgrade to Ng 7 will also fix webpack-dev-server vulnerability
- Lazy loading route modules?
- Comment on http://www.syntaxsuccess.com/viewarticle/ngupgrade-with-the-angular-router-and-ui-router
- Duplicate base path? Might not be an issue anymore that was fixed in the latest setUpLocationSync. Or might need to ignore the base path when redirecting.
