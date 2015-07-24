'use strict';

/*
    Controller and modal for the feature <%= props.controller%>
*/
factory.newModal('<%= props.directiveName%>', 'app/<%= props.module.toLowerCase()%>/<%if (props.submodule) {%><%= props.submodule.toLowerCase()%>/<%}%><%= props.controller.toLowerCase()%>/<%= props.controller.toLowerCase()%>.html', 'app.<%= props.module.toLowerCase()%>.<%if (props.submodule) {%><%= props.submodule.toLowerCase()%>.<%}%><%= props.controller.toLowerCase()%>.<%= props.controller.capitalize()%>Ctrl', ['<%= props.module.toLowerCase()%>RestService', <% if (props.params) {%>[<%= props.params%>], <%}%>function (<%= props.module.toLowerCase()%>RestService<% if (props.params) {%>, <%= s(props.params).replaceAll("'", '').value()%><%}%>) {

    //#region Service initialize
    var service = <%= props.module.toLowerCase()%>RestService.all('[yourActionBase]');
    //#endregion

    //#region View/Model initialize
    var vm = this;
    vm.<%= props.controller.decapitalize()%>Model = {};
    //#endregion

    //#region Events binds
    vm.method1 = method1;
    //#endregion

    //#region Load controller
    method1();
    //#endregion

    //#region Events definitions
    function method1() {
        
    }
    //#endregion

}]);