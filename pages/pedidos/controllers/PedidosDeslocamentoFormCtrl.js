'use strict';

function PedidosDeslocamentoFormCtrl($scope, $state, $stateParams, toaster, $uibModal, Pedido, Prestadora) {

    $scope.pedido = $stateParams.pedido;
    $scope.deslocamento = new Pedido.Deslocamento();
    $scope.prestadorSelected = null;
    $scope.prestadoras = [];

    //$scope.statusPedido = Enums.PEDIDO_STATUS.AGUARDANDO_DESLOCAMENTO.description;
    $scope.statusPedido = Pedido.status(Enums.PEDIDO_STATUS.NOVO._id);

    $scope.showFormPrestador = false;

    if($stateParams.id){
        $scope.isUpdate = true;

        Pedido
            .get($stateParams.id)
            .then(function (pedido) {

                if(!pedido){
                    $state.go('app.pedidos');
                    return;
                }

                $scope.pedido = pedido;
                $scope.deslocamento = $scope.pedido.deslocamento;
                $scope.showFormPrestador = $scope.pedido.status == Enums.PEDIDO_STATUS.LIBERADO._id;
                $scope.statusPedido = Pedido.status(pedido.status);

                buscarPrestadoras();
            });
    }

    function buscarPrestadoras(){
        Prestadora.list().then(function(res){
            $scope.prestadoras = res || [];

            if($scope.pedido.deslocamento.idPrestador){
                $scope.prestadorSelected = res.filter(function(el){
                    return el._id == $scope.pedido.deslocamento.idPrestador;
                })[0];
            }
        });
    }


    $scope.salvarDeslocamento = function(){
        var ped = angular.copy($scope.pedido);
        var prestadorSelected = angular.copy($scope.prestadorSelected);

        if($scope.showFormPrestador){
            ped.status = Enums.PEDIDO_STATUS.LIBERADO._id;

            if ($scope.prestadorSelected){
                ped.deslocamento.idPrestador = prestadorSelected._id;
                ped.deslocamento.nomePrestador = prestadorSelected.nome;
            }

            ped.deslocamento.prestadorHonorarioAcordado = (ped.deslocamento.prestadorHonorarioAcordado || "").replace("R$",'');

        }

        updatePedido(ped, function (res) {
            $state.go('app.pedidos_resumo', { id : ped._id });
        })
    };

    function updatePedido(pedido, callback){
        Pedido.update(pedido)
            .then(callback)
            .catch(function(err){})
    }

    $scope.recusarPedido = function(){
        $scope.showFormPrestador = false;

        var pedido = angular.copy($scope.pedido);

        var dialog = $uibModal.open({
            animation: true,
            templateUrl: 'pedidoModalConfirmRecusa.html',
            controller: 'PedidoDialogRecusaCtrl',
            resolve: { pedido : pedido }
        });
        dialog.result.then(function(){
            didConfirmRecusaPedido(pedido);
        });

    };

    function didConfirmRecusaPedido(pedido){
        pedido.status = Enums.PEDIDO_STATUS.RECUSADO._id;
        updatePedido(pedido, function (res) {
            toaster.pop('success', "Deslocamento Salvo com sucesso!");
            $state.go('app.pedidos');
        });
    }

    $scope.addKm = function(){

        var pedido = angular.copy($scope.pedido);

        var dialog = $uibModal.open({
            animation: true,
            templateUrl: 'pedidoModalAddKm.html',
            controller: 'PedidoModalAddKmCtrl',
            resolve : { pedido : pedido }
        });
        dialog.result.then(function(res){
            pedido.deslocamento.adicionalKm = res.adicionalKm;
            pedido.status = Enums.PEDIDO_STATUS.AGUARDANDO_DESLOCAMENTO._id;
            Pedido.update(pedido).then(function(res){
                toaster.pop('success', "Pedido salvo com sucesso!");
                showDialogEnviarEmailCia(pedido);
            });

        });
    };

    function showDialogEnviarEmailCia(pedido){
        var ped = angular.copy($scope.pedido);
        Pedido.get(ped._id).then(function (pedido) {
            $scope.pedido = pedido;

            var dialogEmailAddKm = $uibModal.open({
                animation: true,
                templateUrl: 'pedidoDialogEnviarEmailAdicionalKm.html',
                controller: 'PedidoDialogEnviarEmailAdicionalKm',
                size : 'lg',
                resolve: {
                    pedido : pedido
                }
            });
            dialogEmailAddKm.result
                .then(function(res){
                    $state.go('app.pedidos');
                })
                .catch(function(res){
                    $state.go('app.pedidos');
                });
        });
    }



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



    function didConfirmDeletePedido(pedido) {
        pedido.status = Enums.PEDIDO_STATUS.PENDENTE._id;
        Pedido.update(pedido)
            .then(function(res){
                toaster.pop('success', res.message);
                $state.go('app.pedidos');
            })
            .catch(function(err){
                console.log(err);
            })
    }

    // function showDialogEnviarEmailCia(pedido){
    //     var confirm = $uibModal.open({
    //         animation: true,
    //         templateUrl: 'pedidoDialogEnviarEmailCia.html',
    //         controller: 'PedidoDialogEnviarEmailCia',
    //         size : 'lg',
    //         resolve: {
    //             pedido : pedido
    //         }
    //     });
    //     confirm.result
    //     .then(function(res){
    //         $state.go('app.pedidos');
    //     })
    //     .catch(function(res){
    //         $state.go('app.pedidos');
    //     });
    // }
}



