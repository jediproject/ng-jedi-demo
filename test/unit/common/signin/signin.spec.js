// unit test
jd.testFactory.newControllerTest('/base/app/common/features/auth/signin/signin-ctrl.js', 'app.common.auth.signin.SigninCtrl', {}, 'SigninCtrl Test', [
    jd.testFactory.newTestMethod('Signing', function(controller) {
        controller.signinModel.username = 'admin';
        controller.signinModel.password = 'pass';
        controller.signin();
    })
]);