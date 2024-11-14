const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const URL = 'https://github.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/wiki';

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto(URL, { waitUntil: 'networkidle0' });
        console.log('Page loaded!');
        page.on('console', msg => console.log('PAGE LOG:', msg.text()));

        const data = await page.evaluate(() => {
            const b0 = Array.from(document.querySelector('#wiki-body > div.markdown-body > table:nth-child(37)').querySelectorAll('tr'));
            b0.shift();

            const b1 = Array.from(document.querySelector('#wiki-body > div.markdown-body > table:nth-child(39)').querySelectorAll('tr'));
            b1.shift();

            const b2 = Array.from(document.querySelector('#wiki-body > div.markdown-body > table:nth-child(41)').querySelectorAll('tr'));
            b2.shift();

            const b3 = Array.from(document.querySelector('#wiki-body > div.markdown-body > table:nth-child(43)').querySelectorAll('tr'));
            b3.shift();

            const b4 = Array.from(document.querySelector('#wiki-body > div.markdown-body > table:nth-child(45)').querySelectorAll('tr'));
            b4.shift();

            const badges = b0.concat(b1, b2, b3, b4);
            return badges.map((badge, index) => {
                return {
                    rank: badge.querySelector('strong').textContent,
                    bitpoints_min: badge.querySelectorAll('td')[3].textContent,
                    bitpoints_max: index + 1 == badges.length ? '1000' : badges[index + 1].querySelectorAll('td')[3].textContent,
                    icon: badge.querySelector('img').getAttribute('src').replace('https://github.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/raw/master/rangos/png/', '')
                };
            });
        });

        console.log(`Saving data to ranks.json...`);
        const dataPath = path.join(__dirname, 'ranks.json');
        fs.mkdirSync(path.dirname(dataPath), { recursive: true });
        fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
        await browser.close();
        console.log('Data scraped successfully! 🎉');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    };
})();