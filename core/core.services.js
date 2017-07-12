/**
 * Service para conexao com API
 * @param $http
 * @param $q
 * @constructor
 */
function Api($http, $q, apiUrl) {
    var self = this;

    this.BASE_URL = apiUrl;

    this.baseUrl = function(url){
        self.BASE_URL = url;
    };

    //Get
    //=================================
    this.get = function (url, id) {
        var deferred = $q.defer();

        //buscar todos ou apenas o ID
        url = id ? [url,id].join('/') : url;

        $http.get(self.BASE_URL + url).then(function(res){
            deferred.resolve(res.data);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    //Delete
    //=================================
    this.delete = function (url, id, params) {
        var deferred = $q.defer();
        $http.delete([self.BASE_URL, url, id].join('/'), {
            params : params,
        }).then(function(res){
            deferred.resolve(res.data);
        }, function (err) {
            deferred.reject(err);
        });
        return deferred.promise;
    };

    //POST
    //=================================
    this.post = function (url, obj) {
        var deferred = $q.defer();

        $http.post(self.BASE_URL + url, obj).then(function(res){
            deferred.resolve(res.data);
        }, function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    };

    //PUT
    //=================================
    this.put = function (url, obj) {
        var deferred = $q.defer();

        $http.put(self.BASE_URL + url, obj).then(function(res){
            deferred.resolve(res.data);
        }, function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    };
};

function Util() {

    var Utils = {};

    /**
     * @desc Formata coordenadas SEM máscaras
     * @params String coordenada
     */
    Utils.formatarCoordenadas = function formatarCoordenadas(cord) {
        if (cord != undefined && cord != null && cord.length > 0) {
            cord = cord.replace(/[a-zA-Z.,]+/, "");
            cord = cord.replace(/^([0-9]{2})([0-9]+)$/, "-$1.$2");
        }
        return cord;
    };

    /**
     * @desc Verifica se possui sinal negativo na coordenada, se não, ele adiciona.
     * @params String coordenada
     */
    Utils.adicionaMenos = function adicionaMenos(str) {
        var cord = str.toString();
        if ((cord != undefined && cord != null && cord.length > 0) && cord.search("-") === -1) {
            cord = "-" + cord;
        }
        return cord;
    };

    /**
     * @desc Valida campos vazios
     * @param objeto,array
     * @returns {boolean}
     */
    Utils.isEmpty = function isEmpty(obj, arr) {
        if (arr != null && arr != undefined && obj != null) {
            for (var i = 0; i < arr.length; i++) {
                if (obj.hasOwnProperty(arr[i])) {
                    if ((obj[arr[i]]).toString() == "" || obj[arr[i]] == undefined || obj[arr[i]].length == 0) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
        return false;
    };

    return Utils;
}


$app.service('Api', ["$http", "$q", 'apiUrl', Api])
    .service('Util', [Util]);