var DonatePage = function () {

    this.animalName  = element(by.xpath('/html/body/div[2]/section/form/div[1]/div[1]/section/div[2]/div[1]/div/div/ng-transclude/input'));
    this.animal      = element(by.xpath('/html/body/div[2]/section/form/div[1]/div[1]/section/div[2]/div[2]/div/div/ng-transclude/input'));
    this.spitz       = element(by.xpath('/html/body/div[2]/section/form/div[1]/div[1]/section/div[2]/div[3]/div/div/ng-transclude/input'));
    this.age         = element(by.xpath('/html/body/div[2]/section/form/div[1]/div[1]/section/div[2]/div[4]/div/div/ng-transclude/input'));
    this.description = element(by.xpath('/html/body/div[2]/section/form/div[1]/div[1]/section/div[2]/div[5]/div/div/ng-transclude/input'));    
    this.img         = element(by.xpath('/html/body/div[2]/section/form/div[1]/div[1]/section/div[2]/div[6]/div/div/ng-transclude/input'));
    this.ownername   = element(by.xpath('/html/body/div[2]/section/form/div[1]/div[2]/section/div[2]/div[1]/div/div/ng-transclude/input'));
    this.ownercity   = element(by.xpath('/html/body/div[2]/section/form/div[1]/div[2]/section/div[2]/div[2]/div/div/ng-transclude/input'));
    this.ownertel    = element(by.xpath('/html/body/div[2]/section/form/div[1]/div[2]/section/div[2]/div[3]/div/div/ng-transclude/input'));
    this.owneremail  = element(by.xpath('/html/body/div[2]/section/form/div[1]/div[2]/section/div[2]/div[4]/div/div/ng-transclude/input'));    
    this.saveButton  = element(by.buttonText("Salvar"));


    this.get = function () {
      browser.get('http://localhost:8080/#/core/donate');
    };
    
    this.setAnimalName = function (animalName) {
      this.animalName.sendKeys(animalName);
    };
    this.getAnimalName = function () {
      return this.animalName.getAttribute('value');
    };

    
    this.setAnimal = function (animal) {
      this.animal.sendKeys(animal);
    };
    this.getAnimal = function () {
      return this.animal.getAttribute('value');
    };

    
    this.setSpitz = function (spitz) {
      this.spitz.sendKeys(spitz);
    };
    this.getSpitz = function () {
      return this.spitz.getAttribute('value');
    };


    this.setAge = function (age) {
      this.age.sendKeys(age);
    };
    this.getAge = function () {
      return this.age.getAttribute('value');
    };


    this.setDescription = function (description) {
      this.description.sendKeys(description);
    };
    this.getDescription = function () {
      return this.description.getAttribute('value');
    };


    this.setImg = function (img) {
      this.img.sendKeys(img);
    };
    this.getImg = function () {
      return this.img.getAttribute('value');
    };


    this.setOwnername = function (ownername) {
      this.ownername.sendKeys(ownername);
    };
    this.getOwnername = function () {
      return this.ownername.getAttribute('value');
    };


    this.setOwnercity = function (ownercity) {
      this.ownercity.sendKeys(ownercity);
    };
    this.getOwnercity = function () {
      return this.ownercity.getAttribute('value');
    };


    this.setOwnertel = function (ownertel) {
      this.ownertel.sendKeys(ownertel);
    };
    this.getOwnertel = function () {
      return this.ownertel.getAttribute('value');
    };


    this.setOwneremail = function (owneremail) {
      this.owneremail.sendKeys(owneremail);
    };
    this.getOwneremail = function () {
      return this.owneremail.getAttribute('value');
    };


    this.clickEnterButton = function () {
      this.saveButton.click();
    };
  };
module.exports = DonatePage;
