window.onload = () => {
    // Recuperar el texto del hexágono
    const hexagonText = localStorage.getItem("hexagonText");

    // Mostrarlo en la página
    if (hexagonText) {
        const contentDiv = document.getElementById("content");
        // Unir las líneas del texto en una sola cadena, separadas por un espacio
        const textLines = hexagonText.split("\n").join(" ");
        // Insertar el texto en un solo <h1>
        contentDiv.innerHTML = `<h1>Skill: <span style="font-weight: bold;">${textLines}</span></h1>`;
        contentDiv.innerHTML += `<h3> Skill score: 1 points </h3>`;
        contentDiv.innerHTML += `<h3 style="text-align: center"> Description </h3>`;
        contentDiv.innerHTML += `<p style="text-align: center"> Description of the skill </p>`;
        contentDiv.innerHTML += `<h4> Task to <complet></complet>e: </h4>`;
        contentDiv.innerHTML += `<ul>
                <li><input type="checkbox" class="checkbox"> Uno</li>
                <li><input type="checkbox" class="checkbox"> Dos</li>
                <li><input type="checkbox" class="checkbox"> Tres</li>
            </ul>`;
        contentDiv.innerHTML += `<div id="oculto" hidden>
                <h4>Provide Evidence</h4>
                <input type="text" class="text" value="Enter a URL or explanation as evidence for completing this skill" id="textbox">
                <button type="button">Submit Evidence</button> 
            </div>` ;

        contentDiv.innerHTML += `<h4> Resources </h4>`;
        contentDiv.innerHTML += `<p> Resources used</p>`;
    }

    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (Array.from(checkboxes).every(cb => cb.checked)) {
                confetti();
                document.getElementById('oculto').removeAttribute('hidden');
            }else if (!Array.from(checkboxes).every(cb => cb.checked)){
                document.getElementById('oculto').setAttribute('hidden', '');
            }
        });
    });

    const a = document.getElementById('textbox');
    a.onfocus = function (event){
        let micampo = event.target;
        if(micampo.value === "Enter a URL or explanation as evidence for completing this skill"){
            micampo.value = "";
        }
    };
    a.onblur = function (event){
        let micampo = event.target;
        if(micampo.value.trim() === ""){
            micampo.value = "Enter a URL or explanation as evidence for completing this skill";
        }
    };

    function restoreText(input) {
        // Restaura el texto predeterminado si está vacío
        if (input.value.trim() === "") {
            input.value = "Escribe algo aquí...";
        }
    }
}