const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const download_icons = require('./download_icons');
const optimizeSVG = require('./optimize_svg');

const URL = 'https://tinkererway.dev/web_skill_trees/electronics_skill_tree';

async function promptUser(query) {
    console.log(query);
    return new Promise(resolve => process.stdin.once('data', data => resolve(data.toString().trim().toLowerCase())));
}

async function scraper() {
    try {
        console.log(`Scraping data from ${URL}...`);
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.goto(URL, { waitUntil: 'networkidle0'});
        console.log('Page loaded!');

        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        const data = await page.evaluate(() => {
            console.log('Evaluating page...');
            const nodes = document.querySelectorAll('.svg-wrapper');
            console.log(`Found ${nodes.length} nodes!`);
            
            return Array.from(nodes).map(node => {
                const ID = parseInt(node.getAttribute('data-id'));
                console.log('Scraping node:', ID);
                let name = "";
                for (const child of node.querySelector('text').children) {
                    name += child.textContent + " ";
                };
                name = name.replace(/\s{2,}/g, ' '); // Remove extra spaces
                const icon = node.querySelector('image').getAttribute('href')
                    .replace(/\.\.\/\.\.\/web_skill_trees_resources\//g, '') // I hate regex o((>ω< ))o
                    .replace('svg/', '')
                    .replace('electronics_icons/', '/badges/');

                console.log(`Scraped node: ${ID} - ${name}`);
                return { id: ID, text: name.trim(), icon, description: '' };
            });
        });

        console.log(`Saving data to data.json...`);
        const dataPath = path.join(__dirname, 'data.json');
        fs.mkdirSync(path.dirname(dataPath), { recursive: true });
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));

        await browser.close();

        console.log('Data scraped successfully! 🎉');

        const downloadResponse = await promptUser('Do you want to download the icons? (y/n)');
        if (downloadResponse === 'y') {
            await download_icons();
            const optimizeResponse = await promptUser('Do you want to optimize the SVGs? (y/n)');
            if (optimizeResponse === 'y') {
                const icons = new Set(data.map(badge => badge.icon));
                for (const icon of icons) {
                    const iconPath = path.join(__dirname, 'badges', path.basename(icon));
                    await optimizeSVG(iconPath);
                };
                console.log('SVGs optimized successfully! 🎉');
            } else {
                console.log('Optimization skipped!');
            };
        } else {
            console.log('Download skipped!');
        };

        console.log('Exiting...');
        process.exit();
    } catch (error) {
        console.error('Error scraping data:', error);
    };
};

scraper();