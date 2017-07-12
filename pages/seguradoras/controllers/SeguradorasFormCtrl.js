'use strict';

function SeguradorasFormCtrl($scope, $state, $stateParams, Seguradora, toaster, $uibModal) {

    $scope.isUpdate = false;
    $scope.seguradora = new Seguradora.Model();


    /* Verificar se esta alterando ou criando um novo usuario */
    if($stateParams.id){
        $scope.isUpdate = true;

        Seguradora
            .get($stateParams.id)
            .then(function (seguradora) {
                seguradora.franquia = seguradora.franquia.toFixed(2).toString().replace('.',',');
                seguradora.reembolsoFixo = seguradora.reembolsoFixo.toFixed(2).toString().replace('.',',');
                seguradora.valorKmRodado = seguradora.valorKmRodado.toFixed(2).toString().replace('.',',');

                for(var rm in seguradora.ramos){
                    seguradora.ramos[rm].frustado = seguradora.ramos[rm].frustado.toFixed(2).toString().replace('.',',');
                    seguradora.ramos[rm].kmSemAutorizacaoPrevia = seguradora.ramos[rm].kmSemAutorizacaoPrevia.toFixed(2).toString().replace('.',',');
                }

                $scope.seguradora = seguradora;
            });
    }

    $scope.showDialogAddRamo = function(){
        var dialog = $uibModal.open({
            animation: true,
            templateUrl: 'seguradoraDialogAddRamo.html',
            controller: 'SeguradorasDialogAddRamoCtrl',
            resolve: {
                ramo : null
            }
        });
        dialog.result.then(function(ramo){
            console.log(ramo);
            $scope.seguradora.ramos.push(ramo);
        });
    };


    $scope.salvar = function(){
        console.log($scope.seguradora);
        var item = angular.copy($scope.seguradora);

        var promisse = $scope.isUpdate ? Seguradora.update(item) : Seguradora.create(item);
        promisse
            .then(function () {
                toaster.pop('success', 'Seguradora salva com sucesso!');
                $state.go('app.seguradoras');
            })
            .catch(function(){
               toaster.pop('error', 'Ocorreu um erro ao tentar salvar seguradora, tente novamente!');
            });
    };

    $scope.viewRamo = function(item){
        var dialog = $uibModal.open({
            animation: true,
            templateUrl: 'seguradoraDialogAddRamo.html',
            controller: 'SeguradorasDialogAddRamoCtrl',
            resolve: {
                ramo : item
            }
        });
        dialog.result.then(function(ramo){
            item = ramo;
        });
    };

    $scope.confirmDeleteRamo = function (item) {
        var dialog = $uibModal.open({
            animation: true,
            templateUrl: 'seguradoraDialogConfirmDelRamo.html',
            controller: 'SeguradorasDialogConfirmDelRamoCtrl',
            resolve: {
                ramo : item
            }
        });
        dialog.result.then(function(){
            deleteRamo(item);
        });
    };

    function deleteRamo(item){

        var didDeletedRamo = function () {
            var index = $scope.seguradora.ramos.indexOf(item);
            if(index > -1){
                $scope.seguradora.ramos.splice(index, 1);
            }
        };

        if (item._id != undefined) {
            Seguradora.removeRamo(item._id, $scope.seguradora._id)
                .then(didDeletedRamo)
                .catch(function (err) {
                    console.log(err);
                });
        }else{
            didDeletedRamo();
        }

    }

}


function SeguradorasDialogAddRamoCtrl($scope, $timeout, $uibModalInstance, Seguradora, ramo) {

    $scope.addItem = false;
    $scope.novoItem = {
        descricao : '',
        valor : 0
    };

    $scope.ramo = ramo || new Seguradora.Ramo();

    // Lifecycler
    //====================================
    $scope.ok = function () {
        var item = angular.copy($scope.ramo);
        $uibModalInstance.close(item);
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    // Form Add
    //====================================
    $scope.cancelarAddItem = function () {
        $scope.addItem = false;
        limparCamposNovoItem();
    };

    $scope.salvarItem = function(){
        $scope.addItem = false;
        var i = angular.copy($scope.novoItem);
        $scope.ramo.items.push(i);

        $timeout(function(){
            $scope.$apply();
        });
        limparCamposNovoItem();
    };


    function limparCamposNovoItem(){
        $scope.novoItem = {
            descricao: '',
            valor : 0
        };
    }

    // List methods
    //====================================
    $scope.deleteItem = function (item){
        var index = $scope.ramo.items.indexOf(item);
        if(index > -1){
            $scope.ramo.items.splice(index, 1);
            //TODO: remove da API
        }
    };


}


function SeguradorasDialogConfirmDelRamoCtrl($scope, $uibModalInstance, ramo){

    $scope.ramo = ramo;

    // Lifecycler
    //====================================
    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

$app
    .controller('SeguradorasFormCtrl', ['$scope',
        '$state',
        '$stateParams',
        'Seguradora',
        'toaster',
        '$uibModal',
        SeguradorasFormCtrl])
    .controller('SeguradorasDialogAddRamoCtrl', ['$scope',
        '$timeout',
        '$uibModalInstance',
        'Seguradora',
        'ramo',
        SeguradorasDialogAddRamoCtrl])
    .controller('SeguradorasDialogConfirmDelRamoCtrl', ['$scope',
        '$uibModalInstance',
        'ramo',
        SeguradorasDialogConfirmDelRamoCtrl]);
