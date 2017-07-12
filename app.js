'use strict';

/**
 * Aplicação MEAN Stack Real Time
 * @name Expirou-app
 * @requires NodeJs, AngularJs, MongoDB, Bower, GruntJs
 * @since 10/01/2016
 * @author Antony Alkmim
 * @copyright Coderup
 * @version 1.0.0
 * @licence MIT
 */

var $app = angular.module('3a_vistorias', [
    'ui.router',
    'ui.bootstrap',
    'ngAnimate',
    'ngAria',
    'ngMessages',
    'ngStorage',
    'toaster',
    'appServices',
    'formDirectives',
    'generalDirectives',
    'angularFileUpload',
    'ngValidate'
]);

/**
 * Configuracoes Gerais do Sistema
 */

$app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/login');

    $stateProvider.state('app', {
            abstract: true,
            views: {
                'app': {
                    templateUrl: './views/app.html'
                },
                'login': {}
            }
        })
        .state('login', {
            abstract: true,
            views: {
                'app': {},
                'login': {
                    templateUrl: './views/login.html'
                }
            }
        });
}]);

$app.config(['$compileProvider', function($compileProvider) {

    //TODO: remover quando aplicacao for para producao
    $compileProvider.debugInfoEnabled(false);

    $.material.init();
    $.material.ripples();
    $.material.input();
    $.material.checkbox();
    $.material.radio();

}]);

/***
 * COnfiguracao de Authenticacao
 */
$app.config(['$httpProvider', function ($httpProvider){
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];

    $httpProvider.interceptors.push(['$q', '$localStorage', function($q, $localStorage) {
        return {
            'request': function (config) {
                config.headers = config.headers || {};

                //limpar cache
                if(config.url.substr(config.url.length - 4, config.url.length) != "html"){
                    var timestamp = new Date().getTime();
                    config.url += "?timestamp=" + timestamp;
                }

                if ($localStorage.currentUser) {
                    config.headers.Authorization = 'Bearer ' + $localStorage.currentUser.access_token;
                }
                return config;
            },
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    window.location.href = '/#/login';
                }
                return $q.reject(response);
            }
        };
    }]);
}]);

$app.run(['$rootScope', '$state', '$localStorage', '$urlRouter', 'Auth', function ($rootScope, $state, $localStorage, $urlRouter, Auth) {
    $rootScope.$auth = Auth;

    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        if (toState.name != 'login.home' && !$localStorage.currentUser) {
            event.preventDefault();
            $state.go('login.home');
            return;
        }
    });
}]);
