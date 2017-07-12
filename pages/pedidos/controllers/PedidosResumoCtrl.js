'use strict';

function PedidosResumoCtrl($scope, $state, $stateParams, $window,  toaster, $uibModal, Pedido, Prestadora) {

    $scope.pedido = $stateParams.pedido;
    // $scope.statusPedido = Enums.PEDIDO_STATUS.AGUARDANDO_DESLOCAMENTO.description;
    $scope.statusPedido = Pedido.status(Enums.PEDIDO_STATUS.NOVO._id);
    $scope.prestadorSelected = null;


    if($stateParams.id){
        $scope.isUpdate = true;

        Pedido
            .get($stateParams.id)
            .then(function (pedido) {

                $scope.pedido = pedido;
                $scope.showFormPrestador = $scope.pedido.status == Enums.PEDIDO_STATUS.LIBERADO._id;
                $scope.statusPedido = Pedido.status(pedido.status);

                buscarPrestador(pedido.deslocamento.idPrestador);
            });

    }

    function buscarPrestador(id){
        Prestadora.list().then(function(docs){
            $scope.prestadoras = docs;
            var selected = docs.filter(function (el) { return el._id == id; })[0];
            $scope.prestadorSelected = selected;
        });
    }


    $scope.enviarAoPrestador = function(){

        var pedido = angular.copy($scope.pedido);
        pedido.prestador = angular.copy($scope.prestadorSelected);

        var confirm = $uibModal.open({
            animation: true,
            templateUrl: 'pedidoDialogEnviarEmailPrestador.html',
            controller: 'PedidoDialogEnviarEmailPrestador',
            size : 'lg',
            resolve: {
                pedido : pedido
            }
        });
        confirm.result
            .then(function(){
                salvarPedido(Enums.PEDIDO_STATUS.ENVIADO_PRESTADOR._id);
            })
            .catch(function(){ });
    };


    $scope.enviarAoAnalista = function(){

        var pedido = angular.copy($scope.pedido);
        pedido.prestador = angular.copy($scope.prestadorSelected);

        var confirm = $uibModal.open({
            animation: true,
            templateUrl: 'pedidoDialogEnviarEmailAnalista.html',
            controller: 'PedidoDialogEnviarEmailAnalista',
            size : 'lg',
            resolve: {
                pedido : pedido
            }
        });
        confirm.result
            .then(function(){ salvarPedido(Enums.PEDIDO_STATUS.VISTORIA_RECEBIDA._id); })
            .catch(function(){ });
    };


    function salvarPedido(statusId){
        var ped = angular.copy($scope.pedido);
        ped.status = statusId;
        ped.prestador = angular.copy($scope.prestadorSelected);
        Pedido.update(ped)
            .then(function(res){
                toaster.pop('success', "Pedido salvo com sucesso!");

                $state.go('app.pedidos_resumo', {
                    id : ped._id
                })

            })
            .catch(function(err){
                toaster.pop('error', "Erro ao salvar Pedido!");
                console.log(err);
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


function PedidoDialogEnviarEmailPrestador($scope, $uibModalInstance, $window, toaster, pedido) {

    $scope.pedido = pedido;

    pedido.item = pedido.item || {};

    var msg  = "Número Pedido: " + pedido.nrPedido;
    msg     += "\nSeguradora: " + pedido.seguradora.nome;
    msg     += "\nRamo: " + pedido.ramo.nome;
    msg     += "\n--------------------------------------------------------------------------------\n";
    msg     += "Proponente: " + pedido.proponente.nome;
    msg     += "\nContato Agendamento: " + pedido.agendamento.contatoNoAgendamento;
    msg     += "\nData Agendamento: " + pedido.agendamento.dataAgendamento;
    msg     += "\nHora Marcada: " + pedido.agendamento.horaMarcada;
    msg     += "\nHorario Comercial: " + (pedido.agendamento.horarioComercial ? 'SIM' : 'NAO');

    msg     += "\nQuem Procurar no Local: " + pedido.agendamento.quemProcurar;
    msg     += "\nTelefone de contato Local agendamento: " + pedido.agendamento.telefoneLocalAgendamento;


    msg     += "\n--------------------------------------------------------------------------------\n";
    msg     += "Local do Risco:";

    if(!pedido.agendamento.paraOMesmo){
        msg += "\nInformações Local de Risco Divergente: " + pedido.agendamento.localRiscoDivergente;
    }else{
        msg += "\nCEP: " + pedido.localrisco.cep;
        msg += "\nLogradouro: " + pedido.localrisco.logradouro;
        msg += "\nBairro: " + pedido.localrisco.bairro;
        msg += "\nCidade: " + pedido.localrisco.cidade;
        msg += "\nUF: " + pedido.localrisco.estado;
        msg += "\nComplemento: " + pedido.localrisco.complemento;
    }

    msg     += "\n--------------------------------------------------------------------------------\n";
    msg     += "Prestador";
    msg     += "\nNome Prestadora: " + pedido.prestador.nome;
    msg     += "\nEmail Prestador: " + pedido.prestador.email;

    msg     += "\n--------------------------------------------------------------------------------\n";
    msg     += "Coberturas:\n";
    msg     += pedido.coberturas;


    $scope.mensagem = msg;


    $scope.ok = function () {
        var email = angular.copy($scope.pedido.prestador.email);

        var message = angular.copy($scope.mensagem);
        message = encodeURIComponent(message);
        $window.open("mailto:"+ email + "?subject=Agendamento"+"&body="+message,"_self");

        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}


function PedidoDialogEnviarEmailAnalista($scope, $uibModalInstance, $window, toaster, pedido) {

    $scope.pedido = pedido;
    $scope.emailAnalista =  "";

    var msg  = "Número Pedido: " + pedido.nrPedido;
    msg     += "\nSeguradora: " + pedido.seguradora.nome;
    msg     += "\nRamo: " + pedido.ramo.nome;
    msg     += "\n--------------------------------------------------------------------------------\n";
    msg     += "Proponente: " + pedido.proponente.nome;
    msg     += "\nContato Agendamento: " + pedido.agendamento.contatoNoAgendamento;
    msg     += "\nData Agendamento: " + pedido.agendamento.dataAgendamento;
    msg     += "\nHora Marcada: " + pedido.agendamento.horaMarcada;
    msg     += "\nHorario Comercial: " + (pedido.agendamento.horarioComercial ? 'SIM' : 'NAO');

    msg     += "\nQuem Procurar no Local: " + pedido.agendamento.quemProcurar;
    msg     += "\nTelefone de contato Local agendamento: " + pedido.agendamento.telefoneLocalAgendamento;


    msg     += "\n--------------------------------------------------------------------------------\n";
    msg     += "Local do Risco:";

    if(!pedido.agendamento.paraOMesmo){
        msg += "\nInformações Local de Risco Divergente: " + pedido.agendamento.localRiscoDivergente;
    }else{
        msg += "\nCEP: " + pedido.localrisco.cep;
        msg += "\nLogradouro: " + pedido.localrisco.logradouro;
        msg += "\nBairro: " + pedido.localrisco.bairro;
        msg += "\nCidade: " + pedido.localrisco.cidade;
        msg += "\nUF: " + pedido.localrisco.estado;
        msg += "\nComplemento: " + pedido.localrisco.complemento;
    }

    msg     += "\n--------------------------------------------------------------------------------\n";
    msg     += "Prestador";
    msg     += "\nNome Prestadora: " + pedido.prestador.nome;
    msg     += "\nEmail Prestador: " + pedido.prestador.email;

    msg     += "\n--------------------------------------------------------------------------------\n";
    msg     += "\nVISTORIA";
    msg     += "\nData: " + pedido.dataVistoria;
    msg     += "\nHora: " + pedido.horaVistoria;

    msg     += "\n--------------------------------------------------------------------------------\n";
    msg     += "Coberturas:\n";
    msg     += pedido.coberturas;

    $scope.mensagem = msg;


    $scope.ok = function () {
        var email = angular.copy($scope.emailAnalista);

        if(email.length == 0){
            toaster.pop('error', "Informe o e-mail do analista!");
            return;
        }

        var message = angular.copy($scope.mensagem);
        message = encodeURIComponent(message);
        $window.open("mailto:"+ email + "?subject=Vistoria"+"&body="+message,"_self");

        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}


$app.controller('PedidosResumoCtrl', ['$scope',
        '$state',
        '$stateParams',
        '$window',
        'toaster',
        '$uibModal',
        'Pedido',
        'Prestadora',
    PedidosResumoCtrl])
    .controller('PedidoDialogEnviarEmailPrestador', ['$scope',
        '$uibModalInstance',
        '$window',
        'toaster',
        'pedido',
        PedidoDialogEnviarEmailPrestador])
    .controller('PedidoDialogEnviarEmailAnalista', ['$scope',
        '$uibModalInstance',
        '$window',
        'toaster',
        'pedido',
        PedidoDialogEnviarEmailAnalista]);
