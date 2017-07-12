'use strict';

function SeguradorasCtrl($scope, $state, Seguradora, toaster, $uibModal) {

    $scope.seguradoras = [];

    Seguradora.list().then(function(seguradoras){
        $scope.seguradoras = seguradoras || [];
    });


    $scope.confirmDeleteSeguradora = function(seguradora){
        var dialog = $uibModal.open({
            animation: true,
            templateUrl: 'seguradoraModalConfirmDelete.html',
            controller: 'SeguradorasDialogDeleteCtrl',
            resolve: {
                seguradora : seguradora
            }
        });
        dialog.result.then(function(){
            deleteSeguradora(seguradora);
        });
    };


    function deleteSeguradora(seguradora){
        var index = $scope.seguradoras.indexOf(seguradora);
        if(index > -1){
            Seguradora
                .delete(seguradora._id)
                .then(function(){
                    $scope.seguradoras.splice(index, 1);
                    toaster.pop('success', "Seguradora removida com sucesso!");
                })
                .catch(function(){
                   toaster.pop('error', 'Erro ao remover Seguradora!');
                });
        }
    }

}


function SeguradorasDialogDeleteCtrl($scope, $uibModalInstance, seguradora){
    $scope.seguradora = seguradora;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

$app
    .controller('SeguradorasCtrl', [
        '$scope',
        '$state',
        'Seguradora',
        'toaster',
        '$uibModal',
        SeguradorasCtrl])
    .controller('SeguradorasDialogDeleteCtrl', [
        '$scope',
        '$uibModalInstance',
        'seguradora',
        SeguradorasDialogDeleteCtrl]);
