window.onload = async () => {
    const competencias = await (await fetch("data/competencias.json")).json();
    const contenedorCompetencias = document.getElementsByClassName("svg-container")[0];

    if (localStorage.getItem("evidenceSubmissions") == null) {
        localStorage.setItem("evidenceSubmissions", JSON.stringify(Array.from({ length: competencias.length }, () => [])));
    }

    for (let i = 0; i < competencias.length; i++) {
        let wrapperHTML =
            `<div class="svg-wrapper" data-id="${i}" data-custom="false">\n` +
            "  <svg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\">\n" +
            "    <defs>\n" +
            "      <linearGradient id=\"gradient-red\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n" +
            "        <stop offset=\"0%\" style=\"stop-color: #ff8787; stop-opacity: 1\" />\n" +
            "        <stop offset=\"100%\" style=\"stop-color: #d32323; stop-opacity: 1\" />\n" +
            "      </linearGradient>\n" +
            "      <linearGradient id=\"gradient-green\" x1=\"0%\" y1=\"0%\" x2=\"100%\" y2=\"100%\">\n" +
            "        <stop offset=\"0%\" style=\"stop-color: #7efb7e; stop-opacity: 1\" />\n" +
            "        <stop offset=\"100%\" style=\"stop-color: #397f39; stop-opacity: 1\" />\n" +
            "      </linearGradient>\n" +
            "    </defs>\n" +

            (JSON.parse(localStorage.getItem("evidenceSubmissions"))[i].some(submission => submission.user == "user" && submission.status == "approved") ?
        "    <polygon points=\"50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5\" class=\"hexagon\" style=\"fill: #5ac35a\" />\n" :
        "    <polygon points=\"50,5 95,27.5 95,72.5 50,95 5,72.5 5,27.5\" class=\"hexagon\"/>\n") +

            "    <circle cx=\"15\" cy=\"15\" r=\"10\" class=\"hex-circle hex-circle-red\" />\n" +
            "    <text x=\"15\" y=\"20\" text-anchor=\"middle\" fill=\"white\" font-size=\"10\" font-weight=\"bold\">" + JSON.parse(localStorage.getItem("evidenceSubmissions"))[i].reduce((count, item) => item.status === "pending" ? count + 1 : count, 0) + "</text>\n" +
            "    <circle cx=\"85\" cy=\"15\" r=\"10\" class=\"hex-circle hex-circle-green\" />\n" +
            "    <text x=\"85\" y=\"20\" text-anchor=\"middle\" fill=\"white\" font-size=\"10\" font-weight=\"bold\">" + JSON.parse(localStorage.getItem("evidenceSubmissions"))[i].reduce((count, item) => item.status === "approved" ? count + 1 : count, 0) + "</text>\n" +
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
            document.getElementById('descripcion').removeAttribute('hidden');
        });
        wrapper.addEventListener('mouseout', () => {
            wrapper.classList.remove('highlight');
            document.getElementById('descripcion').setAttribute('hidden', '');
        });

        const botonLapiz = wrapper.querySelector(".left-button");

        const botonCuaderno = wrapper.querySelector(".right-button");
        botonCuaderno.addEventListener("click", e => {
            const skillHTML = e.target.parentElement.getElementsByTagName("svg")[0].outerHTML;
            const skillId= e.target.parentElement.getAttribute("data-id");
            const skillName = competencias[parseInt(skillId)].texto;

            localStorage.setItem("skill-html", skillHTML);
            localStorage.setItem("skill-name", skillName);
            localStorage.setItem("skill-id", skillId);
            window.location.href = '../users/electronics';
        });
    }
}
