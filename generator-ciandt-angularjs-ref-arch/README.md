# generator-ciandt-angularjs-ref-arch

O objetivo deste gerador é trazer maior facilidade na criação de projetos AngularJs, seguindo a [Arquitetura de Referência AngularJs](https://github.com/fabiohsv-cit/ciandt-angularjs-ref-arch).

O gerador é composto por um rotina de geração principal, que gera toda estruturação v0 de um projeto, e sub geradores para criação de controllers, modais, módulos e funcionalidades.

A rotina de geração principal é uma composição de vários recursos Stack JS de mercado e alguns componentes criados neste projeto Jedi Cube Components. Segue relação dos componentes que compõe a solução:

- [ciandt-components-breadcrumb](https://github.com/fabiohsv-cit/ciandt-components-breadcrumb)
- [ciandt-components-dialogs](https://github.com/fabiohsv-cit/ciandt-components-dialogs)
- [ciandt-components-factory](https://github.com/fabiohsv-cit/ciandt-components-factory)
- [ciandt-components-i18n](https://github.com/fabiohsv-cit/ciandt-components-i18n)
- [ciandt-components-layout](https://github.com/fabiohsv-cit/ciandt-components-layout)
- [ciandt-components-loading](https://github.com/fabiohsv-cit/ciandt-components-loading)
- [ciandt-components-utilities](https://github.com/fabiohsv-cit/ciandt-components-utilities)
- [angular-authService](https://github.com/fabioviana/angular-authService): componente para controle de autenticação e autorização via token
- [angular-bootstrap](https://github.com/angular-ui/bootstrap-bower): componentes bootstrap angular
- [angular-file-upload-interceptor](https://github.com/mateusmcg/angular-file-upload-interceptor): componente para realizar upload de arquivos via angular
- [angular-dynamic-locale](https://github.com/lgalfaso/angular-dynamic-locale): componente para carregamento do ngLocale dinamicamente, após seleção da linguagem, utilizado diretamente pelo componente ciandt-components-i18n.
- [angular-ngMask](https://github.com/fabioviana/ngMaskAlias): componente para aplicar máscaras em campos input
- [angular-table](https://github.com/mateusmcg/angular-table-restful): componente de grid com paginação e ordenação via api rest.
- [angularAMD](https://github.com/mateusmcg/angularAMD-multiscript): componente para integração entre angular e requirejs, para correto carregamento.
- [ng-currency-mask](https://github.com/VictorQueiroz/ngCurrencyMask): componente para aplicar máscara de monetário em campos input.
- [bootstrap](https://github.com/twbs/bootstrap)
- [bootstrap-datetimepicker](https://github.com/Eonasdan/bootstrap-datetimepicker): componente para datepicker
- [moment](https://github.com/moment/moment): componente para manipulação de datas
- [lodash](https://github.com/lodash/lodash): utilitári para manipulação de arrays
- [requirejs](http://requirejs.org/): componente para carregamento tardio dos javascripts da aplicação.
- [requirejs-plugins](https://github.com/millermedeiros/requirejs-plugins): plugins do requirejs para carregar script em formato json.

Além da integração destes componentes acima, o gerador ainda cria toda a configuração do package, bower, grunt e mocks.

As rotinas grunt são destinada para execução de build do projeto gerado, com opções de build para ambiente "develop", "release" e "master". Segue abaixo as tasks que cada opção de build realiza:

- **develop**: responsável por gerar a versão da aplicação para execução local, copiando todos os componentes baixados pelo bower e configurados no arquivo assetsfiles.json, gerando o main.js para esta versão de build e gerando o arquivo de ambiente para cada módulo do projeto (app/MODULO/env/MODULO-env.json), deixando a aplicação pronta para inicialização local.

- **release**: responsável por gerar a versão da aplicação para execução em ambiente de testes, realizando os mesmos passos do ambiente develop, porém, copiando todo o projeto para a pasta build/ e gerando hash para cache bust de cada arquivo.

- **master**: responsável por gerar a versão da aplicação para execução em ambiente de produção, realizando os mesmos passos do ambiente release, porém, minificando os js e css da pasta build/.

Para ambientes onde é utilizado estratégia de cache bust, o processo de build gera o arquivo version.json com o mapeamento dos arquivos originais e as versões atuais em cache, para carregamento de scripts dinâmicos, em tempo de execução, através do mecanismo factory.getFileVersion do componente [ciandt-components-factory](https://github.com/fabiohsv-cit/ciandt-components-factory).

Cada módulo, por padrão, possui um arquivo json template (app/MODULO/env/MODULO-env.tpl.json) com variáveis de ambiente e uma versão deste arquivo para cada opção de build (app/MODULO/env/MODULO-env.AMBIENTE.json), durante execução da build o template é parseado com o conteúdo do json do ambiente selecionado (app/MODULO/env/MODULO-env.json).

Para adicionar uma nova dependencia ao projeto basta seguir os seguintes passos:

1. bower install

```bash
bower install [componente] --save
```

2. assetsfiles.json

	- Inclusão dos arquivos para cópia a partir da pasta bower_components/ para assets/
	```json
	{
	"files": [
		{
			"src": "bower_components//[componente]//[arquivo]",
			"dest": "assets//[tipo: css|libs|img]//[componente]//[arquivo]"
		}
		...
	]}
	```

3. main.tpl.js
	- Caso seja algum javascript, é necessário adiciona-lo na configuração base do requirejs, editando o arquivo main.tpl.js.
	- Deve-se criar um alias na sessão "paths" que aponte para o arquivo na pasta assets e na sessão shim deve ser adicionado a ordem em que o arquivo deverá ser carregado pela aplicação (quais suas dependências).

	```json
	{
		paths: {
			"[componente]": "assets//[tipo: css|libs|img]//[componente]//[arquivo].js"
			...
		},
		shim: {
			"[componente]": ["angular"]
			...
		}
	}
	```

Para utilizar o gerador, siga os passos:

1. Instalação do gerador

	```bash
	npm install -g yo

	git clone https://github.com/fabiohsv-cit/ciandt-angularjs-ref-arch.git

	cd generator-ciandt-angularjs-ref-arch

	npm link
	```

2. Execução do gerador principal

	```bash
	yo ciandt-angularjs-ref-arch
	```

	- informe o nome do projeto, título, nome do módulo padrão, linguagem padrão e relação de componentes que deseja gerar.
	- ao final será criado um projeto v0 na raiz onde o comando for executado, já pronto para execução.
	- Para executar a aplicação utilizar o comando:

	```bash
	npm run start
	```

3. Execução do gerador de controller

	```bash
	yo ciandt-angularjs-ref-arch:controller
	```

	- informe o título da tela, nome do módulo, nome do submódulo e nome do controlador.
	- ao final será criado um controller e uma tela no caminho: app//[nome do módulo]//[nome do submódulo]//[nome do controlador]

4. Execução do gerador de modal

	```bash
	yo ciandt-angularjs-ref-arch:modal
	```

	- informe o título da modal, nome do módulo, nome do submódulo e nome do controlador.
	- ao final será criado um controller e uma tela no caminho: app//[nome do módulo]//[nome do submódulo]//[nome do controlador]

5. Execução do gerador de módulo

	```bash
	yo ciandt-angularjs-ref-arch:module
	```

	- informe o nome do módulo, linguagem padrão e se deve utilizar i18n
	- ao final será criado um módulo com estrutura base no caminho: app//[nome do módulo]

Aprecie o [demo](https://github.com/fabiohsv-cit/ciandt-angularjs-ref-arch/tree/master/demo) criado utilizando este gerador, após baixa-lo basta rodar o comando abaixo e acesse pelo browser o endereço http://localhost:8080

```bash
npm run start
```

## License

LGPL
