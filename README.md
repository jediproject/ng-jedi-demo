# Arquitetura de Referência CI&T para Projetos AngularJs

> [Yeoman](http://yeoman.io) generator

## Estrutura base

### Recursos gerais
	assets - componentes externos não vinculados ao angular
	assets\libs - bibliotecas externas (ex: jquery, bootstrap, etc)
	assets\css - css de terceiros
	assets\css\app.css - css de customização do projeto (o único que deve ser modificado)
	assets\fonts - fontes utilizadas pelo projeto
	assets\img - imagens utilizadas na montagem do site/projeto
	assets\js - js não angular customizados ou criados no projeto

### Componentes Gerais Angular
	app - componentes angular do projeto
	app\app.js - js com as configurações angular da aplicação
	app\common - componentes, services, directives, filters, etc... gerais da app
	app\common\env\app-env.js - json com variaveis de ambiente gerais da app
	app\common\i18n\resources_[en|pt|*].js - json de resources para i18n
	app\common\components - componentes angular especializados para o projeto
	app\common\components\[component] - contendo js, html, imagens, etc.
	app\common\components\directives\directives.js - diretivas gerais do projeto
	app\common\components\filters\filters.js - filters gerais do projeto
	app\common\components\header - componente de tela para montagem do header
	app\common\components\navegation - componente de tela para montagem do menu
	app\common\features\[submodule]\[feature] - feature/telas globais de todo projeto
		rota: /common/[submodule]/[feature]
	app\common\features\auth - telas globais relacionadas com autenticação

### Estrutura por módulo
	app\[module]
	app\[module]\[module]-app.js - js para configuração do módulo
	app\[module]\env\[module]-env.js - json com variaveis de ambiente do módulo
	app\[module]\i18n\resources_[en|pt|*].js - json de resources para i18n
	app\[module]\components\directives\directives.js - diretivas gerais do módulo
	app\[module]\components\filters\filters.js - filters gerais do módulo
	app\[module]\features\[submodule*]\[feature] - feature/telas do módulo
		rota: /[module]/[submodule]/[feature]
	app\[module]\features\[submodule*]\[feature]\[feature]-ctrl.js - controller
	app\[module]\features\[submodule*]\[feature]\[feature]-service.js - service
	app\[module]\features\[submodule*]\[feature]\[feature]-directive.js - directive
	app\[module]\features\[submodule*]\[feature]\[feature]-filter.js - filter
	app\[module]\features\[submodule*]\[feature]\[feature].html - página
	app\[module]\features\[submodule*]\[feature]\[feature]\view\*.html - páginas, se > 1

## License

LGPL