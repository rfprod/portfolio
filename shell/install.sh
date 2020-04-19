#!/bin/bash

##
# Color definitions.
##
source shell/colors.sh

installProjectDependencies() {
  local TITLE="<< INSTALLING PROJECT DEPENDENCIES >>"
  printf "${GREEN}%s
    ${DEFAULT} \n\n" "$TITLE"

  cd ./functions || exit
  npm install
  cd .. || exit
  yarn install
}

installProjectDependencies
