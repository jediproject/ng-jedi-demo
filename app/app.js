'use strict';

define([
    //## environment settings
    'json!app-common-env',

    //## Angular modules
    'angularAMD',
    'angular-route',

    //## Commons components
    'app-common',
], function (envSettings, angularAMD) {

    var $routeProviderReference;

    var app = angular.module("app", [
        //## Angular modules
        'ngRoute',

        //## Commons
        'app.common'
    ]);

    // store envSettings as a constant
    app.constant('envSettings', envSettings);

    app.config(['$routeProvider', '$httpProvider', 'jedi.security.SecurityServiceProvider', 'RestangularProvider', '$provide', 'jedi.utilities.UtilitiesProvider', 'jedi.i18n.LocalizeConfig', 'jedi.dialogs.DialogsConfig', 'jedi.layout.validationtooltip.ValidationTooltipConfig', 'jedi.layout.treeview.TreeviewConfig', 'jedi.utilities.UtilitiesConfig', 'jedi.activities.ActivitiesConfig', function ($routeProvider, $httpProvider, authServiceProvider, RestangularProvider, $provide, Utilities, LocalizeConfig, DialogsConfig, ValidationTooltipConfig, TreeviewConfig, UtilitiesConfig, ActivitiesConfig) {
        var $log = angular.injector(['ng']).get('$log');

        // store local $routeProviderReference to be used during run, if it work with dynamic route mapping
        $routeProviderReference = $routeProvider;

        // configure default headers to work with CORS
        Utilities.enableCors($httpProvider);

        // configure Restangular
        Utilities.configureRestangular(RestangularProvider);

        // configure default texts to pt-BR
        TreeviewConfig.emptyMsgLabel = 'Nenhum item encontrado.';

        DialogsConfig.confirmYesLabel = 'Sim';
        DialogsConfig.confirmNoLabel = 'Não';
        DialogsConfig.confirmTitle = 'Atenção!';
        DialogsConfig.alertTitle = 'Atenção!';

        ValidationTooltipConfig.messages = {
            'required': 'Preenchimento obrigatório.',
            'minlength': 'Informe pelo menos {{minLength}} caracteres.',
            'maxlength': 'Informe até {{maxLength}} caracteres.',
            'pattern': 'Valor preenchido é inválido.',
            'equal': 'Valor informado não é igual ao campo anterior.',
            'email': 'Email informado é inválido.',
            'url': 'Url informada é inválida.',
            'number': 'Informe um número válido.',
            'datepicker': 'Informe uma data válida.',
            'date': 'Informe uma data válida.',
            'min': 'Informe um número a partir de {{min}}.',
            'max': 'Informe um número até {{max}}.',
            'cpf': 'CPF informado é inválido.',
            'cnpj': 'CNPJ informado é inválido.',
            'default': 'Conteúdo do campo é inválido.'
        };

        UtilitiesConfig.noLabel = 'Não';
        UtilitiesConfig.yesLabel = 'Sim';

        ActivitiesConfig.inProgressWarning = 'Ao realizar esta ação você perderá {{count}} atividade(s) pendentes.';
        ActivitiesConfig.title = 'Atividades';
        ActivitiesConfig.minimizeLabel = 'Minimizar';
        ActivitiesConfig.closeLabel = 'Fechar';
        ActivitiesConfig.successLabel = 'Concluído';
        ActivitiesConfig.errorLabel = 'Erro';
        ActivitiesConfig.saveLabel = 'Salvar';
        ActivitiesConfig.removeLabel = 'Excluir';

        LocalizeConfig.defaultLanguage = 'pt';

        // configure authService
        authServiceProvider.config({
            authUrlBase: envSettings.authUrlBase,
            signInUrl: '/auth',
            signOutUrl: '/auth/signout',
            onCreateIdentity: function (response, identity) {
                // complements for a identify
                identity.name = response.name;
                return identity;
            }
        });

        RestangularProvider.addResponseInterceptor(function (data, operation, what, url, response, deferred) {
            if (operation === "getList" || operation === "post") {
                var count = response.headers('X-Total-Count');
                if (count) {
                    data.totalCount = count;
                }
            }
            return data;
        });
    }]);

    app.run(['$http', '$route', '$rootScope', '$location', 'jedi.dialogs.AlertHelper', '$timeout', '$injector', '$log', 'jedi.i18n.Localize', function ($http, $route, $rootScope, $location, alertHelper, $timeout, $injector, $log, localize) {
        $log.info('Configure i18n');
        localize.addResource('app/common/i18n/resources_{lang}.json');

        $log.info('Initializing app context.');

        // store envSettings on rootScope
        $rootScope.envSettings = envSettings;

        // create a app context
        $rootScope.appContext = {
            defaultPageSize: 10
        };

        ////-------

        $log.info('Registry security events');

        function loadUserProfile(ev, identity) {
            // user authenticated
            $rootScope.appContext.identity = identity;

            $log.info('Load modules');

            // load app modules (e.g.: core, billing)
            jd.factory.loadModules(['core', 'admin'], function (module) {
                // adiciona path para i18n do sistema
                localize.addResource('app/' + module + '/i18n/resources_{lang}.json');
            }, function () {
                // after load all modules and its dependencies, it can load routes

                $log.info('Load routes');

                $routeProviderReference
                    //#===== yeoman route hook =====#
                    .when('/core/animals', angularAMD.route({
                        breadcrumb: ['Core', 'Animais'],
                        templateUrl: jd.factory.getFileVersion('app/core/features/animals/animals.html'),
                        controllerUrl: jd.factory.getFileVersion('app/core/features/animals/animals-ctrl.js')
                    })).
                    when('/core/donate', angularAMD.route({
                        breadcrumb: ['Core', 'Quero Doar'],
                        templateUrl: jd.factory.getFileVersion('app/core/features/donate/donate.html'),
                        controllerUrl: jd.factory.getFileVersion('app/core/features/donate/donate-ctrl.js')
                    })).
                    when('/common/components', angularAMD.route({
                        breadcrumb: ['Comum', 'Componentes'],
                        templateUrl: jd.factory.getFileVersion('app/common/features/components/components.html'),
                        controllerUrl: jd.factory.getFileVersion('app/common/features/components/components-ctrl.js')
                    })).
                    when('/admin/photos', angularAMD.route({
                        breadcrumb: ['Administração', 'Fotos'],
                        templateUrl: jd.factory.getFileVersion('app/admin/features/photos/photos.html'),
                        controllerUrl: jd.factory.getFileVersion('app/admin/features/photos/photos-ctrl.js')
                    }));
                
                $route.reload();
            });

            if ($location.$$path === '/common/auth/signin' || $location.$$path === '/common/auth/signup') {
                $location.path("/");
            }
        }

        function resetUserProfile(ev, data, status, config, cause) {
            // user unauthenticated
            $routeProviderReference
                .when("/common/auth/signin", angularAMD.route({
                    templateUrl: 'app/common/features/auth/signin/signin.html',
                    controllerUrl: jd.factory.getFileVersion('app/common/features/auth/signin/signin-ctrl.js')
                }))
                .when("/common/auth/signup", angularAMD.route({
                    templateUrl: 'app/common/features/auth/signup/signup.html',
                    controllerUrl: jd.factory.getFileVersion('app/common/features/auth/signup/signup-ctrl.js')
                }));

            $route.reload();

            $location.path('/common/auth/signin');
        }

        // authenticate events
        $rootScope.$on('jedi.security:login-success', loadUserProfile);
        $rootScope.$on('jedi.security:validation-success', loadUserProfile);

        // unauthenticate events
        $rootScope.$on('jedi.security:login-error', resetUserProfile);
        $rootScope.$on('jedi.security:session-expired', resetUserProfile);
        $rootScope.$on('jedi.security:validation-error', resetUserProfile);
        $rootScope.$on('jedi.security:logout-success', resetUserProfile);
        $rootScope.$on('jedi.security:logout-error', resetUserProfile);
        $rootScope.$on('jedi.security:invalid', resetUserProfile);
        ////-------
    }]);

    // AppCtrl: possui controles gerais da aplicação, como a parte de locale e também de deslogar
    app.controller("app.common.AppCtrl", ["jedi.i18n.Localize", 'jedi.security.SecurityService', function (localize, authService) {
        var vm = this;

        vm.setLanguage = function (language) {
            localize.setLanguage(language);
        };

        vm.getLanguage = function () {
            return localize.getLanguage();
        };

        vm.signout = function () {
            authService.signOut();
        };
    }]);

    return angularAMD.bootstrap(app);
});