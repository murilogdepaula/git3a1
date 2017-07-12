'use strict';

function UserCtrl($scope, $state,User, toaster, $uibModal) {

    $scope.users = [];

    User.list().then(function(users){
        $scope.users = users;
    });

    $scope.confirmDeleteUser = function(user){
        var confirm = $uibModal.open({
            animation: true,
            templateUrl: 'userModalConfirmDelete.html',
            controller: 'UserConfirmDeleteCtrl',
            resolve: {
                user : user
            }
        });
        confirm.result.then(function(){
            deleteUser(user);
        });
    }

    // onClickDelete
    //========================================
    function deleteUser(user){
        var u = angular.copy(user);

        User.delete(u._id).then(function (res) {
            toaster.pop('success', "O usuário "+ u.name +" foi removido!");
            $state.reload();
        });
    }

}

function UserConfirmDeleteCtrl($scope, $uibModalInstance, user) {

    $scope.user = user;

    $scope.ok = function () {
        $uibModalInstance.close();
    };

    $scope.cancel = function () {
        $uibModalInstance.dismiss('cancel');
    };
}


$app
    .controller('UserCtrl', ['$scope', '$state','User', 'toaster', '$uibModal', UserCtrl])
    .controller('UserConfirmDeleteCtrl', ['$scope', '$uibModalInstance', 'user', UserConfirmDeleteCtrl]);
