'use strict';

/*
    Controller for the feature Animals
*/
factory.newController('app.core.animals.AnimalsCtrl', ['coreRestService', 'ciandt.components.dialogs.ModalHelper', 'ciandt.components.dialogs.AlertHelper', function (CoreRestService, ModalHelper, AlertHelper) {

    //#region Service initialize
    var service = CoreRestService.all('animals');
    //#endregion

    //#region View/Model initialize
    var vm = this;
    vm.animalsModel = {};
    //#endregion

    //#region Events binds
    vm.animalDetail = animalDetail;
    vm.removeAnimal = removeAnimal;
    //#endregion

    //#region Load controller
    loadAnimals();
    //#endregion

    //#region Events definitions
    function loadAnimals() {
        service.getList().then(function (animals) {
            vm.animalsModel.animalList = animals;
        });
    }

    function animalDetail(animal) {
        ModalHelper.open('app/core/features/animals/animals-detail.html', { "animal": animal });
    }

    function removeAnimal(animal) {
        AlertHelper.confirm('Gostaria de remover o animal ' + animal.name + '?', function () {
            animal.remove().then(function () {
                AlertHelper.addInfo('Animal removido com sucesso!');
            });
        });
    }
    //#endregion

}]);