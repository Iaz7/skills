window.onload = () => {
    const skillHTML= localStorage.getItem("skill-html");
    const skillName = localStorage.getItem("skill-name");
    document.getElementById("container").innerHTML = skillHTML;
    document.querySelector("h1").innerHTML = "Skill: " + skillName;

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
}