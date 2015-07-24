'use strict';

/*
    Controller to signup
*/
factory.newController('app.common.auth.signup.SignupCtrl', ['$authService', function (authService) {

    //#region View/Model initialize
    var vm = this;
    vm.signupModel = {};
    //#endregion

    //#region Events binds
    vm.save = save;
    //#endregion

    //#region Events definitions
    function save() {
        authService.signIn(vm.signupModel);
    }
    //#endregion
}]);