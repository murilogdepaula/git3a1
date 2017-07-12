"use strict";

$app.factory('Prestadora',['Api', function (Api) {

    /**
     * Modelo da entidade Prestadora
     * @constructor
     */
    var Model = function Model(){
        this.nome = "";
        this.telefone1 = "";
        this.telefone2 = "";
        this.telefone3 = "";
        this.email = "";
        this.cidade = "";
    };


    var list = function(){
        return Api.get('/prestadoras');
    };

    var get = function(id){
        return Api.get('/prestadoras', id);
    };

    var remove = function(id){
        return Api.delete('/prestadoras', id);
    };

    var create = function(prestadora){
        return Api.post('/prestadoras', {prestadora : prestadora});
    };

    var update = function(prestadora){
        return Api.put('/prestadoras', {prestadora:prestadora});
    };

    return {
        Model : Model,
        list : list,
        delete : remove,
        create : create,
        update : update,
        get : get
    }
}]);