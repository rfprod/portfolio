#!/bin/bash

##
# Color definitions.
##
source shell/colors.sh

##
# Manual mode if no params are provided.
##
if [ 1 -gt $# ]; then

  totalSteps=18

  printf "${GREEN} > you will be guided through steps needed to create ${YELLOW}.env${GREEN} file with api keys for integration with external services${DEFAULT} \n\n"
  printf "${LIGHT_BLUE}  >> to do it you will be prompted for the current these values:\n - ${YELLOW}GITHUB_ACCESS_TOKEN${LIGHT_BLUE}\n - ${YELLOW}FIREBASE_DEPLOY_TOKEN${LIGHT_BLUE}\n\n"

  # client application .env

  # prompt user for variables one by one: FIREBASE_DEPLOY_TOKEN
  printf "${LIGHT_BLUE}  >> step ${YELLOW}1/${totalSteps} ${LIGHT_BLUE}: Enter ${YELLOW}GITHUB_ACCESS_TOKEN${LIGHT_BLUE} ${DEFAULT} \n"
  read -p "   > input value :" githubAccessToken

  # prompt user for variables one by one: FIREBASE_DEPLOY_TOKEN
  printf "${LIGHT_BLUE}  >> step ${YELLOW}2/${totalSteps} ${LIGHT_BLUE}: Enter ${YELLOW}FIREBASE_DEPLOY_TOKEN${LIGHT_BLUE} ${DEFAULT} \n"
  read -p "   > input value :" firebaseDeployToken

  # summary check
  printf "${LIGHT_BLUE}  >> step ${YELLOW}3/${totalSteps} ${LIGHT_BLUE}: You provided the following values:\n
    - ${YELLOW}GITHUB_ACCESS_TOKEN${LIGHT_BLUE}=${LIGHT_GREEN}${githubAccessToken}${LIGHT_BLUE}\n
    - ${YELLOW}FIREBASE_DEPLOY_TOKEN${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseDeployToken}${LIGHT_BLUE}\n"

  # notify user
  printf "${LIGHT_BLUE}  >> step ${YELLOW}4/${totalSteps} ${LIGHT_BLUE}: Compare changes with existing ${YELLOW}.env${LIGHT_BLUE} file${DEFAULT} \n\n"
  cat ./.env

  # prompt user whether to continue or not
  printf "\n${LIGHT_BLUE}  >> step ${YELLOW}5/${totalSteps} ${LIGHT_BLUE}: Continue and create/overwrite ${YELLOW}.env${LIGHT_BLUE} file${DEFAULT} \n"
  read -p "   > continue (y/n) :" userChoice
  case $userChoice in
  y | Y)
    # write file contents
    echo "FIREBASE_DEPLOY_TOKEN=${firebaseDeployToken}" >>./.env
    # notify user
    printf "${YELLOW}  >> OK: ${GREEN}environment variables set in ${YELLOW}./.env${LIGHT_BLUE} file${DEFAULT} \n\n"
    cat ./.env
    printf "\n\n"
    ;;
  n | N)
    # notify user
    printf " ${GREEN}  >> cancelled by user, user choice: $userChoice ${DEFAULT} \n"
    ;;
  *)
    # notify user
    printf " ${LIGHT_BLUE}  >> invalid value, user choise: ${RED}$userChoice ${DEFAULT} \n"
    ;;
  esac

  # functions .env

  # prompt user for variables one by one: MAILER_HOST
  printf "${LIGHT_BLUE}  >> step ${YELLOW}8/${totalSteps} ${LIGHT_BLUE}: Enter ${YELLOW}MAILER_HOST${LIGHT_BLUE} ${DEFAULT} \n"
  read -p "   > input value :" mailerHost

  # prompt user for variables one by one: MAILER_PORT
  printf "${LIGHT_BLUE}  >> step ${YELLOW}9/${totalSteps} ${LIGHT_BLUE}: Enter ${YELLOW}MAILER_PORT${LIGHT_BLUE} ${DEFAULT} \n"
  read -p "   > input value :" mailerPort

  # prompt user for variables one by one: MAILER_EMAIL
  printf "${LIGHT_BLUE}  >> step ${YELLOW}10/${totalSteps} ${LIGHT_BLUE}: Enter ${YELLOW}MAILER_EMAIL${LIGHT_BLUE} ${DEFAULT} \n"
  read -p "   > input value :" mailerEmail

  # prompt user for variables one by one: MAILER_CLIENT_ID
  printf "${LIGHT_BLUE}  >> step ${YELLOW}11/${totalSteps} ${LIGHT_BLUE}: Enter ${YELLOW}MAILER_CLIENT_ID${LIGHT_BLUE} ${DEFAULT} \n"
  read -p "   > input value :" mailerClientId

  # prompt user for variables one by one: MAILER_CLIENT_SECRET
  printf "${LIGHT_BLUE}  >> step ${YELLOW}12/${totalSteps} ${LIGHT_BLUE}: Enter ${YELLOW}MAILER_CLIENT_SECRET${LIGHT_BLUE} ${DEFAULT} \n"
  read -p "   > input value :" mailerClientSecret

  # prompt user for variables one by one: MAILER_REFRESH_TOKEN
  printf "${LIGHT_BLUE}  >> step ${YELLOW}13/${totalSteps} ${LIGHT_BLUE}: Enter ${YELLOW}MAILER_REFRESH_TOKEN${LIGHT_BLUE} ${DEFAULT} \n"
  read -p "   > input value :" mailerRefreshToken

  # prompt user for variables one by one: MAILER_ACCESS_TOKEN
  printf "${LIGHT_BLUE}  >> step ${YELLOW}14/${totalSteps} ${LIGHT_BLUE}: Enter ${YELLOW}MAILER_ACCESS_TOKEN${LIGHT_BLUE} ${DEFAULT} \n"
  read -p "   > input value :" mailerAccessToken

  # prompt user for variables one by one: MAILER_RECIPIENT_EMAIL
  printf "${LIGHT_BLUE}  >> step ${YELLOW}15/${totalSteps} ${LIGHT_BLUE}: Enter ${YELLOW}MAILER_RECIPIENT_EMAIL${LIGHT_BLUE} ${DEFAULT} \n"
  read -p "   > input value :" mailerRecipientEmail

  # summary check
  printf "${LIGHT_BLUE}  >> step ${YELLOW}16/${totalSteps} ${LIGHT_BLUE}: You provided the following values:\n
    - ${YELLOW}GITHUB_ACCESS_TOKEN${LIGHT_BLUE}=${LIGHT_GREEN}${githubAccessToken}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_HOST${LIGHT_BLUE}=${LIGHT_GREEN}${mailerHost}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_PORT${LIGHT_BLUE}=${LIGHT_GREEN}${mailerPort}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_EMAIL${LIGHT_BLUE}=${LIGHT_GREEN}${mailerEmail}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_CLIENT_ID${LIGHT_BLUE}=${LIGHT_GREEN}${mailerClientId}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_CLIENT_SECRET${LIGHT_BLUE}=${LIGHT_GREEN}${mailerClientSecret}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_REFRESH_TOKEN${LIGHT_BLUE}=${LIGHT_GREEN}${mailerRefreshToken}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_ACCESS_TOKEN${LIGHT_BLUE}=${LIGHT_GREEN}${mailerAccessToken}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_RECIPIENT_EMAIL${LIGHT_BLUE}=${LIGHT_GREEN}${mailerRecipientEmail}${LIGHT_BLUE}\n"

  # notify user
  printf "${LIGHT_BLUE}  >> step ${YELLOW}17/${totalSteps} ${LIGHT_BLUE}: Compare changes with existing ${YELLOW}./functions/.env${LIGHT_BLUE} file${DEFAULT} \n\n"
  cat ./functions/.env

  # prompt user whether to continue or not
  printf "\n${LIGHT_BLUE}  >> step ${YELLOW}18/${totalSteps} ${LIGHT_BLUE}: Continue and create/overwrite ${YELLOW}.env${LIGHT_BLUE} file${DEFAULT} \n"
  read -p "   > continue (y/n) :" userChoice
  case $userChoice in
  y | Y)
    # write file contents
    echo "GITHUB_ACCESS_TOKEN=${githubAccessToken}" >./functions/.env
    echo "MAILER_HOST=${mailerHost}" >./functions/.env
    echo "MAILER_PORT=${mailerPort}" >>./functions/.env
    echo "MAILER_EMAIL=${mailerEmail}" >>./functions/.env
    echo "MAILER_CLIENT_ID=${mailerClientId}" >>./functions/.env
    echo "MAILER_CLIENT_SECRET=${mailerClientSecret}" >>./functions/.env
    echo "MAILER_REFRESH_TOKEN=${mailerRefreshToken}" >>./functions/.env
    echo "MAILER_ACCESS_TOKEN=${mailerAccessToken}" >>./functions/.env
    echo "MAILER_RECIPIENT_EMAIL=${mailerRecipientEmail}" >>./functions/.env
    # notify user
    printf "${YELLOW}  >> OK: ${GREEN}environment variables set in ${YELLOW}./functions/.env${LIGHT_BLUE} file${DEFAULT} \n\n"
    cat ./functions/.env
    printf "\n\n"
    ;;
  n | N)
    # notify user
    printf " ${GREEN}  >> cancelled by user, user choice: $userChoice ${DEFAULT} \n"
    ;;
  *)
    # notify user
    printf " ${LIGHT_BLUE}  >> invalid value, user choise: ${RED}$userChoice ${DEFAULT} \n"
    ;;
  esac
