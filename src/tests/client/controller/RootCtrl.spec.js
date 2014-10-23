describe('Root Controller', function() {

    var scope, rootScope, httpBackend, createCtrl;

    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {

        httpBackend = $injector.get('$httpBackend');

        scope = $rootScope.$new();
        rootScope = $rootScope;

        createCtrl = function() {

            var ctrl =  $controller('RootCtrl', {
                $scope: scope
            });
            ctrl.scope = scope;
            return ctrl;
        };

    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should get user', function() {
        var rootCtrl = createCtrl();

        httpBackend.expect('POST','/api/github/call', { obj: 'user', fun: 'get', arg: {} }).respond({data:{login:'login'}});
        httpBackend.flush();

        (rootCtrl.scope.user).should.be.ok;
        (rootScope.user.value.login).should.be.equal('login');
    });
});
