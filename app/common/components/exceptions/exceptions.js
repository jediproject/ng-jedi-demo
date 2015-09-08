'use strict';

define(['ng-jedi-dialogs', 'ng-jedi-utilities'], function () {

    angular.module('app.common.components.exceptions', ['jedi.dialogs', 'jedi.utilities']).factory('app.common.components.exceptions.ExceptionsInterceptor', ['$q', '$injector', 'jedi.utilities.Utilities', '$log', function ($q, $injector, Utilities, $log) {
        return {
            responseError: function (rejection) {
                // se request marcado pra nao tratar erro é porque será tratado manualmente
                if (!rejection.config.bypassExceptionInterceptor) {
                    var alertHelper = $injector.get('jedi.dialogs.AlertHelper');
                    //rejection.data.errorDescription, rejection.data.stackTrace
                    var message = (rejection.data && rejection.data.errorDescription) ? rejection.data.errorDescription : undefined;
                    if (!message) {
                        switch (rejection.status) {
                            case 0:
                            case 404:
                                message = 'Endereço acessado está incorreto ou indisponível no momento.';
                                break;
                            case 400: // badrequest - validações
                                message = Utilities.applyModelStateMessages(rejection.data, 'Conteúdo da requisição está inválido, confira os dados submetidos e refaça a operação.');
                                break;
                            case 401:
                                message = 'Sessão expirou, autentique-se novamente.';
                                break;
                            case 403:
                                message = 'Acesso negado, você não possui permissão para acessar esta ação.';
                                break;
                            case 500:
                                message = 'Ocorreu algum erro inesperado durante sua requisição. Tente novamente mais tarde ou contacte o suporte técnico.';
                                break;
                            default:
                                message = 'Ocorreu algum erro não identificado durante sua requisição. Tente novamente mais tarde ou contacte o suporte técnico.';
                        }
                    }

                    if (message) {
                        $log.error('Erro ' + rejection.status + ': ');
                        $log.error(message);
                        alertHelper.addError(message);
                    }
                }

                return $q.reject(rejection);
            }
        };
    }]).config(['$httpProvider', 'jedi.utilities.UtilitiesProvider', function ($httpProvider, Utilities) {
        var $log = angular.injector(['ng']).get('$log');
        // configura interceptor para capturar erros de requisição http
        $log.info('Registrando mecanismo de exceção http.');
        $httpProvider.interceptors.push('app.common.components.exceptions.ExceptionsInterceptor');

        // aplica mecanismo de exception handler javascript
        Utilities.applyExceptionHandler();
    }]);

});