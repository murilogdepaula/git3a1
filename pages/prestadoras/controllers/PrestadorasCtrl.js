'use strict';

function PrestadorasCtrl($scope, $state, Prestadora, toaster, $uibModal) {

    $scope.prestadoras = [];

    Prestadora.list().then(function(docs){
        $scope.prestadoras = docs || [];
    });


    $scope.confirmDeletePrestadora = function(prestadora){
        var dialog = $uibModal.open({
            animation: true,
            templateUrl: 'prestadoraModalConfirmDelete.html',
            controller: 'PrestadorasDialogDeleteCtrl',
            resolve: {
                prestadora : prestadora
            }
        });
        dialog.result.then(function(){
            deletePrestadora(prestadora);
        });
    };


    function deletePrestadora(prestadora){
        var index = $scope.prestadoras.indexOf(prestadora);
        if(index > -1){
            Prestadora
                .delete(prestadora._id)
                .then(function(){
                    $scope.prestadoras.splice(index, 1);
                    toaster.pop('success', "Prestadora removida com sucesso!");
                })
                .catch(function(){
                   toaster.pop('error', 'Erro ao remover Prestadora!');
                });
        }
    }

}


function PrestadorasDialogDeleteCtrl($scope, $uibModalInstance, prestadora){
    $scope.prestadora = prestadora;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

$app
    .controller('PrestadorasCtrl', [
        '$scope',
        '$state',
        'Prestadora',
        'toaster',
        '$uibModal',
        PrestadorasCtrl])
    .controller('PrestadorasDialogDeleteCtrl', [
        '$scope',
        '$uibModalInstance',
        'prestadora',
        PrestadorasDialogDeleteCtrl]);
