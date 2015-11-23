import mocks from '../test.ts';
import DashboardCtrl from './dashboard.ctrl.ts';

describe('dashboard-as-class module', () => {
    beforeEach(mocks.module('app'));

    describe('dashboard-as-class controller', () => {

        it('should contain load function', mocks.inject(($controller: ng.IControllerService) => {
            let ctrl = <DashboardCtrl> $controller('DashboardCtrl');

            expect(ctrl.loadConfigJs).toBeDefined();
            expect(typeof ctrl.loadConfigJs).toBe('function');
        }));
    });
});