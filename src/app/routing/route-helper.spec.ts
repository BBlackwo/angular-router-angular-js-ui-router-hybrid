import { routeHelper } from './route-helper';
import { Routes } from '@angular/router';

describe('routeHelper', () => {

  describe('init / createCompleteRoutes / getCompleteRoutes', () => {
    describe('with 2 routes plus 3 children each', () => {
      it('should return 6 routes', () => {
        const TwoRoutesWithChildren: Routes = [
          {
            path: 'parent1',
            children: [
              { path: 'child1' },
              { path: 'child2' },
              { path: 'child3' }
            ]
          },
          {
            path: 'parent2',
            children: [
              { path: 'child1.1' },
              { path: 'child2.1' },
              { path: 'child3.1' }
            ]
          }
        ];
        routeHelper.init(TwoRoutesWithChildren);

        const routes = routeHelper.getCompleteRoutes();

        expect(routes.length).toBe(6);
        expect(routes[0]).toBe('/parent1/child1');
        expect(routes[1]).toBe('/parent1/child2');
        expect(routes[2]).toBe('/parent1/child3');
        expect(routes[3]).toBe('/parent2/child1.1');
        expect(routes[4]).toBe('/parent2/child2.1');
        expect(routes[5]).toBe('/parent2/child3.1');
      });
    });

    describe('with 2 routes plus 0 children each', () => {
      it('should return 2 routes', () => {
        const TwoRoutesWithNoChildren: Routes = [
          { path: 'parent1' },
          { path: 'parent2' }
        ];
        routeHelper.init(TwoRoutesWithNoChildren);

        const routes = routeHelper.getCompleteRoutes();

        expect(routes.length).toBe(2);
        expect(routes[0]).toBe('/parent1');
        expect(routes[1]).toBe('/parent2');
      });
    });

    describe('with 1 route plus no children', () => {
      it('should return 1 routes', () => {
        const oneRouteWithNoChildren: Routes = [
          { path: 'parent1' }
        ];
        routeHelper.init(oneRouteWithNoChildren);

        const routes = routeHelper.getCompleteRoutes();

        expect(routes.length).toBe(1);
        expect(routes[0]).toBe('/parent1');
      });
    });

    describe('with 1 route plus 2 children', () => {
      it('should return 2 routes', () => {
        const oneRouteWith2Children: Routes = [
          {
            path: 'parent1',
            children: [
              { path: 'child1.1' },
              { path: 'child2.1' }
            ]
          }
        ];
        routeHelper.init(oneRouteWith2Children);

        const routes = routeHelper.getCompleteRoutes();

        expect(routes.length).toBe(2);
        expect(routes[0]).toBe('/parent1/child1.1');
        expect(routes[1]).toBe('/parent1/child2.1');
      });
    });

    describe('with 1 route plus 2 children and grandchild', () => {
      it('should return 2 routes', () => {
        const oneRouteWith2ChildrenAnd1Grandchild: Routes = [
          {
            path: 'parent1',
            children: [
              {
                path: 'child1.1',
                children: [
                  { path: 'grandchild1.1.1' }
                ]
              },
              { path: 'child2.1' }
            ]
          }
        ];
        routeHelper.init(oneRouteWith2ChildrenAnd1Grandchild);

        const routes = routeHelper.getCompleteRoutes();

        expect(routes.length).toBe(2);
        expect(routes[0]).toBe('/parent1/child1.1/grandchild1.1.1');
        expect(routes[1]).toBe('/parent1/child2.1');
      });
    });

    describe('with 1 route plus 2 children (1 with empty path) and grandchild', () => {
      it('should return 2 routes', () => {
        const oneRouteWith2ChildrenAnd1Grandchild: Routes = [
          {
            path: 'parent1',
            children: [
              {
                path: '',
                children: [
                  { path: 'grandchild1.1.1' }
                ]
              },
              { path: 'child2.1' }
            ]
          }
        ];
        routeHelper.init(oneRouteWith2ChildrenAnd1Grandchild);

        const routes = routeHelper.getCompleteRoutes();

        expect(routes.length).toBe(2);
        expect(routes[0]).toBe('/parent1/grandchild1.1.1');
        expect(routes[1]).toBe('/parent1/child2.1');
      });
    });


    describe('with 1 route plus child, grandchild and greatgrandchild', () => {
      it('should return 1 routes', () => {
        const oneRouteWithChildGrandchildAndGreatGrandchild: Routes = [
          {
            path: 'parent1',
            children: [
              {
                path: 'child1.1',
                children: [
                  {
                    path: 'grandchild1.1.1',
                    children: [
                      { path: 'greatgrandchild1.1.1.1' }
                    ]
                  }
                ]
              }
            ]
          }
        ];
        routeHelper.init(oneRouteWithChildGrandchildAndGreatGrandchild);

        const routes = routeHelper.getCompleteRoutes();

        expect(routes.length).toBe(1);
        expect(routes[0]).toBe('/parent1/child1.1/grandchild1.1.1/greatgrandchild1.1.1.1');
      });
    });

    describe(`with no 'path' in children `, () => {
      it('should add no trailing slash in the route', () => {
        const routeWithNoPath: Routes = [
          {
            path: 'root',
            children: [
              {
                path: '',
                redirectTo: 'MEOW'
              }
            ]
          }
        ];
        routeHelper.init(routeWithNoPath);

        const routes = routeHelper.getCompleteRoutes();

        expect(routes.length).toBe(1);
        expect(routes[0]).toBe('/root');
      });
    });
  });


  describe('isValidRoute', () => {
    const routes = [
      '/agent/promotions/about',
      '/agent/promotions/manage',
      '/agent/promotions/manage/campaigns/:campaignId',
      '/agent/promotions/manage/campaigns/:campaignId/add',
      '/agent/promotions/manage/campaigns/:campaignId/add/:nested',
    ];

    it('should throw error if not initialised', () => {
      expect(routeHelper.isValidRoute).toThrowError();
    });

    describe('with exact URL', () => {
      beforeEach(() => {
        routeHelper.completeRoutes = routes;
      });

      it('should process the URL when it matches a route', () => {
        const url = '/agent/promotions/manage';

        const result = routeHelper.isValidRoute(url);

        expect(result).toBe(true);
      });

      it('should process not process the URL when it does not match a route', () => {
        const url = '/agent/promotions/manage/invalid/example';

        const result = routeHelper.isValidRoute(url);

        expect(result).toBe(false);
      });
    });

    describe('with parameterised URL', () => {
      beforeEach(() => {
        routeHelper.completeRoutes = routes;
      });

      it('should process the URL when it matches a route', () => {
        const url = '/agent/promotions/manage/campaigns/1234/add';

        const result = routeHelper.isValidRoute(url);

        expect(result).toBe(true);
      });

      it('should process the URL when it has multiple parameters', () => {
        const url = '/agent/promotions/manage/campaigns/1234/add/cool-param';

        const result = routeHelper.isValidRoute(url);

        expect(result).toBe(true);
      });

      it('should process not process the URL when it does not match a route', () => {
        const url = '/agent/promotions/1234/add';

        const result = routeHelper.isValidRoute(url);

        expect(result).toBe(false);
      });
    });
  });

  describe('isParameterisedUrlMatched', () => {
    it('should return true if parameterised URL matches route', () => {
      const url = '/agent/promotions/manage/campaigns/1234/add';
      const route = '/agent/promotions/manage/campaigns/:campaignId/add';

      const result = routeHelper.isParameterisedUrlMatched(url, route);

      expect(result).toBe(true);
    });

    it('should return false if parameterised URL does not match route', () => {
      const url = '/agent/promotions/manage/campaigns/1234';
      const route = '/agent/promotions/manage/campaigns/:campaignId/add';

      const result = routeHelper.isParameterisedUrlMatched(url, route);

      expect(result).toBe(false);
    });
  });
});
