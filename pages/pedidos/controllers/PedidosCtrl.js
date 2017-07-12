'use strict';

function PedidosCtrl($scope, $state, Pedido, toaster, $uibModal) {

    $scope.pedidos = [];

    Pedido.list().then(function(pedidos){
        var peds = pedidos || [];

        for (var i in peds){
            peds[i].status = Pedido.status(peds[i].status);
            // switch(peds[i].status){
            //     case 1 :
            //         peds[i].status = Enums.PEDIDO_STATUS.AGUARDANDO_DESLOCAMENTO;
            //         peds[i].status.style = 'label-info';
            //         break;
            //     case 2 :
            //         peds[i].status = Enums.PEDIDO_STATUS.LIBERADO;
            //         peds[i].status.style = 'label-success';
            //         break;
            //     case 3 :
            //         peds[i].status = Enums.PEDIDO_STATUS.RECUSADO;
            //         peds[i].status.style = 'label-danger';
            //         break;
            //     case 3 :
            //         peds[i].status = Enums.PEDIDO_STATUS.RECUSADO;
            //         peds[i].status.style = 'label-danger';
            //         break;
            // }
        }

        $scope.pedidos = pedidos || [];

    });

    $scope.confirmDeletePedido = function(pedido){
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
                $state.reload();
            })
            .catch(function(err){
                console.log(err);
            })
    }

}




function PedidoDialogDeleteCtrl($scope, $uibModalInstance, pedido){
    $scope.pedido = pedido;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

$app
    .controller('PedidosCtrl', ['$scope', '$state', 'Pedido', 'toaster', '$uibModal', PedidosCtrl])
    .controller('PedidoDialogDeleteCtrl', [
        '$scope',
        '$uibModalInstance',
        'pedido',
        PedidoDialogDeleteCtrl]);
