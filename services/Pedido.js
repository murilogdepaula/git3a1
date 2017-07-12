"use strict";

$app.factory('Pedido',['Api', function (Api) {

    /**
     * Modelo da entidade Pedido
     * @constructor
     */
    var Model = function Model(){
        this.ramo = null;
        this.seguradora = null;
        this.status = Enums.PEDIDO_STATUS;
        this.nrPedido = "";
        this.proponente = null;
        this.agendamento = new Agendamento();
        this.deslocamento = new Deslocamento();
    };


    var Agendamento = function Agendamento(){
        this.paraOMesmo = true;
        this.agendado = false;
    };

    var Deslocamento = function Deslocamento(){
        this.status = Enums.PEDIDO_STATUS.AGUARDANDO_DESLOCAMENTO;
    };


    var list = function(){
        return Api.get('/pedidos');
    };

    var get = function(id){
        return Api.get('/pedidos', id);
    };

    var remove = function(id){
        return Api.delete('/pedidos', id);
    };

    var create = function(pedido){
        return Api.post('/pedidos', {pedido:pedido});
    };

    var update = function(pedido){
        return Api.put('/pedidos', {pedido:pedido});
    };


    var status = function(statusNum){
        var status = {};
        switch (statusNum){
            case Enums.PEDIDO_STATUS.NOVO._id :
                status = Enums.PEDIDO_STATUS.NOVO;
                status.style = '';
                break;
            case Enums.PEDIDO_STATUS.AGUARDANDO_DESLOCAMENTO._id :
                status = Enums.PEDIDO_STATUS.AGUARDANDO_DESLOCAMENTO;
                status.style = 'label-info';
                break;
            case Enums.PEDIDO_STATUS.LIBERADO._id :
                status = Enums.PEDIDO_STATUS.LIBERADO;
                status.style = 'label-success';
                break;
            case Enums.PEDIDO_STATUS.RECUSADO._id :
                status = Enums.PEDIDO_STATUS.RECUSADO;
                status.style = 'label-danger';
                break;
            case Enums.PEDIDO_STATUS.AGENDADO._id :
                status = Enums.PEDIDO_STATUS.AGENDADO;
                status.style = 'label-primary';
                break;
            case Enums.PEDIDO_STATUS.ENVIADO_PRESTADOR._id :
                status = Enums.PEDIDO_STATUS.ENVIADO_PRESTADOR;
                status.style = 'label-primary';
                break;
            case Enums.PEDIDO_STATUS.VISTORIA_RECEBIDA._id :
                status = Enums.PEDIDO_STATUS.VISTORIA_RECEBIDA;
                status.style = 'label-primary';
                break;
            case Enums.PEDIDO_STATUS.FRUSTADO._id :
                status = Enums.PEDIDO_STATUS.FRUSTADO;
                status.style = 'label-primary';
                break;
            case Enums.PEDIDO_STATUS.FINALIZADO._id :
                status = Enums.PEDIDO_STATUS.FINALIZADO;
                status.style = 'label-primary';
                break;
            case Enums.PEDIDO_STATUS.PENDENTE._id :
                status = Enums.PEDIDO_STATUS.PENDENTE;
                status.style = 'label-danger';
                break;
        }

        return status;
    };

    return {
        Model : Model,
        Agendamento : Agendamento,
        Deslocamento : Deslocamento,
        list : list,
        delete : remove,
        create : create,
        update : update,
        get : get,
        status : status
    }
}]);