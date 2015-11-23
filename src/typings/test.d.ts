/// <reference path="./tsd.d.ts" />

/**
 * Hack for TypeScript definition types.
 * Default behavior of 'angularjs/angular-mocks.d.ts' only allows to write:
 * a) import 'angular-mocks';
 * and following code:
 * b) import * as mocks from 'angular-mocks';
 * doesn't work and raises errors in TypeScript even though it is properly transpiled to JS and works.
 *
 * Below hack allows use example b) for imports.
 */
declare module 'angular-mocks' {
    let mock = angular.mock;

    export = mock;
}