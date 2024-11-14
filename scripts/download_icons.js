const fs = require('fs');
const path = require('path');
const axios = require('axios');

const URL = 'https://tinkererway.dev/web_skill_trees_resources/svg'
const BADGES_DATA = require('./data.json');

module.exports = async function download_icons() {
    fs.mkdirSync(path.join(__dirname, 'badges'), { recursive: true });

    // Create a set of unique icons (to avoid downloading the same icon multiple times)
    const icons = new Set(BADGES_DATA.map(badge => badge.icon));
    console.log(`Found ${icons.size} unique icons!`);
    for (const icon of icons) {
        let iconPath = path.join(__dirname, 'badges', icon.split('/').pop());
        console.log(`Downloading icon: ${icon}`);

        let url = `${URL}${icon.replace('/badges', '/electronics_icons')}`;
        await axios({
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
};