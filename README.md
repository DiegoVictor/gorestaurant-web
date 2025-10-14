# [Web] GoRestaurant
[![GitHub Workflow Status](https://img.shields.io/github/actions/workflow/status/DiegoVictor/gorestaurant-web/config.yml?logo=github&style=flat-square)](https://github.com/DiegoVictor/gorestaurant-web/actions)
[![typescript](https://img.shields.io/badge/typescript-5.9.3-3178c6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![react](https://img.shields.io/badge/reactjs-19.2.0-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![styled-components](https://img.shields.io/badge/styled_components-6.1.19-db7b86?style=flat-square&logo=styled-components)](https://styled-components.com/)
[![eslint](https://img.shields.io/badge/eslint-9.37.0-4b32c3?style=flat-square&logo=eslint)](https://eslint.org/)
[![jest](https://img.shields.io/badge/jest-30.2.0-brightgreen?style=flat-square&logo=jest)](https://jestjs.io/)
[![coverage](https://img.shields.io/codecov/c/gh/DiegoVictor/gorestaurant-web?logo=codecov&style=flat-square)](https://codecov.io/gh/DiegoVictor/gorestaurant-web)
[![MIT License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](https://raw.githubusercontent.com/DiegoVictor/gorestaurant-web/main/LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)<br>
This web application allow users to register, update and set foods as available to be ordered in your restaurant. All the resources used by this application comes from a fake [`API`](#api).

## Table of Contents
* [Screenshots](#screenshots)
* [Installing](#installing)
  * [Configuring](#configuring)
    * [.env](#env)
    * [API](#api)
* [Usage](#usage)
* [Running the tests](#running-the-tests)
  * [Coverage Report](#coverage-report)

# Screenshots
Click to expand.<br>
<img src="https://raw.githubusercontent.com/DiegoVictor/gorestaurant-web/main/screenshots/dashboard.png" width="32%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/gorestaurant-web/main/screenshots/add-food.png" width="32%"/>
<img src="https://raw.githubusercontent.com/DiegoVictor/gorestaurant-web/main/screenshots/edit-food.png" width="32%"/>

# Installing
Easy peasy lemon squeezy:
```
$ yarn
```
Or:
```
$ npm install
```
> Was installed and configured the [`eslint`](https://eslint.org/) and [`prettier`](https://prettier.io/) to keep the code clean and patterned.

## Configuring
Configure your environment variables and remember to start the [Json Server](https://github.com/typicode/json-server) API before to start this app.

### .env
In this file you may configure the API's url. Rename the `.env.example` in the root directory to `.env` then just update with your settings.

key|description|default
---|---|---
REACT_APP_API_URL|API's url|`http://localhost:3333`

### API
This application make usage of a third party library to create a fake API, you can see more information about it in [JSON Server](https://github.com/typicode/json-server) repository.

To start the API run:
```
$ yarn json-server server.json -p 3333
```
Or:
```
$ npx json-server server.json -p 3333
```
> Remember to update the `.env` if you choose another `port` or `host`

# Usage
To start the app run:
```
$ yarn start
```
Or:
```
npm run start
```

# Running the tests
[Jest](https://jestjs.io) was the choice to test the app, to run:
```
$ yarn test
```
Or:
```
$ npm run test
```

## Coverage report
You can see the coverage report inside `tests/coverage`. They are automatically created after the tests run.
