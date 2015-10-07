'use strict';

/*
    Controller to signup
*/
jd.factory.newController('app.common.auth.signup.SignupCtrl', ['jedi.security.SecurityService', 'jedi.dialogs.AlertHelper', '$location', function (authService, AlertHelper, $location) {

    //#region View/Model initialize
    var vm = this;
    vm.signupModel = {};
    //#endregion

    //#region Events binds
    vm.save = save;
    //#endregion

    //#region Events definitions
    function save() {
        authService.signUp(vm.signupModel).then(function() {
            AlertHelper.addInfo('Usuário cadastrado com sucesso.');
            $location.path('/common/auth/signin');
        }, function() {
            AlertHelper.addError('Erro ao cadastrar usuário');
        });
    }
    //#endregion
}]);