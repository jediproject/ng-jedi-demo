'use strict';

/*
    Controlador da tela de complemento do cadastro do usuário
*/
jd.factory.newController('app.common.auth.signin.SigninCtrl', ['jedi.security.SecurityService', 'jedi.dialogs.AlertHelper', 'jedi.i18n.Localize', function (authService, AlertHelper, Localize) {
    var vm = this;
    vm.signinModel = {};

    vm.signin = function () {
        authService.signIn({
            username: vm.signinModel.username,
            password: vm.signinModel.password
        }).catch(function (e){
            AlertHelper.addError(Localize.get('Login inválido!'));
        });
    };
}]);