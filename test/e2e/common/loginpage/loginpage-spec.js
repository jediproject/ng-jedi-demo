
var LoginPage = require('./loginpage-po.js');

describe('angularjs homepage', function () {

  var loginPage = new LoginPage();

  beforeEach(function () {
    loginPage.get();
  });

  it('should type the username', function () {
    loginPage.setUserName('admin');
    expect(loginPage.getUserName()).toEqual('admin');
  });

  it('should type the password', function () {
    loginPage.setPassword('pass');
    expect(loginPage.getPassword()).toEqual('pass');
  });

  it('should enter and check url', function () {
    var loginURL = browser.getCurrentUrl();
    loginPage.setUserName('admin');
    loginPage.setPassword('pass');
    loginPage.SignIn();
    expect(browser.getCurrentUrl()).not.toEqual(loginURL);
    expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/#/');
    loginPage.SignOut();
  });
});
