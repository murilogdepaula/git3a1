'use strict';

$app.controller('LoginCtrl', function ($scope, $http, $localStorage,$location, $state, toaster, Auth,  User){

    $scope.user = new User.Model();

    $scope.login = function(){

        var user = angular.copy($scope.user);

        var error = function(message){
            toaster.pop("error", message);
        };

        var success = function(message){
            toaster.pop("success", message);
            $state.go('app.pedidos');
        };

        Auth.login(user)
            .then(function(data){
                if(data._type == false){
                    $scope.user.password = "";
                    error(data.error_message);
                    return;
                }
                $localStorage.currentUser = data;
                
                return success("Usuário Logado!");
            }, function(err){
                console.log(err);
                toaster.pop("error", "Erro de conexão!");
                $scope.user.password = "";
            });

    };
});