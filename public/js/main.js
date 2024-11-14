window.onload = async () => {
    const competencias = await (await fetch("data/competencias.json")).json();
    const contenedorCompetencias = document.getElementsByClassName("svg-container")[0];

    for (let i = 0; i < competencias.length; i++) {
        let wrapperHTML =
            `<div class="svg-wrapper" data-id="${i+1}" data-custom="false">\n` +
            "  <svg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\">\n" +
            "    <polygon points=\"50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5\"\n" +
            "             class=\"hexagon\"/>\n" +
            "    <text x=\"50%\" y=\"20%\" text-anchor=\"middle\" fill=\"black\" font-size=\"9\">\n";

        competencias[i].texto.trim().split("\n\n\n").forEach(texto => {
            wrapperHTML += `      <tspan x=\"50%\" dy=\"1.2em\" font-weight=\"bold\">${texto}</tspan>\n`;
        });

        wrapperHTML +=
            "    </text>\n" +
            `    <image x=\"35%\" y=\"60%\" width=\"30\" height=\"30\" href=\"${competencias[i].icono}\"/>\n` +
            "  </svg>\n" +
            "  <button class=\"icon-button left-button\">✏️</button>\n" +
            "  <button class=\"icon-button right-button\">📕</button>\n" +
            "</div>";

        contenedorCompetencias.innerHTML += wrapperHTML;
    }

    const svgWrappers = document.getElementsByClassName('svg-wrapper');
    for (let wrapper of svgWrappers) {
        wrapper.addEventListener('mouseover', () => {
            wrapper.classList.add('highlight');
        });
        wrapper.addEventListener('mouseout', () => {
            wrapper.classList.remove('highlight');
        });
    }
}
