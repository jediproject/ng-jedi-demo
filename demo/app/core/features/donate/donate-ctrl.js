'use strict';

/*
    Controller for the feature Donate
*/
factory.newController('app.core.animals.DonateCtrl', ['coreRestService', 'ciandt.components.dialogs.AlertHelper', function (CoreRestService, AlertHelper) {

    //#region Service initialize
    var service = CoreRestService.all('animals');
    //#endregion

    //#region View/Model initialize
    var vm = this;
    vm.donateModel = service.copy({}});
    //#endregion

    //#region Events binds
    vm.save = save;
    //#endregion

    //#region Events definitions
    function save() {
        vm.donateModel.post().then(function () {
            AlertHelper.addInfo('Animal cadastrado com sucesso.');
            $location.path('/core/animals');
        });
    }
    //#endregion

}]);