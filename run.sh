#/bin/sh

#pm2 start push.js - max
pm2 start count.js -i max
pm2 start sum.js -i max