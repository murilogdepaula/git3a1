'use strict';

function pedidosRouting($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('app.pedidos', {
            url: '/pedidos',
            templateUrl: 'pages/pedidos/views/pedidos.html',
            controller: 'PedidosCtrl'
        })
        .state('app.pedidos_resumo', {
            url: '/pedidos/resumo/:id',
            templateUrl: 'pages/pedidos/views/pedidos.resumo.html',
            controller: 'PedidosResumoCtrl'
        })
        .state('app.pedidos_add', {
            url: '/pedidos/add',
            templateUrl: 'pages/pedidos/views/pedidos.form.html',
            controller: 'PedidosFormCtrl'
        })
        .state('app.pedidos_edit', {
            url: '/pedidos/:id',
            templateUrl: 'pages/pedidos/views/pedidos.form.html',
            controller: 'PedidosFormCtrl'
        })
        .state('app.pedidos_add_deslocamento', {
            url: '/pedidos/deslocamento/:id',
            templateUrl: 'pages/pedidos/views/pedidos.deslocamento.form.html',
            controller: 'PedidosDeslocamentoFormCtrl'
        })
        .state('app.pedidos_add_agendamento', {
            url: '/pedidos/agendamento/:id',
            templateUrl: 'pages/pedidos/views/pedidos.agendamento.form.html',
            controller: 'PedidosAgendamentoFormCtrl'
        })
        .state('app.pedidos_analista', {
            url: '/pedidos/analista/:id',
            templateUrl: 'pages/pedidos/views/pedidos.analista.html',
            controller: 'PedidosAnalistaCtrl'
        });

}

$app.config(['$stateProvider', '$urlRouterProvider', pedidosRouting]);
