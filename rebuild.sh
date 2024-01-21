ng build --configuration testing --optimization false
sudo rm -rf /var/www/tele-honesto/ -v
sudo mv dist/telemed/ /var/www/tele-honesto -v
