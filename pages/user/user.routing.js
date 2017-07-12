'use strict';

function userRouting($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('app.user', {
            url: '/user',
            templateUrl: 'pages/user/views/user.html',
            controller: 'UserCtrl'
        })
        .state('app.user_add', {
            url: '/user/add',
            templateUrl: 'pages/user/views/user.form.html',
            controller: 'UserFormCtrl'
        })
        .state('app.user_edit', {
            url: '/user/edit/:id',
            templateUrl: 'pages/user/views/user.form.html',
            controller: 'UserFormCtrl'
        });

}

$app.config(['$stateProvider', '$urlRouterProvider', userRouting]);
