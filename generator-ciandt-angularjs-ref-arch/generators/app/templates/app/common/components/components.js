'use strict';

define([<% if (props.useI18n) {%>'ciandt-components-i18n',
        <%}%>'ciandt-components-dialogs',
        'ciandt-components-factory',
        'ciandt-components-loading',
        <% if (props.useBreadcrumb) {%>'ciandt-components-breadcrumb',
        <%}%>'ciandt-components-layout',
        'app-common-components-exceptions'], function () {

    angular.module('app.common.components', [<% if (props.useI18n) {%>'ciandt.components.i18n',
                                             <%}%>'ciandt.components.dialogs',
                                             'ciandt.components.factory',
                                             'ciandt.components.loading',
                                             <% if (props.useBreadcrumb) {%>'ciandt.components.breadcrumb',
                                             <%}%>'ciandt.components.layout',
                                             'app.common.components.exceptions']);

});