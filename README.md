# PrototipoPid

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.0.

## Executando o protótipo

Instale as dependências:

```bash
npm install
```

Inicie o Angular:

```bash
npm start
```

A aplicação ficará disponível em `http://localhost:4200/`. As inclusões, edições e
exclusões feitas na tela de Materiais são persistidas automaticamente no `localStorage`
do navegador, sem API ou servidor de dados adicional.

Para retornar à carga inicial, limpe os dados do site no navegador ou remova a chave
`pid-hc.materials.v1` do `localStorage`.

## Exportando para teste

Gere os arquivos estáticos com:

```bash
npm run build
```

O resultado ficará em `dist/prototipo-pid/browser`. O CRUD continuará funcionando no
navegador porque não depende de backend.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
