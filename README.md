# [ng-jedi-demo](https://github.com/jediproject/ng-jedi-demo)

## Requirements

* Install these tools:
	- [Node.JS](https://nodejs.org/download)
	- [Git Bash](https://git-scm.com/downloads)

* Download or Clone the demo from Github:
	- [Clone](https://github.com/jediproject/generator-jedi.git)
	- [Download](https://github.com/jediproject/generator-jedi/archive/master.zip)

## Runing

* Run the following command on bash
```bash
npm run start
```

* This command will load all projects dependencies, initialize mocks, and start application on http://localhost:8080

* Sign in with one of the two user/password below:
	- admin/pass
	- user/pass

## Bower components troubleshoot:
    
* If you have any problems when cloning bower components from git you can try the command below:
```bash
git config --global url."https://".insteadOf "git://"
```

* Tests:
    - With the application runing you can execute e2e tests:
	```bash
	grunt e2e
	```
