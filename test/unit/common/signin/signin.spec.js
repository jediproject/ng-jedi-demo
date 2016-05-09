// unit test
define(['angular', 'angular-mocks' , 'app', '/base/app/common/features/auth/signin/signin-ctrl.js'], function() {
    describe('SiginCtrl', function() {
        var getController;

        beforeEach(function() {
            module('app');
            inject(function($controller){
                getController = function(name, deps) {
                    return $controller(name, deps);
                }
            });
        });

        describe('when signing in', function() {
            var controller, authService, AlertHelper, Localize;

            beforeEach(inject(['jedi.security.SecurityService', 'jedi.dialogs.AlertHelper', 'jedi.i18n.Localize', function(_authService_, _AlertHelper_, _Localize_) {
                authService = _authService_;
                AlertHelper = _AlertHelper_;
                Localize = _Localize_;

                controller = getController('app.common.auth.signin.SigninCtrl', {
                    authService: _authService_,
                    AlertHelper: _AlertHelper_,
                    Localize: _Localize_
                });

                spyOn(authService, 'signIn').and.callFake(function(params) {
                    var username = params.username,
                        password = params.password,
                        error = false;

                        if (username != 'admin' || password != 'pass') {
                            error = true;
                        }

                        return {
                            catch: function(cb) {
                                if (error) {
                                    cb();
                                }
                            }
                        }
                });

                spyOn(AlertHelper, 'addError').and.callThrough();
            }]));

            it('authService is called', function() {
                controller.signin();

                expect(authService.signIn).toHaveBeenCalled();
            });

            it('valid credentials do not add error', function() {
                controller.signinModel.username = 'admin';
                controller.signinModel.password = 'pass';
                controller.signin();

                expect(AlertHelper.addError).not.toHaveBeenCalled();
            });

            it('invalid credentials do add error', function() {
                controller.signinModel.username = 'xxx';
                controller.signinModel.password = 'xxx';
                controller.signin();

                expect(AlertHelper.addError).toHaveBeenCalled();
            });
        });
    });
});