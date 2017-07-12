"use strict";

$app.factory('Auth', function ($http, $localStorage, $location, $state, Api) {

    var currentUser = $localStorage.currentUser;

    var me = function me(){
        return Api.get('me');
    };

    var logout = function() {
        delete $localStorage.currentUser;
        delete $http.defaults.headers.common.Authorization;
        $state.go('login.home');
    };

    var login = function(user){
        return Api.post('/auth/login', user);
    };


    return {
        me : me,
        user : currentUser,
        logout: logout,
        login:login
    }

});
