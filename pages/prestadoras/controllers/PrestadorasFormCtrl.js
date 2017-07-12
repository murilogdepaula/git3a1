'use strict';

function PrestadorasFormCtrl($scope, $state, $stateParams, Prestadora, toaster, $uibModal) {

    $scope.isUpdate = false;
    $scope.prestadora = new Prestadora.Model();


    /* Verificar se esta alterando ou criando um novo usuario */
    if($stateParams.id){
        $scope.isUpdate = true;

        Prestadora
            .get($stateParams.id)
            .then(function (doc) {
                $scope.prestadora = doc;
            });
    }



    $scope.salvar = function(){
        console.log($scope.prestadora);

        var item = angular.copy($scope.prestadora);

        var promisse = $scope.isUpdate ? Prestadora.update(item) : Prestadora.create(item);
        promisse
            .then(function () {
                toaster.pop('success', 'Prestadora salva com sucesso!');
                $state.go('app.prestadoras');
            })
            .catch(function(){
               toaster.pop('error', 'Ocorreu um erro ao tentar salvar prestadora, tente novamente!');
            });
    };

}


$app
    .controller('PrestadorasFormCtrl', ['$scope',
        '$state',
        '$stateParams',
        'Prestadora',
        'toaster',
        '$uibModal',
        PrestadorasFormCtrl]);
