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

    app.config(['$routeProvider', '$httpProvider', 'authServiceProvider', 'RestangularProvider', '$provide', 'ngMaskConfig', 'jedi.utilities.UtilitiesProvider', 'jedi.i18n.LocalizeConfig', function ($routeProvider, $httpProvider, authServiceProvider, RestangularProvider, $provide, ngMaskConfig, Utilities, LocalizeConfig) {
        var $log = angular.injector(['ng']).get('$log');

        // store local $routeProviderReference to be used during run, if it work with dynamic route mapping
        $routeProviderReference = $routeProvider;

        // configure default alias to the ngMask (cpf, cnpj, tel, etc)
        ngMaskConfig.alias = Utilities.ngMaskDefaultAlias;

        // configure default headers to work with CORS
        Utilities.enableCors($httpProvider);

        // configure Restangular
        Utilities.configureRestangular(RestangularProvider);

        // configure language
        LocalizeConfig.defaultLanguage = 'pt';

        // configure authService
        authServiceProvider.config({
            authUrlBase: envSettings.authUrlBase,
            storageKey: 'authData',
            signInUrl: '/auth',
            signOutUrl: '/auth/signout',
            handleTokenResponse: function (response, identity) {
                // complements for a identify
                identity.name = response.name;
                //identity.email = response.email;
                //identity.cpf = response.cpf;
                return identity;
            }
        });
    }]);

    app.run(['$http', '$route', '$rootScope', '$location', 'authService', 'jedi.dialogs.AlertHelper', '$timeout', '$injector', '$log', 'jedi.i18n.Localize', function ($http, $route, $rootScope, $location, authService, alertHelper, $timeout, $injector, $log, localize) {
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
            jd.factory.loadModules(['core'], function (module) {
                // adiciona path para i18n do sistema
                localize.addResource('app/' + module + '/i18n/resources_{lang}.json');
            }, function () {
                // after load all modules and its dependencies, it can load routes

                $log.info('Load routes');

                $routeProviderReference
                    .when('/core/animals', angularAMD.route({
                        breadcrumb: ['Core', 'Animais'],
                        templateUrl: jd.factory.getFileVersion('app/core/features/animals/animals.html'),
                        controllerUrl: jd.factory.getFileVersion('app/core/features/animals/animals-ctrl.js')
                    })).
                    when('/core/donate', angularAMD.route({
                        breadcrumb: ['Core', 'Quero Doar'],
                        templateUrl: jd.factory.getFileVersion('app/core/features/donate/donate.html'),
                        controllerUrl: jd.factory.getFileVersion('app/core/features/donate/donate-ctrl.js')
                    })).otherwise({
                        breadcrumb: ['Principal'],
                        redirectTo: '/'
                    });;
                
                $route.reload();
            });

            if ($location.$$path == '/common/auth/signin' || $location.$$path == '/common/auth/signup') {
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
        $rootScope.$on('auth:login-success', loadUserProfile);
        $rootScope.$on('auth:validation-success', loadUserProfile);

        // unauthenticate events
        $rootScope.$on('auth:login-error', resetUserProfile);
        $rootScope.$on('auth:session-expired', resetUserProfile);
        $rootScope.$on('auth:validation-error', resetUserProfile);
        $rootScope.$on('auth:logout-success', resetUserProfile);
        $rootScope.$on('auth:logout-error', resetUserProfile);
        $rootScope.$on('auth:invalid', resetUserProfile);

        ////-------

        // initialize authService
        $log.info('Initializing authService');
        authService.initialize();
    }]);

    // AppCtrl: possui controles gerais da aplicação, como a parte de locale e também de deslogar
    app.controller("app.common.AppCtrl", ["jedi.i18n.Localize", 'authService', function (localize, authService) {
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
    }])

    return angularAMD.bootstrap(app);
});