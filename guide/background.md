# Background

At [RateMyAgent](https://www.ratemyagent.com.au/) we have been incrementally upgrading our AngularJs apps to Angular. One of the biggest challenges we hit was hybrid routing. The apps were too big to re-write all the Routing in Angular in one go. We could have used [UI Router > Angular Hybrid](https://github.com/ui-router/angular-hybrid) but we wanted to move away from the 3rd party ui router and use the 1st party UI Router.

There were various guides we looked at to help, but most didn't suite our needs exactly. There was [NgUpgrade With The Angular Router And Ui-Router](http://www.syntaxsuccess.com/viewarticle/ngupgrade-with-the-angular-router-and-ui-router) but it was using an older version of Angular so didn't work exacly. It was a big help though.

So piecing together the various guides, we set up our hybrid routing and ironed out all the bugs on the way.

## Let's get into it

[Part 1: Set Up Angular and AngularJs Hybrid App](./part-1.md)

## Further Reading

[ngMigration-Forum > Routing](https://github.com/angular/ngMigration-Forum/wiki/Routing)
