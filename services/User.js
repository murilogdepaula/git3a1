"use strict";

$app.factory('User',['Api', function (Api) {

    /**
     * Modelo da entidade User
     * @constructor
     */
    var Model = function Model(){
        this.name = '';
        this.password = '';
        this.email = '';
        this.status = true; //Enums.USER_STATUS
        this.createdAt = Date.now();
        this.updatedAt = Date.now();
        this.access_token = '';
        this.role = ''; //Enums.USER_TYPE
    };


    var list = function(){
        return Api.get('/user');
    };

    var get = function(id){
        return Api.get('/user', id);
    };

    var remove = function(id){
        return Api.delete('/user', id);
    };

    var create = function(user){
        return Api.post('/user', user);
    };

    var update = function(user){
        return Api.put('/user', user);
    }


    return {
        Model : Model,
        list : list,
        delete : remove,
        create : create,
        update : update,
        get : get
    }
}]);