elif [ 10 -eq $# ]; then
  # map arguments
  githubAccessToken=$1
  firebaseDeployToken=$2
  mailerHost=$3
  mailerPort=$4
  mailerEmail=$5
  mailerClientId=$6
  mailerClientSecret=$7
  mailerRefreshToken=$8
  mailerAccessToken=$9
  mailerRecipientEmail=${10}

  # summary check
  printf "${LIGHT_BLUE} >> You provided the following values:\n
    # client variables:\n
    - ${YELLOW}GITHUB_ACCESS_TOKEN${LIGHT_BLUE}=${LIGHT_GREEN}${githubAccessToken}${LIGHT_BLUE}\n
    - ${YELLOW}FIREBASE_DEPLOY_TOKEN${LIGHT_BLUE}=${LIGHT_GREEN}${firebaseDeployToken}${LIGHT_BLUE}\n
    # functions variables:\n
    - ${YELLOW}GITHUB_ACCESS_TOKEN${LIGHT_BLUE}=${LIGHT_GREEN}${githubAccessToken}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_HOST${LIGHT_BLUE}=${LIGHT_GREEN}${mailerHost}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_PORT${LIGHT_BLUE}=${LIGHT_GREEN}${mailerPort}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_EMAIL${LIGHT_BLUE}=${LIGHT_GREEN}${mailerEmail}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_CLIENT_ID${LIGHT_BLUE}=${LIGHT_GREEN}${mailerClientId}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_CLIENT_SECRET${LIGHT_BLUE}=${LIGHT_GREEN}${mailerClientSecret}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_REFRESH_TOKEN${LIGHT_BLUE}=${LIGHT_GREEN}${mailerRefreshToken}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_ACCESS_TOKEN${LIGHT_BLUE}=${LIGHT_GREEN}${mailerAccessToken}${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_RECIPIENT_EMAIL${LIGHT_BLUE}=${LIGHT_GREEN}${mailerRecipientEmail}${LIGHT_BLUE}\n"

  # write client .env
  echo "GITHUB_ACCESS_TOKEN=${githubAccessToken}" >./.env
  echo "FIREBASE_DEPLOY_TOKEN=${firebaseDeployToken}" >>./.env
  # notify user
  printf "${YELLOW}  >> OK: ${GREEN}environment variables set in ${YELLOW}./.env${LIGHT_BLUE} file${DEFAULT} \n\n"
  cat ./.env
  printf "\n\n"

  # write functions .env
  echo "GITHUB_ACCESS_TOKEN=${githubAccessToken}" >./functions/.env
  echo "MAILER_HOST=${mailerHost}" >>./functions/.env
  echo "MAILER_PORT=${mailerPort}" >>./functions/.env
  echo "MAILER_EMAIL=${mailerEmail}" >>./functions/.env
  echo "MAILER_CLIENT_ID=${mailerClientId}" >>./functions/.env
  echo "MAILER_CLIENT_SECRET=${mailerClientSecret}" >>./functions/.env
  echo "MAILER_REFRESH_TOKEN=${mailerRefreshToken}" >>./functions/.env
  echo "MAILER_ACCESS_TOKEN=${mailerAccessToken}" >>./functions/.env
  echo "MAILER_RECIPIENT_EMAIL=${mailerRecipientEmail}" >>./functions/.env
  # notify user
  printf "${YELLOW}  >> OK: ${GREEN}environment variables set in ${YELLOW}./functions/.env${LIGHT_BLUE} file${DEFAULT} \n\n"
  cat ./functions/.env
  printf "\n\n"
else
  printf "${LIGHT_RED} >> ERROR: ${LIGHT_BLUE}you should provide either no arguments at all or 10 for the following keys in this partucular sequence (latter  case is not safe, env files will be rewritten without prompting for confirmation, it's intended for CI usage):\n
    - ${YELLOW}FIREBASE_DEPLOY_TOKEN${LIGHT_BLUE}\n
    - ${YELLOW}GITHUB_ACCESS_TOKEN${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_HOST${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_PORT${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_EMAIL${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_CLIENT_ID${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_CLIENT_SECRET${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_REFRESH_TOKEN${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_ACCESS_TOKEN${LIGHT_BLUE}\n
    - ${YELLOW}MAILER_RECIPIENT_EMAIL${LIGHT_BLUE}\n"
fi
