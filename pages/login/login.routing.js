'use strict';

function loginRouting($stateProvider) {

    $stateProvider
        .state('login.home', {
            url: '/login',
            templateUrl: 'pages/login/views/login.html',
            controller: 'LoginCtrl'
        });

}

$app.config(['$stateProvider', loginRouting]);
