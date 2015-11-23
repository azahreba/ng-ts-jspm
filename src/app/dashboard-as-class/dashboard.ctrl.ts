import '../app.ts';

export default class DashboardCtrl {
    public static $inject = ['$http', '$timeout'];

    public status: string = 'Not initialized';
    public name: string = 'World';

    constructor(private $http: ng.IHttpService, $timeout: ng.ITimeoutService) {
        $timeout(() => this.name = 'User', 5000);
    }

    loadConfigJs() {
        this.$http.get('config.js')
            .then(() => this.status = 'Loaded')
            .catch((err) => {
                this.status = 'Failed';
                console.error(err);
            });
    }
}
