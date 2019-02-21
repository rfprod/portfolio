#!/bin/bash

##
# Usage:
# > set keys - bash shell/angular-env-keys.sh GITHUB_ACCESS_TOKEN
# > unset keys - bash shell/angular-env-keys.sh unset-keys
##

##
# Colors:
# DEFAULT, BLACK, DARK_GRAY, RED, LIGHT_RED, GREEN, LIGHT_GREEN, BROWN, YELLOW,
# BLUE, LIGHT_BLUE, PURPLE, LIGHT_PURPLE, CYAN, LIGHT_CYAN, LIGHT_GRAY, WHITE.
##
source shell/colors.sh

##
# Reports usage error.
##
reportError () {
  printf "\n ${RED} ERROR: ${YELLOW}github access token must be provided as a first argument.\n
    ${LIGHT_BLUE}Usage:\n
    # > ${YELLOW}bash shell/angular-env-keys.sh GITHUB_ACCESS_TOKEN${LIGHT_BLUE}\n
    ${DEFAULT}\n\n"
}

##
# Sets access token values in angular environment files.
##
setAngularEnvKeys () {
  sed -i -e "s/GITHUB_ACCESS_TOKEN/$1/g" ./src/environments/environment.ts
  sed -i -e "s/GITHUB_ACCESS_TOKEN/$1/g" ./src/environments/environment.prod.ts
}

##
# Unsets access token values in angular environment files.
##
unsetAngularEnvKeys () {
  sed -i -e "s/githubAccessToken\:.*$/githubAccessToken\: 'GITHUB_ACCESS_TOKEN'/g" ./src/environments/environment.ts
  sed -i -e "s/githubAccessToken\:.*$/githubAccessToken\: 'GITHUB_ACCESS_TOKEN'/g" ./src/environments/environment.prod.ts
}

echo $1

if [ $# -lt 1 ]; then
  reportError
  exit 1
elif [ $1 = 'unset-keys' ]; then
  unsetAngularEnvKeys
else
  setAngularEnvKeys $1
fi
