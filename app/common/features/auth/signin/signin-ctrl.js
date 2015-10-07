'use strict';

/*
    Controlador da tela de complemento do cadastro do usuário
*/
jd.factory.newController('app.common.auth.signin.SigninCtrl', ['jedi.security.SecurityService', function (authService) {
    var vm = this;
    vm.signinModel = {};

    vm.signin = function () {
        authService.signIn({
            username: vm.signinModel.username,
            password: vm.signinModel.password
        });
    };
}]);