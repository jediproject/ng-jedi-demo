'use strict';

/*
    Controller and modal for the feature Modalexample
*/
jd.factory.newModal('appCommonModalexample', 'app/common/features/modalexample/modalexample.html', 'app.common.modalexample.ModalexampleCtrl', ['jedi.dialogs.AlertHelper', 'toastr', ['param'], function (alertHelper, toastr, _param) {

    //#region Service initialize
    var service;// = ... e.g: restangular instance
    //#endregion

    //#region View/Model initialize
    var vm = this;
    vm.modalexampleModel = {param: _param};
    //#endregion

    //#region Events binds
    vm.method1 = method1;
    vm.method2 = method2;
    //#endregion

    //#region Load controller
    //method2();
    //#endregion

    //#region Events definitions
    function method1() {
        alertHelper.addInfo('Method1 called');
    }

    function method2() {
        toastr.success('Method2 called');
    }
    //#endregion

}]);