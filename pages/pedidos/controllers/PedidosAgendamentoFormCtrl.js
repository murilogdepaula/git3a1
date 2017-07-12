'use strict';

function PedidosAgendamentoFormCtrl($scope, $state, $stateParams, toaster, $uibModal, Pedido) {

    $scope.pedido = null;
    $scope.agendamento = Pedido.Agendamento();
    $scope.statusPedido = Pedido.status(Enums.PEDIDO_STATUS.NOVO._id);

    if($stateParams.id){
        $scope.isUpdate = true;

        Pedido
            .get($stateParams.id)
            .then(function (pedido) {
                $scope.pedido = pedido;
                $scope.agendamento = $scope.pedido.agendamento;
                $scope.statusPedido = Pedido.status(pedido.status);
            });
    }



    $scope.salvarAgendamento = function(pedido){
        var ped = angular.copy(pedido);

        if(ped.agendamento.agendado){
            ped.status = Enums.PEDIDO_STATUS.AGENDADO._id;
        }

        Pedido.update(ped)
            .then(function(res){
                toaster.pop('success', "Agendamento salvo com sucesso!");

                $state.go('app.pedidos_add_deslocamento', { id : res._id });
            })
            .catch(function(err){
                toaster.pop('error', "Erro ao salvar Agendamento!");
                console.log(err);
            });


    };


    $scope.confirmDeletePedido = function(){
        var pedido = angular.copy($scope.pedido);
        var dialog = $uibModal.open({
            animation: true,
            templateUrl: 'pedidoModalConfirmDelete.html',
            controller: 'PedidoDialogDeleteCtrl',
            resolve: {
                pedido : pedido
            }
        });
        dialog.result.then(function(){
            didConfirmDeletePedido(pedido);
        });
    };



    function didConfirmDeletePedido(pedido){
        Pedido.delete(pedido._id)
            .then(function(res){
                toaster.pop('success', res.message);
                $state.go('app.pedidos');
            })
            .catch(function(err){
                console.log(err);
            })
    }

}



$app.controller('PedidosAgendamentoFormCtrl', ['$scope',
        '$state',
        '$stateParams',
        'toaster',
        '$uibModal',
        'Pedido',
    PedidosAgendamentoFormCtrl]);
