
var DonatePage = require('./donatepage-po.js');
var LoginPage = require('../loginpage/loginpage-po.js');

describe('Donate page', function () {

  var donatePage = new DonatePage();
  var loginPage = new LoginPage();

  beforeEach(function () {
    loginPage.get();
  });

  it('should fill the form and save', function () {    
    
    loginPage.setUserName('admin');
    loginPage.setPassword('pass');
    loginPage.clickEnterButton();

    donatePage.get();

    donatePage.setAnimalName('teste');
    donatePage.setAnimal('teste');
    donatePage.setSpitz('teste');
    donatePage.setAge('12345');
    donatePage.setDescription('teste');
    donatePage.setImg('C:\Users\Public\Pictures\Sample Pictures\Koala.jpg');
    donatePage.setOwnername('teste');
    donatePage.setOwnercity('teste');
    donatePage.setOwnertel('88888888888');
    donatePage.setOwneremail('teste@teste.com');

    expect(donatePage.getAnimalName()).toEqual('teste');
    expect(donatePage.getAnimal()).toEqual('teste');
    expect(donatePage.getSpitz()).toEqual('teste');
    expect(donatePage.getAge()).toEqual('12345');    
    expect(donatePage.getDescription()).toEqual('teste');
    expect(donatePage.getImg()).toEqual('C:\Users\Public\Pictures\Sample Pictures\Koala.jpg');
    expect(donatePage.getOwnername()).toEqual('teste');
    expect(donatePage.getOwnercity()).toEqual('teste');
    expect(donatePage.getOwnertel()).toEqual('(88) 88888-8888');
    expect(donatePage.getOwneremail()).toEqual('teste@teste.com');

    donatePage.clickEnterButton();

    expect(browser.getCurrentUrl()).toEqual('http://localhost:8080/#/core/animals');
  });
  
});
