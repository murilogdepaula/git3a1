'use strict';

function UserFormCtrl( $scope, $state,$stateParams, User, toaster, Util, passwordSize) {

    $scope.user = new User.Model();
    $scope.statusDesc = $scope.user.status ? 'Ativo' : 'Inativo';
    $scope.isUpdate = false;
    $scope.userTypes = $scope.$auth.user.role == 'admin' ? Object.keys(Enums.USER_TYPE) : ['USER'];

    /* Verificar se esta alterando ou criando um novo usuario */
    if($stateParams.id){
        $scope.isUpdate = true;

        User.get($stateParams.id).then(function (user) {
            user.password = "";
            user.role = user.role.toUpperCase();
            $scope.user = user;
        });
    }

    //Salvar
    //==================================
    $scope.salvar = function(user){


        if($scope.userTypes.indexOf(user.role) == -1){
            $scope.userTypeError = true;
            return;
        }
        user.role = user.role.toLowerCase();

        var pass = user.password.trim();

        if(!(pass.length >= passwordSize.min) && (pass.length <= passwordSize.max)){
            $scope.passwordError = true;
            $scope.user.password = $scope.user.confirmPassword = "";
            return;
        }
        if(pass != user.confirmPassword.trim()){
            $scope.passwordError = false;
            $scope.confirmPasswordError = true;
            $scope.user.confirmPassword = "";
            return;
        }


        if(Util.isEmpty(user, ['email','password'])){
            return toaster.pop('info', "Verifique os campos obrigatórios.");
        }

        var u = angular.copy(user);

        var action = $scope.isUpdate ? User.update(u) : User.create(u);
        action.then(function (res) {
            toaster.pop('success', "Usuário salvo com sucesso!");
            $state.go('app.user');
        });
    };

}

$app.controller('UserFormCtrl', [
    '$scope',
    '$state',
    '$stateParams',
    'User',
    'toaster',
    'Util',
    'passwordSize',
    UserFormCtrl]);