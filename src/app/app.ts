/// <reference path="../typings/tsd.d.ts" />

import * as angular from 'angular';

var appModule: ng.IModule =  angular
    .module('app', [])
    .config(function () {
        console.log('Configuration phase.');
    });

export default angular;
export { appModule };