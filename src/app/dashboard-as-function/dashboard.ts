import { appModule } from '../app.ts';

appModule
    .controller('DashboardCtrl2', ['$http', '$timeout', function ($http: ng.IHttpService, $timeout: ng.ITimeoutService) {
        this.status = 'Not initialized';
        this.name = 'World #2';

        this.loadConfigJs = () => {
            $http.get('config.js')
                .then(() => this.status = 'Loaded')
                .catch((err) => {
                    this.status = 'Failed';
                    console.error(err);
                });
        };

        $timeout(() => this.name = 'User #2', 4000);
    }]);
