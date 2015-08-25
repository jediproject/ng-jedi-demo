'use strict';

/*
    Controller for the feature Components
*/
jd.factory.newController('app.common.components.ComponentsCtrl', [function () {

    //#region Service initialize
    var service;// = ... e.g: restangular instance
    //#endregion

    //#region View/Model initialize
    var vm = this;
    vm.componentsModel = {
        list: [{
              id: 1,
              value: 'value 1'
            }, {
              id: 2,
              value: 'value 2'
            }, {
              id: 3,
              value: 'value 3'
            }
        ]
    };
    //#endregion

    //#region Events binds
    vm.method1 = method1;
    vm.method2 = method2;
    //#endregion

    //#region Load controller
    method1();
    //#endregion

    //#region Events definitions
    function method1() {
        console.log(vm.componentsModel);
    }

    function method2() {
        console.log(vm.componentsModel);
        vm.componentsModel.list.push({
            id: vm.componentsModel.list.length+1,
            value: 'value value value value value '+(vm.componentsModel.list.length+1)
        });
    }
    //#endregion

}]);