// *****************************************************
// CLA Controller
//
// tmpl: cla.html
// path: /:repoId/:prId
// *****************************************************

module.controller( 'ClaController', ['$window', '$rootScope', '$scope', '$stateParams', '$RAW', '$RPC', '$modal', '$sce',
    function($window, $rootScope, $scope, $stateParams, $RAW, $RPC, $modal, $sce) {

        $scope.cla = {text: 'dummy text'};
        $scope.signed = false;

        function getCLA () {
            $RPC.call('cla', 'get', {
                repo: $stateParams.repoId
            }, function(err, cla) {
                if(!err) {
                    $scope.claText = cla.value.raw;
                }
            });
        }

        function checkCLA() {
            $RPC.call('cla', 'check', {
                repo: $stateParams.repoId
            }, function(err, signed){
                if (!err && signed) {
                    $scope.signed = true;
                }
            });
        }

        if ($rootScope.user) {
            checkCLA();
        }
        getCLA();

        $scope.agree = function(){
            $window.location.href = '/accept/' + $stateParams.user + '/' + $stateParams.repoId;
            // $RAW.post('/accept', {owner: $stateParams.user, repo: $stateParams.repoId}, function(err, data, status){
            //     if (status === 401) {
            //         $window.location.href = '/login';
            //     }
            //     else if (!err && data) {
            //         $scope.signed = true;
            //         $scope.redirect = data;
            //     }
            // });
            // $RAW.get('/accept/' + $stateParams.user + '/' + $stateParams.repoId, function(err, data, status){
            //     if (status === 401) {
            //         $window.location.href = '/login';
            //     }
            //     else if (!err && data) {
            //         $scope.signed = true;
            //         $scope.redirect = data;
            //     }
            // });
        };

        $scope.renderHtml = function(html_code)
        {
            return $sce.trustAsHtml(html_code);
        };
    }
]);
