// unit test
jd.testFactory.newControllerTest('app.common.AppCtrl', {}, 'AppCtrl Test', [
    jd.testFactory.newTestMethod('Language loaded', function(controller) {
        expect(controller.getLanguage()).toEqual('pt');
    }),

    // jd.testFactory.newTestMethod('Change language', function(controller) {
    //     controller.setLanguage('en');
    //     expect(controller.getLanguage()).toEqual('en');
    // })
]);