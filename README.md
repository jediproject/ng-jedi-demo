# Angular Jedi Project :: Arquitetura de Referência para Projetos AngularJs

## Estrutura base

### Recursos gerais
	assets - componentes externos ou não vinculados aos componentes angular do projeto
	assets\libs - bibliotecas externas de terceiros (ex: jquery, bootstrap, etc)
	assets\css - css de terceiros
	assets\css\app.css - css de customização do projeto (o único que deve ser modificado)
	assets\fonts - fontes utilizadas pelo projeto
	assets\img - imagens utilizadas na montagem do site
	assets\js - scripts não angular customizados ou criados no projeto

### Componentes Gerais Angular
	app - configuração e componentes angular específicas do projeto
	app\app.js - script com as configurações básicas angular da aplicação
	app\common - foundation da arquitetura angular que suportarão todos os módulos do projeto (directives, filters, components, etc)
	app\common\common-app.js - script para configuração do módulo common, onde serão importados as dependências globais do sistema
	app\common\env\common-env.js - json com variaveis de ambiente gerais da aplicação
	app\common\i18n\resources_[en|pt|*].js - json de resources para i18n dos componentes deste módulo
	app\common\components - componentes angular especializados para o projeto
	app\common\components\[component] - contendo js, html, etc.
	app\common\components\header - componente de tela para montagem do header
	app\common\components\navegation - componente de tela para montagem do menu
	app\common\features\[submodule]\[feature] - funcionalidades globais do sistema, como telas de login, etc.
	app\common\features\auth - telas globais relacionadas com autenticação
	
- as rota para as funcionalidades deverão seguir o seguinte padrão: /common/[submodule]/[feature]

### Estrutura por módulo
	app\[module] - módulo específico, contendo funcionalidades de negócio
	app\[module]\[module]-app.js - script para configuração do módulo, onde serão importados as dependências específicas deste módulo
	app\[module]\env\[module]-env.js - json com variaveis de ambiente do módulo
	app\[module]\i18n\resources_[en|pt|*].js - json de resources para i18n dos componentes e funcionalidades deste módulo
	app\[module]\components\[component]\[component].[type] - componentes angular especializados para o módulo (js, html, etc)
	app\[module]\features\[submodule*]\[feature] - funcionalidade de negócio do módulo
	app\[module]\features\[submodule*]\[feature]\[feature]-ctrl.js - controller
	app\[module]\features\[submodule*]\[feature]\[feature]-service.js - service
	app\[module]\features\[submodule*]\[feature]\[feature]-directive.js - directive
	app\[module]\features\[submodule*]\[feature]\[feature]-filter.js - filter
	app\[module]\features\[submodule*]\[feature]\[feature].html - página
	app\[module]\features\[submodule*]\[feature]\[feature]\view\*.html - se houver mais de um arquivo html, organizá-los na pasta view
	
- as rota para as funcionalidades deverão seguir o seguinte padrão: /[module]/[submodule]/[feature]

## Padrões e Restrições da Arquitetura

### Gerais

