"use strict";

$app.factory('Seguradora',['Api', function (Api) {

    /**
     * Modelo da entidade Pedido
     * @constructor
     */
    var Model = function Model(){
        this.isMatriz = true;
        this.filial = '';
        this.nome = '';
        this.cnpj = '';
        this.endereco = '';
        this.bairro = '';
        this.cidade = '';
        this.estado = '';
        this.cep = '';
        this.responsavel = '';
        this.emailResponsavel = '';
        this.ramos = [];

        this.franquia = 0;
        this.reembolsoFixo = 0;
        this.valorKmRodado = 0;
    };

    var Ramo = function Ramo(){
        this.nome = '';
        this.emailResponsavel = '';
        this.kmSemAutorizacaoPrevia = 0;
        this.frustado = 0;
        this.items = [];
    };

    var list = function(){
        return Api.get('/seguradoras');
    };

    var get = function(id){
        return Api.get('/seguradoras', id);
    };

    var remove = function(id){
        return Api.delete('/seguradoras', id);
    };

    var create = function(seguradora){
        return Api.post('/seguradoras', seguradora);
    };

    var update = function(user){
        return Api.put('/seguradoras', user);
    };

    var removeRamo = function(ramoId, seguradoraId){
        return Api.delete(['/seguradoras', seguradoraId, 'ramo', ramoId].join("/"));
    };


    return {
        Model : Model,
        Ramo : Ramo,
        list : list,
        delete : remove,
        create : create,
        update : update,
        get : get,
        removeRamo : removeRamo
    }
}]);