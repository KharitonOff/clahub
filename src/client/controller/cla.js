// *****************************************************
// CLA Controller
//
// tmpl: cla.html
// path: /:repoId/:prId
// *****************************************************

module.controller( 'ClaController', ['$rootScope', '$scope', '$stateParams', '$HUB', '$RPC', '$modal',
    function($rootScope, $scope, $stateParams, $HUB, $RPC, $modal) {

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
            $RPC.call('cla', 'sign', {repo: $stateParams.repoId}, function(err, data){
                if (!err) {

                }
            });
        };
    }
]);
