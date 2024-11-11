const fs = require('fs');
const path = require('path');
const https = require('https');

const url  = 'https://tinkererway.dev/web_skill_trees_resources/svg';

//Carga los datos de competencias.json en memoria para que se pueda acceder a cada URL y descargar los iconos
const competenciasPath = path.join(__dirname, 'competencias.json');
const competencias = JSON.parse(fs.readFileSync(competenciasPath, 'utf-8'));

const iconosDir = path.join(__dirname, 'public', 'electronics', 'icons');
if (!fs.existsSync(iconosDir)) {
    fs.mkdirSync(iconosDir, { recursive: true }); //el recursive para crear todos los directorios padres en caso de ser necesario
}

const downloadAllIcons = async () => {
    for (let i = 0; i < competencias.length; i++) {
        let icono = competencias[i].icono;
        let urlIcono = `url${icono}`;
        const destino = path.join(iconosDir, `icon${i+1}.svg`);

    }

    console.log("Se han descargado todos los archivos");
}