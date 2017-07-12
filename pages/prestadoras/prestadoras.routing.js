'use strict';

function prestadorasRouting($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('app.prestadoras', {
            url: '/prestadoras',
            templateUrl: 'pages/prestadoras/views/prestadoras.html',
            controller: 'PrestadorasCtrl'
        })
        .state('app.prestadoras_add', {
            url: '/prestadoras/add/:id',
            templateUrl: 'pages/prestadoras/views/prestadoras.form.html',
            controller: 'PrestadorasFormCtrl'
        })
        .state('app.prestadoras_edit', {
            url: '/prestadoras/edit/:id',
            templateUrl: 'pages/prestadoras/views/prestadoras.form.html',
            controller: 'PrestadorasFormCtrl'
        });
}

$app.config(['$stateProvider', '$urlRouterProvider', prestadorasRouting]);
