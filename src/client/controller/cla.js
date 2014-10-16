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
                if (!err && signed.value) {
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
        };

        $scope.renderHtml = function(html_code)
        {
            return $sce.trustAsHtml(html_code);
        };
    }
]);