- Utilizar requirejs para controlar carregamento sob demanda dos arquivos javascripts
- Utilizar mecanismo de hash nos nomes dos arquivos para evitar cache do browser. Recomenda-se utilizar o componente [grunt-filerev](https://www.npmjs.com/package/grunt-filerev)
- Utilizar mecanismo [factory](https://github.com/ng-jedi/factory) para declarar controllers, services, filters, directives, modais, etc.
- Sempre incluir dependências externas pelo bower, incluindo no main.js e na configuração shim
```bash
bower install [nome_dep] --save
```
- Todo arquivo javascript deve ser carregado pelo [module]-app.js de seu módulo
- Recursos ligados a uma funcionalidade devem ser criados na estrutura de pastas da funcionalidade
```bash
app\[module]\features\[submodule*]\[feature]\[recursos da feature]
```
- Componentes devem ser criados na estrutura abaixo e não devem ser telas, devem ser componentes que compõem tela, trechos parciais de html ou simplesmente filters, utilitários, etc:
```bash
app\[module]\componentes\[component]\[recursos do componente]
```
- Css devem ser codificados/customizados apenas no arquivo assets\css\app.css, demais css são de terceiros e não devem ser alterados diretamente
- Scripts de terceiros não devem ser alterados, em vez disso tentar criar uma versão nova e publicar no bower, no pior caso criar no projeto na pasta assets\js\
- Valores hardcode que representam diretórios ou informações que podem ser alteradas de acordo com o ambiente, devem ser transferidos para o script [module]-env.json do módulo específico e acessada:
```bash
envSettings[.module].[variable]
```
- Todos os textos dos htmls devem fazer uso da diretiva [i18n](https://github.com/ng-jedi/i18n), para possibilitar a internacionalização posterior ou mesmo durante o projeto.
- Métodos, classes, variáveis, etc... sempre escritos em inglês.
- Métodos, parâmetros de métodos e variáveis sempre no formato camelCase.
- Nome do recurso (controller, modal, service, etc.) sempre no formato PascalCase.
- Para evitar conflitos, todos os componentes/recursos angular devem ter o namespace no seguinte padrão:
```bash
app.[module].[submodule].[feature*].[component], ex: app.security.auth.userprofile.UserProfileCtrl
```
- Sempre usar a declaração 'use strict'; ao início de todo arquivo .js
- Nomes de pastas e arquivos devem ser tudo em minúsculo.
- Todos os componentes angular devem ter dependencias injetadas pelo nome, evitar declarar apenas no construtor do componente, uma vez que a minificação encurtará os nomes dos parâmetros.
- Fazer uso de logs atravez do componente $log em vez do console.log
- Não usar a function “alert” nativa do js, em vez disso usar o componente [dialogs](https://github.com/ng-jedi/dialogs)
- Para camada de serviço, utilizar componente de abstração [Restangular](https://github.com/mgonto/restangular)

### Controllers

- Utilizar mecanismo [factory](https://github.com/ng-jedi/factory), método factory.newController
- Utilizar padrão VM para declaração dos atributos e métodos do controlador
- Nomenclatura:
	- Pasta física: app\\[module]\features\\[submodule]\\[feature]\
	- Nome Controller: app.[module].[submodule].[feature*].[feature]Ctrl
	- Model: [feature]Model
- No corpo do controle deve-se seguir a seguinte ordem de declaração:
* Declaração dos serviços
```javascript
	var service = SecurityRestService.all('admin/feature');
```
* Declaração do vm (view model)
```javascript
	var vm = this;
```
* Declaração do model e demais variáveis de controle
```javascript
	vm.featureRegistrationModel = { id: 1, name: 'teste 1' };
	vm.maxFileCount = 0;
	vm.pageSize = $rootScope.appContext.defaultPageSize;
```
* Bind dos métodos
```javascript
	vm.filter = filter;
	vm.remove = remove;
	vm.clear = clear;
```
* Execuções de métodos, carregamentos de dados ou qualquer execução na inicialização da tela
```javascript
	loadSystems(function (systems) {
		vm.featureRegistrationModel.systems = systems;
	});
```
* Declaração dos métodos e seu statement
```javascript
	function loadSystems(success) {
		console.log('Recuperando systems');
		SecurityRestService.all('admin/system').getList().then(success);
	}
```
- Não deve haver regra de negócio nos controllers, o mesmo deverá estar presente no escopo das APIs apenas.
- Serviços não devem ser expostos no vm nem em nenhum outro atributo, devem sempre passar por métodos do controller.
- Todos os atributos da tela que forem relacionados ao modelo devem ser declarados no vm.[feature]Model, ex:
```javascript
vm.featureRegistrationModel = { id: 1, name: 'teste 1' };
```

### Views
- Nomenclatura:
	- Pasta física: app\\[module]\features\\[submodule]\\[feature]\
	- Nome página: [feature].html
- Sempre construído com html puro, seguindo os padrões estruturais do twitter bootstrap, sem javascript e usando apenas diretivas angular
- ng-repeat deve sempre ser declarado com track by, para evitar problemas de performance
- Utilizar componentes [layout](https://github.com/ng-jedi/layout), em especial o app-input na declaração dos campos da tela, para mantr todos no mesmo padrão visual
- Em tabelas de consultas, usar por padrão a diretiva [at-table](https://github.com/mateusmcg/angular-table-restful) com paginação via api rest
- Na declaração do controller da tela, usar alias em formato camelCase, ex:
```html
ng-controller="app.framework.imports.importfiles.ImportFilesCtrl as importFilesCtrl"
```
- Não declarar styles nos elementos html, em vez disso usar classe dos css de terceiros ou os declarados no arquivo assets\css\app.css
- Todo texto em html deverá fazer uso da diretiva jd-i18n
```html
<jd-i18n>Texto qualquer<jd-i18n>

Ou

<a jd-i18n>Texto qualquer<\a>
```

### Directives
- Utilizar mecanismo [factory](https://github.com/ng-jedi/factory), método factory.newDirective
- Diretivas sempre declaradas com o nome do módulo e submódulo, para evitar duplicidade e sobreposição em caso de projetos grandes e distribuídos
- Nomenclatura:
	- **Se geral para o módulo**
	- Arquivo: app\\[module]\components\\[component]\\[component]-directive.js
	- Nome diretiva: app-[module]-[component]-[diretiva]
	- **Se for de uma feature**
	- Arquivo: app\\[module]\features\\[feature]\\[feature]-directive.js
	- Nome diretiva: app-[module]-[submodule]-[feature]-[diretiva]

### Filters
- Utilizar mecanismo [factory](https://github.com/ng-jedi/factory), método factory.newFilter
- Nomenclatura:
	- **Se geral para o módulo**
	- Arquivo: app\\[module]\components\\[component]\\[component]-filter.js
	- Nome diretiva: app[module][component][filter]
	- **Se for de uma feature**
	- Arquivo: app\\[module]\features\\[feature]\\[feature]-filter.js
	- Nome diretiva: app[module][submodule][feature][filter]

### Modais
- Utilizar mecanismo [factory](https://github.com/ng-jedi/factory), método factory.newModal
- Seguir mesmas regras do controller + directive, modal utiliza os dois tipos de definição juntas.

## Referências:

### ng-jedi scaffold:
- https://github.com/ng-jedi/generator-ng-jedi-ref-arch

### ng-jedi components:
- https://github.com/ng-jedi/breadcrumb
- https://github.com/ng-jedi/dialogs
- https://github.com/ng-jedi/factory
- https://github.com/ng-jedi/i18n
- https://github.com/ng-jedi/layout
- https://github.com/ng-jedi/loading
- https://github.com/ng-jedi/utilities

### Fontes externas de pesquisa:
- https://scotch.io/tutorials/angularjs-best-practices-directory-structure
- https://github.com/johnpapa/angular-styleguide