# Portfolio

![build](https://travis-ci.org/rfprod/portfolio.svg?branch=master)

A portfolio microapp based on `Angular`, `GitHub API`.

## User stories

* User can see a page divided in sections representing presence of portfolio's subject on networks: Codewars, GitHub, CodePen, Hackerrank.
* Each section contains a logo of the respective network along with some basic public data available over respective API if any.
* Each section is clickable and opens a new browser tab with portfolio subject's profile on the selected network.
* User can send an email to portfolio's subject using a contact dialog.
* User can see featured applications grid section.

## Project structure

* `./app` - application
  * `./app/src` - application source root
  	* `./app/src/components` - application components source
  	* `./app/src/directives` - application directives source
  	* `./app/src/modules` - application modules source
  	* `./app/src/services` - application services source
  * `./app/css` - stylesheets
  * `./app/data/config.json` - application config containing containing social profiles, and apps references
  * `./app/js` - bundled application components
  * `./app/img` - Codewars, GitHub, Codepen svg logos
  * `./app/webfonts` - application fonts
  * `./app/views` - view components' html templates
* `./test` - unit, e2e configs, and scenarios

## Installation

```
npm install
```

## Startup

```
npm start
```

## Testing

### Unit

single run

```
npm run client-test
```

### End to End

```
npm run protractor
```

### Run all tests

both unit and e2e

continuous

```
npm test
```

### Client env variables

requires manual `.env` file creation in the project root with the following contents

```
GITHUB_ACCESS_TOKEN=github-access-token
```

this value will be used when building application bundle

### Firebase deploment (hosting + cloud functions)

requires manual `.env` file creation in the directory `./functions/` with the following contents

```
MAILER_HOST=smtp.gmail.com
MAILER_PORT=465
MAILER_EMAIL=sender_email_address@gmail.com
MAILER_CLIENT_ID=mailer_client_id.apps.googleusercontent.com
MAILER_CLIENT_SECRET=mailer_client_secret
MAILER_REFRESH_TOKEN=mailer_refresh_token
MAILER_RECIPIENT_EMAIL=recipient_email_address@any_domain.tld
```

To use Gmail you may need to configure [Allow Less Secure Apps](https://www.google.com/settings/security/lesssecureapps) in your Gmail account unless you are using 2FA in which case you would have to create an [Application Specific password](https://security.google.com/settings/security/apppasswords). You may also need to unlock your account with [Allow access to your Google account](https://accounts.google.com/DisplayUnlockCaptcha) to use SMTP.

* [`LICENSE`](LICENSE)
