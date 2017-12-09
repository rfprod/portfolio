# Portfolio

![build](https://travis-ci.org/rfprod/portfolio.svg?branch=master)

A portfolio microapp based on `AngularJS`, `GitHub API`, `Codewars API` (codewars server does not allow CORS for now, integration should be probably done using server-side script or not at all), and `CodePen API`.

## User stories

* User can see a page divided in sections representing precence of portfolio's subject on networks: Codewars, GitHub, CodePen.
* Each section contains a logo of the respective network along with some basic public data available over respective API if any.
* Each section is clickable and opens a new browser tab with portfolio subject's profile on the selected network.

## Project structure

* `./app` - application
  * `./app/components` - viewless components and respective unit-tests
  * `./app/css` - stylesheets
  * `./app/data/config.json` - configuration file containing portfolio subject's `Codewars`, `GitHub`, `Codepen`, and `email` usernames (first three are used for httpServices urls formation, email username is used for email sending; it is required to have an email address with this name and in the website's domain configured, e.g. if website is available on domain `website.tld` and `email` is set to `connect`, there should be an email address `connect@website.tld`)
  * `./app/js` - bundled application components
  * `./app/img` - Codewars, GitHub, Codepen svg logos
  * `./app/views` - view components and respective unit-test
* `./e2e-tests` - protractor configuration and scenarios

## Installation

```
npm install
```

## Startup

**development mode** (installs dependencies, runs gulp default task `gulp.task('default', ['server','lint','concat-and-uglify-js','autoprefix-and-minify-css','client-unit-test','client-e2e-test','watch']);`)

```
npm start
```

**production mode** (installs dependencies, runs `http-server`)

```
npm run start-prebuilt
```

**start server only**

```
npm run server
```

## Testing

### Unit

single run

```
npm run test-single-run
```

continuous

```
npm test-continous
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

### Note

if built project is hosted on a webserver without NodeJS support, the following should be added to `./htaccess` for AngularJS routing to work properly:

```
RewriteEngine on
Options FollowSymLinks
ReqriteBase /
ReqriteCond %{REQUEST_FILENAME} !-f
ReqriteCond %{REQUEST_FILENAME} !-d
ReqriteRule ^(.*)$ /#/$1 [L]
```
