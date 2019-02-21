# colours
source shell/colors.sh
# DEFAULT, BLACK, DARK_GRAY, RED, LIGHT_RED, GREEN, LIGHT_GREEN, BROWN, YELLOW,
# BLUE, LIGHT_BLUE, PURPLE, LIGHT_PURPLE, CYAN, LIGHT_CYAN, LIGHT_GRAY, WHITE

printf "${GREEN} > installing dependencies...${DEFAULT} \n\n"

cd ./functions
npm install
cd ..
npm install
