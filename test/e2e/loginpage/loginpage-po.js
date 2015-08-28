var LoginPage = function () {

    this.username = element(by.model('signinCtrl.signinModel.username'));
    this.password = element(by.model('signinCtrl.signinModel.password'));
    this.enterButton = element(by.buttonText("Entrar"));

    this.get = function () {
      browser.get('http://localhost:8080/');
    };
    
    this.login = function(){
      if (!this.userName || !this.password) {
        console.log('username or password were not informed');
        return;
      };
      this.enterButton.click();
    };

    this.setUserName = function (userName) {
      this.username.sendKeys(userName);
    };

    this.getUserName = function () {
      return this.username.getAttribute('value');
    };

    this.setPassword = function (password) {
      this.password.sendKeys(password);
    };

    this.getPassword = function () {
      return this.password.getAttribute('value');
    };

    this.clickEnterButton = function () {
      this.enterButton.click();
    };
  };
module.exports = LoginPage;
