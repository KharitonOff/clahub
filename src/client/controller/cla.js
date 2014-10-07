// *****************************************************
// CLA Controller
//
// tmpl: cla.html
// path: /:repoId/:prId
// *****************************************************

module.controller( 'ClaController', ['$window', '$rootScope', '$scope', '$stateParams', '$HUB', '$RPC', '$modal',
    function($window, $rootScope, $scope, $stateParams, $HUB, $RPC, $modal) {

        // get the request
        // $scope.request = request;
        $scope.cla = {text: 'dummy text'};

        function getCLA () {
            $RPC.call('cla', 'get', {
                repo: $stateParams.repoId
            }, function(err, cla) {
                if(!err) {
					$scope.cla.text = cla.value.cla.text;
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
    }
]);
