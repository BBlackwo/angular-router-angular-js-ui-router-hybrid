import { Routes } from '@angular/router';

export class RouteHelper {
  completeRoutes: Array<string>;

  init(appRoutes: Routes) {
    this.createCompleteRoutes(appRoutes);
  }

  private getChildren(parentPath: string, children: Routes) {
    if (children) {
      children.forEach((child) => {
        if (child.children) {
          const newParentPath = child.path ? `${parentPath}/${child.path}` : parentPath;
          this.getChildren(newParentPath, child.children);
        } else {

          if (!child.path) {
            return this.completeRoutes.push(parentPath);
          }

          this.completeRoutes.push(`${parentPath}/${child.path}`);
        }
      });
    } else {
      this.completeRoutes.push(parentPath);
    }
  }

  /**
   * Creates a flat list of routes based on the
   * defined parent/child routes
   */
  private createCompleteRoutes(appRoutes: Routes): void {
    this.completeRoutes = [];
    appRoutes.forEach((parent) => {
      this.getChildren(parent.path, parent.children);
    });
    this.completeRoutes = this.completeRoutes
      .filter((route) => route !== '**') // remove sink route
      .map((route) => `/${route}`);
  }

  getCompleteRoutes(): Array<string> {
    return this.completeRoutes;
  }

  /**
   * Checks if url is in list of complete routes
   */
  isValidRoute(url: string): boolean {
    if (!this.completeRoutes) {
      throw Error('Must call init() first');
    }

    const isUrlInRoutes = this.completeRoutes.includes(url);
    if (isUrlInRoutes) { return isUrlInRoutes; }

    return this.completeRoutes.reduce((accumulator, route) => {
      return accumulator || this.isParameterisedUrlMatched(url, route);
    }, false);
  }

  /**
   * Determines whether the URL matches a route with parameters.
   * When exact URL matches aren't enough.
   */
  isParameterisedUrlMatched(url, route): boolean {
    /**
     * Generates a regular expression pattern as a string based on the route path.
     * Path segments which are recognised as a parameter are replaced with a pattern
     * which matches any value for that segment.
     *
     * See unit tests for examples :)
     */
    const pattern = route
      .split('/')
      .map((segment) => segment.includes(':') ? `[^\\/]+` : segment)
      .join('\\/');

    const regex = new RegExp(`^${pattern}$`);
    return regex.test(url);
  }
}

export const routeHelper = new RouteHelper();
