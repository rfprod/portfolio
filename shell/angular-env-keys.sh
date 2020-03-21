#!/bin/bash

##
# Usage:
# > set keys - bash shell/angular-env-keys.sh GITHUB_ACCESS_TOKEN
# > unset keys - bash shell/angular-env-keys.sh unset-keys
##

##
# Color definitions.
##
source shell/colors.sh

##
# Reports usage error.
##
reportError() {
  local TITLE="ERROR"
  printf "
    ${RED} %s
    ${LIGHT_RED}github access token must be provided as a first argument.
    ${LIGHT_BLUE}Usage:
    # > ${YELLOW}bash shell/angular-env-keys.sh GITHUB_ACCESS_TOKEN${LIGHT_BLUE}
    ${DEFAULT}\n\n" "$TITLE"
}

##
# Sets access token values in angular environment files.
##
setAngularEnvKeys() {
  sed -i -e "s/GITHUB_ACCESS_TOKEN/$1/g" ./src/environments/environment.ts
  sed -i -e "s/GITHUB_ACCESS_TOKEN/$1/g" ./src/environments/environment.prod.ts
}

##
# Unsets access token values in angular environment files.
##
unsetAngularEnvKeys() {
  sed -i -e "s/githubAccessToken\:.*$/githubAccessToken\: 'GITHUB_ACCESS_TOKEN'/g" ./src/environments/environment.ts
  sed -i -e "s/githubAccessToken\:.*$/githubAccessToken\: 'GITHUB_ACCESS_TOKEN'/g" ./src/environments/environment.prod.ts
}

if [ $# -lt 1 ]; then
  reportError
  exit 1
elif [ "$1" = 'unset-keys' ]; then
  unsetAngularEnvKeys
else
  setAngularEnvKeys "$1"
fi
