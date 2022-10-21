# GBFFWCQ2022
FIFA TM GORDOBOT will scrap over Fifa Resale Portal for some static matches and will try to add a random ticket to the cart when possible. After that it will alert you so you can complete the purchase

## Prerequisites
1. Download Node.JS into your computer
2. Set up Chrome for debugging
  1.1 Right click on your Google Chrome shortcut icon => Properties. 
  1.2 In Target field, add to the very end --remote-debugging-port=9222
3. Open a Chrome session with the shortcut you just modified
4. Normally log in into your FIFA Resale Portal with your account.
  
## Set Up Steps
1. Get the code zip and unzip it at some location (you can clone the git repo or download the zip)
2. Open a CMD terminal at GORDOBOT location or navigate to the location
3. run "npm install" command at the cmd console
4. run "npm start"
5. 6 chrome tabs will open and look for Argentina-Arabia. At this point you can let GORDOBOT do his job, but beware that FIFA will close your session and you will need to manually log in again and restart GORDOBOT

## Available matches
[X] Argentina Arabia
[X] Argentina Mexico
[X] Argentina Poland

## Tips
- You can check package.json file for available commands you can run from the cmd terminal. You can open multiple terminals and run commands in parallel to search for multiple matches at the same time
