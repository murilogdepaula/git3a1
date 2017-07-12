'use strict';

function PedidosAnalistaCtrl($scope, $state, $stateParams, $window,  toaster, $uibModal, Pedido, Prestadora) {

    $scope.pedido = $stateParams.pedido;
    $scope.statusPedido = Pedido.status(Enums.PEDIDO_STATUS.NOVO._id);
    $scope.transmissao = {};

    if($stateParams.id){
        $scope.isUpdate = true;

        Pedido
            .get($stateParams.id)
            .then(function (pedido) {

                $scope.pedido = pedido;
                $scope.transmissao = pedido.transmissao;
                $scope.statusPedido = Pedido.status(pedido.status);
            });

    }

    $scope.frustar = function() {
        var pedido = angular.copy($scope.pedido);
        pedido.status = Enums.PEDIDO_STATUS.FRUSTADO._id;
        salvar(pedido);
    };

    $scope.finalizar = function() {
        var pedido = angular.copy($scope.pedido);
        pedido.status = Enums.PEDIDO_STATUS.FINALIZADO._id;
        salvar(pedido);
    };


    function salvar(ped) {

        ped.transmissao = angular.copy($scope.transmissao);

        Pedido.update(ped)
            .then(function(res){
                toaster.pop('success', "Informações salvas com sucesso!");
                $state.go('app.pedidos');
            })
            .catch(function(err){
                toaster.pop('error', "Erro ao salvar Informações!");
                console.log(err);
            });
    }
}



$app.controller('PedidosAnalistaCtrl', ['$scope',
        '$state',
        '$stateParams',
        '$window',
        'toaster',
        '$uibModal',
        'Pedido',
        'Prestadora',
    PedidosAnalistaCtrl]);
