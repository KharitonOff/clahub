// repo test
describe('CLA Controller', function() {

    var scope, rootScope, stateParams, httpBackend, createCtrl, claController;

    beforeEach(angular.mock.module('app'));
    beforeEach(angular.mock.module('templates'));

    beforeEach(angular.mock.inject(function($injector, $rootScope, $controller) {

        httpBackend = $injector.get('$httpBackend');

        httpBackend.when('GET', '/config').respond({

        });

        scope = $rootScope.$new();
        rootScope = $rootScope;
        stateParams = {user:'login', repoId:1234};

        createCtrl = function() {

            var ctrl =  $controller('ClaController', {
                $scope: scope,
                $stateParams: stateParams
            });
            ctrl.scope = scope;
            return ctrl;
        };

    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    it('should get CLA text', function() {
        scope.user = null;
        claController = createCtrl();

        httpBackend.expect('POST','/api/cla/get','{"repo":' + stateParams.repoId + '}').respond({raw:'<p>cla text</p>'});
        httpBackend.flush();

        (claController.scope.claText).should.be.ok;
    });

    it('should check whether user has signed CLA allready or not', function(){
        rootScope.user = {id:123, login:'login'};
        claController = createCtrl();

        httpBackend.expect('POST','/api/cla/check','{"repo":' + stateParams.repoId + '}').respond(true);
        httpBackend.expect('POST','/api/cla/get','{"repo":' + stateParams.repoId + '}').respond({raw:'<p>cla text</p>'});
        httpBackend.flush();

        (claController.scope.signed).should.be.ok;

    });
});
