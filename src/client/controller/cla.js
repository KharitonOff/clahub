// *****************************************************
// CLA Controller
//
// tmpl: cla.html
// path: /:repoId/:prId
// *****************************************************

module.controller( 'ClaController', ['$window', '$rootScope', '$scope', '$stateParams', '$HUB', '$RPC', '$modal', '$sce',
    function($window, $rootScope, $scope, $stateParams, $HUB, $RPC, $modal, $sce) {

        $scope.cla = {text: 'dummy text'};

        function getCLA () {
            $RPC.call('cla', 'get', {
                repo: $stateParams.repoId
            }, function(err, cla) {
                if(!err) {
                    $scope.claText = cla.value.raw;
                }
            });
        }

        getCLA();

        $scope.agree = function(){
            $RPC.call('cla', 'sign', {owner: $stateParams.user, repo: $stateParams.repoId}, function(err, data){
                if (!err && data.value) {
                    $window.location.href = data.value;
                }
            });
        };

        $scope.renderHtml = function(html_code)
        {
            return $sce.trustAsHtml(html_code);
        };
    }
]);
