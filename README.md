# Portfolio

[![Azure Pipelines Build Status](https://rfprod.visualstudio.com/Portfolio/_apis/build/status/Portfolio-CI)](https://rfprod.visualstudio.com/Portfolio/_build/latest?definitionId=4)

A portfolio microapp based on `Angular`, `GitHub API`.

## User stories

- User can see a page divided in sections representing presence of portfolio's subject on networks: Codewars, GitHub, CodePen, Hackerrank.
- Each section contains a logo of the respective network along with some basic public data available over respective API if any.
- Each section is clickable and opens a new browser tab with portfolio subject's profile on the selected network.
- User can send an email to portfolio's subject using a contact dialog.
- User can see featured applications grid section.
- User can see portfolio's subject general github statistics.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Angular CLI help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

### Firebase deploment (hosting + cloud functions)

requires manual `.env` file creation in the directory `./functions/` with the following contents

```
GITHUB_ACCESS_TOKEN=github-access-token
MAILER_HOST=smtp.gmail.com
MAILER_PORT=465
MAILER_EMAIL=sender_email_address@gmail.com
MAILER_CLIENT_ID=mailer_client_id.apps.googleusercontent.com
MAILER_CLIENT_SECRET=mailer_client_secret
MAILER_REFRESH_TOKEN=mailer_refresh_token
MAILER_RECIPIENT_EMAIL=recipient_email_address@any_domain.tld
```

To use Gmail you may need to configure [Allow Less Secure Apps](https://www.google.com/settings/security/lesssecureapps) in your Gmail account unless you are using 2FA in which case you would have to create an [Application Specific password](https://security.google.com/settings/security/apppasswords). You may also need to unlock your account with [Allow access to your Google account](https://accounts.google.com/DisplayUnlockCaptcha) to use SMTP.

### Firebase documentation

- [`Firebase Web: Getting started`](https://firebase.google.com/docs/web/setup)
- [`Firebase Web: API Reference`](https://firebase.google.com/docs/reference/js/)
- [`Firebase Web: Codelabs`](https://codelabs.developers.google.com/codelabs/firebase-web/#0)

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.0.4.

[`LICENCE`](LICENSE)
