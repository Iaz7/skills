const fs = require('fs');
const path = require('path');
const https = require('https');

const url  = 'https://tinkererway.dev/web_skill_trees_resources/svg';

//Carga los datos de competencias.json en memoria para que se pueda acceder a cada URL y descargar los iconos
const competenciasPath = '../public/data/competencias.json';
const competencias = JSON.parse(fs.readFileSync(competenciasPath, 'utf-8'));

for (let i = 0; i < competencias.length; i++) {
    let icono = competencias[i].icono;
    let urlIcono = url + icono;
    const destino = path.join('../public/electronics/icons', `icon${i+1}.svg`);
    fetch(urlIcono).then(res => res.text().then(texto => fs.writeSync(fs.openSync(destino, "w"), texto)));
}
console.log("Se han descargado todos los archivos");
