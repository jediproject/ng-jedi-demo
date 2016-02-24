"use strict";

jd.factory.newController('app.admin.photos.PhotosCtrl', ['jedi.table.TableConfig',  'jedi.dialogs.AlertHelper', 'adminRestService', 'jedi.dialogs.ModalHelper', 'toastr','$log', function (TableConfig, alertHelper, adminRestService, ModalHelper, toastr, $log) {
    var service = adminRestService.all('photos');

    var vm = this;
    vm.photosModel = {};

    vm.filter = filter;
    vm.clean = clean;

    vm.photosTbConfig = {
        changeEvent: tableChangeEvt
    };

    function tableChangeEvt(pageInfo, deferred) {
        var _filter = {};
        if (vm.photosModel.titleFilter) {
            _filter.title = vm.photosModel.titleFilter;
        }
        // fix: ajusta queryString para padrão do json-serve, ex: _start=20&_end=30
        _filter._start = (pageInfo.pageNo-1) * TableConfig.defaultPageSize;
        _filter._end = _filter._start + TableConfig.defaultPageSize;
        service.getList(_filter).then(function (response) {
            deferred.resolve(response);
        });
    }

    function filter() {
        vm.photosTbConfig.refresh();
    }

    function clean() {
        vm.photosModel = {};
        vm.photosTbConfig.refresh();
    }
}]);