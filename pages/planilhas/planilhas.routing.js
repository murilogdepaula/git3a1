'use strict';

function planilhasRouting($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('app.planilhas', {
            url: '/alianz',
            templateUrl: 'pages/planilhas/views/alianz.html',
            controller: 'AllianzCtrl'
        }) 
        .state('app.planilhas_add', {
            url: '/alianz/add',
            templateUrl: 'pages/planilhas/views/alianzForm.html',
            controller: 'AllianzCtrl'
        })
        // form inspeção
        .state('app.planilhas_inspecao', {
            url: '/alianz/Inspecao',
            templateUrl: 'pages/planilhas/views/inspecao.html',
            controller: 'InspecaoCtrl'
        })
        .state('app.inspecao_add', {
            url: '/alianz/inspecao/add',
            templateUrl: 'pages/planilhas/views/inspecaoForm.html',
            controller: 'InspecaoCtrl'
        })

        //form Inspeção de equipamentos
        .state('app.planilhas_equipamentos', {
            url: '/alianz/equipamentos',
            templateUrl: 'pages/planilhas/views/equipamentos.html',
            controller: 'EquipamentosCtrl'
        })
        .state('app.equipamentos_add', {
            url: '/alianz/equipamentos/add',
            templateUrl: 'pages/planilhas/views/equipamentosForm.html',
            controller: 'EquipamentosCtrl'
        }) 

        //form Inspeção empresarial

        .state('app.planilhas_empresarial', {
            url: '/alianz/empresarial',
            templateUrl: 'pages/planilhas/views/empresarial.html',
            controller: 'EmpresarialCtrl'
        })
        .state('app.empresarial_add', {
            url: '/alianz/empresarial/add',
            templateUrl: 'pages/planilhas/views/empresarialForm.html',
            controller: 'EmpresarialCtrl'
        })  

        //Rotas Condominios

        .state('app.planilhas_condominios', {
            url: '/alianz/condominios',
            templateUrl: 'pages/planilhas/views/condominios.html',
            controller: 'CondominiosCtrl'
        })
        .state('app.comdominios_add', {
            url: '/alianz/condominios/add',
            templateUrl: 'pages/planilhas/views/condominiosForm.html',
            controller: 'CondominiosCtrl'
        }) 

        //Rotas Alagamentos
         .state('app.planilhas_alagamentos', {
            url: '/alianz/alagamentos',
            templateUrl: 'pages/planilhas/views/alagamentos.html',
            controller: 'AlagamentosCtrl'
        })
        .state('app.alagamentos_add', {
            url: '/alianz/alagamentos/add',
            templateUrl: 'pages/planilhas/views/alagamentosForm.html',
            controller: 'AlagamentosCtrl'
        })  

        //Rotas DIversos
        .state('app.planilhas_diversos', {
            url: '/alianz/diversos',
            templateUrl: 'pages/planilhas/views/diversos.html',
            controller: 'DiversosCtrl'
        })
        .state('app.diversos_add', {
            url: '/alianz/diversos/add',
            templateUrl: 'pages/planilhas/views/diversosForm.html',
            controller: 'DiversosCtrl'
        }) 

        //Rotas DIversos
        .state('app.planilhas_inspecao_frustrada', {
            url: '/alianz/inspecao-frustrada',
            templateUrl: 'pages/planilhas/views/inspecaoFrustrada.html',
            controller: 'InspecaoFrustradaCtrl'
        })
        .state('app.inspecao_frustrada_add', {
            url: '/alianz/inspecao-frustrada/add',
            templateUrl: 'pages/planilhas/views/inspecaoFrustradaForm.html',
            controller: 'InspecaoFrustradaCtrl'
        }) 
}
$app.config(['$stateProvider', '$urlRouterProvider', planilhasRouting]);
