# Setup for Linux (Ubuntu)

```bash
# setup apt
sudo apt update
sudo apt upgrade

# download + install node
# debian install instructions: https://github.com/nodesource/distributions/blob/master/README.md#debinstall
sudo apt install curl
curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

# download + install + configure git
sudo apt install git
git config --global user.name "Anthony Williams"
git config --global user.email "anthony.williams.cs@gmail.com"
ssh-keygen -t rsa -b 4096 -C "anthony.williams.cs@gmail.com"
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_rsa
sudo apt-get install xclip
xclip -sel clip < ~/.ssh/id_rsa.pub
# value is now in clipboard, add via GitHub Settings page: https://github.com/settings/keys

# clean up anything unneeded
sudo apt autoremove

# download source repo
cd ~
mkdir dev
cd dev
git clone git@github.com:Wolven531/SimpleLeagueCompare.git

# install api node deps
cd ~/dev/SimpleLeagueCompare/api/
npm i

# install web node deps
cd ~/dev/SimpleLeagueCompare/web/
npm i

```
