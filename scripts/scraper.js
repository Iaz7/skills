const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

// URL de la página para extraer datos
const url = 'https://tinkererway.dev/web_skill_trees/electronics_skill_tree';

let scraper = async () => {
    try {
        // Lanzar el navegador
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();

        // Navegar a la página objetivo
        await page.goto(url, { waitUntil: 'networkidle0' });

        // Extraer datos de cada competencia
        const data = await page.evaluate(() => {
            // Seleccionar cada competencia en la página
            const competencias = document.querySelectorAll('.svg-wrapper');

            return Array.from(competencias).map(competencia=> {
                // Extraer datos específicos
                const id = competencia.getAttribute('data-id');
                const texto = competencia.querySelector("text").textContent;
                const icono = competencia.querySelector("image").getAttribute('href').replace('../../web_skill_trees_resources/svg', '').replace('../../web_skill_trees_resources/', '');

                return {
                    id,
                    texto,
                    icono
                };
            });
        });

        // Crear carpeta "scripts" si no existe y guardar los datos
        const filePath = path.join('../public/data', 'competencias.json');
        fs.mkdirSync('../public/data',{recursive: true});
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

        console.log('Datos guardados en competencias.json');

        // Cerrar el navegador
        await browser.close();
    } catch (error) {
        console.error('Ocurrió un error:', error);
    }
};
scraper();
