import angular from './app.ts'
import './dashboard-as-class/dashboard.ts';
import './dashboard-as-function/dashboard.ts';

angular.element(document).ready(() => {
    angular.bootstrap(document, [
        'app'
    ]);
});