function PedidoDialogRecusaCtrl($scope, $uibModalInstance, pedido){
    $scope.pedido = pedido;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}


function PedidoModalAddKmCtrl($scope, $uibModalInstance, pedido){

    $scope.pedido = pedido;

    $scope.ok = function () {
        var pedido = angular.copy($scope.pedido);
        $uibModalInstance.close({
            adicionalKm : pedido.deslocamento.adicionalKm
        });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}

function PedidoDialogEnviarEmailAdicionalKm($scope, $uibModalInstance, $window, pedido){
    $scope.pedido = pedido;

    var kmRodado = (parseFloat(pedido.deslocamento.kmPercorrido.toString().replace(',', '.')) - pedido.seguradora.franquia);
    var msg = "SOLICITAMOS DESLOCAMENTO PARA:\n";
    msg += pedido.deslocamento.origem + " x " + pedido.deslocamento.destino + " x " + pedido.deslocamento.retorno;
    msg += " = " + pedido.deslocamento.kmPercorrido + "km - " + pedido.seguradora.franquia + "km";
    msg += "= " + kmRodado + "km";
    msg += " = R$ " + (kmRodado * pedido.seguradora.valorKmRodado + pedido.seguradora.reembolsoFixo).toFixed(2).toString().replace('.',',');


    var kmAdicional = parseFloat(pedido.deslocamento.adicionalKm.toString().replace(',', '.'));
    var addMsg = "SOLICITAÇÃO DE DESLOCAMENTO ADICIONAL: " + pedido.deslocamento.adicionalKm + "km ";
    addMsg += " = R$ " + (kmAdicional * pedido.seguradora.valorKmRodado).toFixed(2).toString().replace('.',',');

    $scope.mensagem = addMsg + "\n" + msg;

    $scope.ok = function () {
        sendEmail(pedido.ramo.emailResponsavel, "SOLICITAÇÃO DE DESLOCAMENTO ADICIONAL", $scope.mensagem);
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    function sendEmail(emailId,subject,message){
        $window.open("mailto:"+ emailId + "?subject=" + subject+"&body="+message,"_self");
    }
}



$app.controller('PedidosDeslocamentoFormCtrl', ['$scope',
        '$state',
        '$stateParams',
        'toaster',
        '$uibModal',
        'Pedido',
        'Prestadora',
    PedidosDeslocamentoFormCtrl])
    .controller('PedidoDialogRecusaCtrl', [
        '$scope',
        '$uibModalInstance',
        'pedido',
        PedidoDialogRecusaCtrl])
    .controller('PedidoModalAddKmCtrl', [
        '$scope',
        '$uibModalInstance',
        'pedido',
        PedidoModalAddKmCtrl])
    .controller('PedidoDialogEnviarEmailAdicionalKm', [
        '$scope',
        '$uibModalInstance',
        '$window',
        'pedido',
        PedidoDialogEnviarEmailAdicionalKm]);
