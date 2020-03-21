#!/bin/bash

##
# Color definitions.
##
source shell/colors.sh

printf "${GREEN} > installing dependencies...${DEFAULT} \n\n"

cd ./functions || exit
npm install
cd .. || exit
npm install
