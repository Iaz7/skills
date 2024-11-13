const fs = require('fs');
const path = require('path');
const axios = require('axios');

const URL = 'https://tinkererway.dev/web_skill_trees_resources/svg'
const BADGES_DATA = require('./data.json');

fs.mkdirSync(path.join(__dirname, 'badges'), { recursive: true });
for (const badge of BADGES_DATA) {
    let icon = badge.icon;
    let iconPath = path.join(__dirname, 'badges', icon.split('/').pop());
    console.log(`Downloading icon: ${icon}`);

    let url = `${URL}${icon.replace('/badges', '/electronics_icons')}`;
    axios({
        url,
        responseType: 'stream'
    }).then(response => {
        response.data.pipe(fs.createWriteStream(iconPath));
    }).catch(err => {
        console.error(`Error downloading icon: ${badge.id}`, err);
    });

    console.log(`Icon downloaded: ${iconPath}`);
};

console.log('Icons downloaded successfully! 🎉');