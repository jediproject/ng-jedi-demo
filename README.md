# Arquitetura de Referência CI&T para Projetos AngularJs

> [Yeoman](http://yeoman.io) generator

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

## License

LGPL