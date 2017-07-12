'use strict';

function seguradorasRouting($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('app.seguradoras', {
            url: '/seguradoras',
            templateUrl: 'pages/seguradoras/views/seguradoras.html',
            controller: 'SeguradorasCtrl'
        })
        .state('app.seguradoras_add', {
            url: '/seguradoras/add',
            templateUrl: 'pages/seguradoras/views/seguradoras.form.html',
            controller: 'SeguradorasFormCtrl'
        })
        .state('app.seguradoras_edit', {
            url: '/seguradoras/edit/:id',
            templateUrl: 'pages/seguradoras/views/seguradoras.form.html',
            controller: 'SeguradorasFormCtrl'
        });

}

$app.config(['$stateProvider', '$urlRouterProvider', seguradorasRouting]);
