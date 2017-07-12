'use strict';

function PedidosFormCtrl($scope,$state, $stateParams, toaster, $uibModal, Pedido, Seguradora) {

    $scope.pedido = new Pedido.Model();
    $scope.isUpdate = false;

    $scope.seguradoraSelected = null;
    $scope.ramoSelected = null;
    $scope.seguradoras = [];

    $scope.statusPedido = Pedido.status(Enums.PEDIDO_STATUS.NOVO._id);

    Seguradora.list().then(function(segs){
        $scope.seguradoras = segs || [];
    });


    $scope.$watch('pedido.dataRecebimento', function() {
        if(!$scope.pedido.dataRecebimento) return;

        var pad = function pad(d) {
            return (d < 10) ? '0' + d.toString() : d.toString();
        };

        var d = $scope.pedido.dataRecebimento.split("/");
        var data = new Date([d[1], d[0], d[2]].join("/"));
        var dataDevolucao = new Date(moment(data).add(2, 'days'));

        if(dataDevolucao.getDay() == 1){
            dataDevolucao = new Date(moment(dataDevolucao).add(1, 'days'));
        } else if(dataDevolucao.getDay() == 6){ //sabado soma mais quatro pra cair na terca
            dataDevolucao = new Date(moment(dataDevolucao).add(2, 'days'));
        } else if(dataDevolucao.getDay() == 0){ //domingo soma mais um pra cair na segunda
            dataDevolucao = new Date(moment(dataDevolucao).add(2, 'days'));
        }

        var dd = dataDevolucao.getDate();
        var mm = dataDevolucao.getMonth() + 1;
        var y = dataDevolucao.getFullYear();

        $scope.pedido.dataDevolucao = [pad(dd), pad(mm), y].join("/");
        console.log($scope.pedido.dataDevolucao);
    });

    if($stateParams.id){
        $scope.isUpdate = true;

        Pedido
            .get($stateParams.id)
            .then(function (pedido) {
                $scope.pedido = pedido;
                $scope.seguradoraSelected = $scope.pedido.seguradora;
                $scope.ramoSelected = $scope.pedido.ramo;
                $scope.statusPedido = Pedido.status(pedido.status);
            });
    }

    $scope.salvarPedido = function(p){
        var pedido = angular.copy(p);

        pedido.ramo = angular.copy($scope.ramoSelected);
        pedido.seguradora = angular.copy($scope.seguradoraSelected);
        console.log(pedido);


        if(pedido._id){
            Pedido.update(pedido).then(function(res){
                toaster.pop('success', "Pedido salvo com sucesso!");
                if (pedido.status == Enums.PEDIDO_STATUS.LIBERADO._id){
                    $state.go('app.pedidos_add_agendamento', { id : pedido._id });
                }
            });
        }else{
            pedido.status = Enums.PEDIDO_STATUS.NOVO._id;
            Pedido.create(pedido).then(function(res){
                toaster.pop('success', "Pedido salvo com sucesso!");
                abrirPopupDeslocamentoSimNao(pedido, function(ped){
                    showDialogEnviarEmailCia(pedido);
                });
            });
        }
    };

    function showDialogEnviarEmailCia(pedido){
        var confirm = $uibModal.open({
            animation: true,
            templateUrl: 'pedidoDialogEnviarEmailCia.html',
            controller: 'PedidoDialogEnviarEmailCia',
            size : 'lg',
            resolve: {
                pedido : pedido
            }
        });
        confirm.result
            .then(function(res){
                $state.go('app.pedidos');
            })
            .catch(function(res){
                $state.go('app.pedidos');
            });
    }

    function abrirPopupDeslocamentoSimNao(pedido, callback){
        var confirm = $uibModal.open({
            animation: true,
            templateUrl: 'pedidoDialogDeslocamentoSimNao.html',
            controller: 'PedidoDialogDeslocamentoSimNao',
            resolve: {
                pedido : pedido
            }
        });
        confirm.result
            .then(function(res){
                var kmRamo = pedido.ramo.kmSemAutorizacaoPrevia;
                var kmSolicitar = parseFloat(res.solicitacao.kmPercorrido.replace(',','.'));

                pedido.deslocamento = res.solicitacao;

                pedido.status = kmSolicitar > kmRamo
                    ? Enums.PEDIDO_STATUS.AGUARDANDO_DESLOCAMENTO
                    : Enums.PEDIDO_STATUS.LIBERADO;

                callback(pedido);

            })
            .catch(function(res){
                pedido.status = Enums.PEDIDO_STATUS.LIBERADO;
                callback(pedido);
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


function PedidoDialogDeslocamentoSimNao($scope, $uibModalInstance, pedido) {

    $scope.pedido = pedido;
    $scope.solicitacao = {
        outrasDespesas : 0,
        origem : "",
        destino : "",
        retorno : "",
        kmPercorrido : 0
    };

    $scope.ok = function () {
        $uibModalInstance.close({ solicitacao : angular.copy($scope.solicitacao) });
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}


function PedidoDialogEnviarEmailCia($scope, $uibModalInstance, $window, pedido){
    $scope.pedido = pedido;

    var kmRodado = (parseFloat(pedido.deslocamento.kmPercorrido.replace(',', '.')).toFixed(2) - pedido.seguradora.franquia);
    var valTotal = kmRodado * pedido.seguradora.valorKmRodado + pedido.seguradora.reembolsoFixo;
    var msg = "SOLICITAMOS DESLOCAMENTO PARA:\n";
    msg += pedido.deslocamento.origem + " x " + pedido.deslocamento.destino + " x " + pedido.deslocamento.retorno;
    msg += " = " + pedido.deslocamento.kmPercorrido + "km - " + pedido.seguradora.franquia + "km";
    msg += "= " + kmRodado + "km x " + pedido.seguradora.valorKmRodado.toFixed(2).toString().replace('.',',');
    msg += " = R$ " + (kmRodado * pedido.seguradora.valorKmRodado).toFixed(2).toString().replace('.',',') + " + " + pedido.seguradora.reembolsoFixo.toFixed(2).toString().replace('.',',');
    msg += " = R$ " + valTotal.toFixed(2).toString().replace('.',',');

    $scope.mensagem = msg;

    $scope.ok = function () {
        sendEmail(pedido.ramo.emailResponsavel, "SOLICITAÇÃO DE DESLOCAMENTO", $scope.mensagem);
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };

    function sendEmail(emailId,subject,message){
        $window.open("mailto:"+ emailId + "?subject=" + subject+"&body="+message,"_self");
    }
}


$app
    .controller('PedidosFormCtrl', ['$scope',
        '$state',
        '$stateParams',
        'toaster',
        '$uibModal',
        'Pedido',
        'Seguradora',
        PedidosFormCtrl])
    .controller('PedidoDialogDeslocamentoSimNao', ['$scope', '$uibModalInstance', 'pedido', PedidoDialogDeslocamentoSimNao])
    .controller('PedidoDialogEnviarEmailCia', ['$scope', '$uibModalInstance', '$window', 'pedido', PedidoDialogEnviarEmailCia]);
