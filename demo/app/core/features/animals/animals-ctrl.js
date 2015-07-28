'use strict';

/*
    Controller for the feature Animals
*/
factory.newController('app.core.animals.AnimalsCtrl', ['coreRestService', 'ciandt.components.dialogs.ModalHelper', function (CoreRestService, ModalHelper) {

    //#region Service initialize
    var service = CoreRestService.all('animals');
    //#endregion

    //#region View/Model initialize
    var vm = this;
    vm.animalsModel = {};
    //#endregion

    //#region Events binds
    vm.animalDetail = animalDetail;
    //#endregion

    //#region Load controller
    loadAnimals();
    //#endregion

    //#region Events definitions
    function loadAnimals() {
        service.getList().then(function (animals) {
            vm.animalsModel = animals;
        });
    }

    function animalDetail(animal) {
        modalHelper.open('app/core/features/animals/animals-detail.html', ['animal'], { "animal": animal });
    }
    //#endregion

}]);