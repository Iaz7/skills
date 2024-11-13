const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// URL de la página para extraer datos
const url = 'https://github.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/wiki';

let getBadges = async () => {
    try {
        // Lanzar el navegador
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Navegar a la página objetivo
        await page.goto(url, { waitUntil: 'networkidle0' });
        // Extraer datos de cada competencia
        const data = await page.evaluate(() => {
            // Seleccionar cada competencia en la página

            const b0 = Array.from(document.querySelector('#wiki-body > div.markdown-body > table:nth-child(37)').querySelectorAll('tr'));
            b0.shift();
            const b1 = Array.from(document.querySelector('#wiki-body > div.markdown-body > table:nth-child(39)').querySelectorAll('tr'));
            b1.shift();
            const b2 = Array.from(document.querySelector( '#wiki-body > div.markdown-body > table:nth-child(41)').querySelectorAll('tr'));
            b2.shift();
            const b3 = Array.from(document.querySelector( '#wiki-body > div.markdown-body > table:nth-child(43)').querySelectorAll('tr'));
            b3.shift();
            const b4 = Array.from(document.querySelector('#wiki-body > div.markdown-body > table:nth-child(45)').querySelectorAll('tr'));
            b4.shift();

            const badges = b0.concat(b1,b2,b3,b4);
            return badges.map((b, i)=> {
                // Extraer datos específicos
                const rango = b.querySelector("strong").textContent;
                const bitpoints_min = b.querySelectorAll("td")[3].textContent;
                const bitpoints_max = i+1 == badges.length ? "1000" : badges[i+1].querySelectorAll('td')[3].textContent;
                const png = b.querySelector("img").getAttribute('src').replace('https://github.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/raw/master/rangos/png/', '')

                return {
                    rango,
                    bitpoints_min,
                    bitpoints_max,
                    png
                };
            });
        });

        // Crear carpeta "scripts" si no existe y guardar los datos
        const filePath = path.join('../public/badges', 'get-badges.json');
        fs.mkdirSync('../public/badges',{recursive: true});
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        console.log('Datos guardados en get-badges.json');

        // Cerrar el navegador
        await browser.close();
    } catch (error) {
        console.error('Ocurrió un error:', error);
    }
};
getBadges();
