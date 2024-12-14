echo "getting nodesource_setup.sh ..."
curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh
echo "executing nodesource_setup.sh ..."
bash nodesource_setup.sh
apt-get update
echo "installing packages ..."
apt-get install -y libfontconfig1 ttf-ancient-fonts nodejs
echo "---- shuttle_setup_container.sh done executing ----"
