let submissions;
let submissionsTable;
let skillId;

window.onload = () => {
    const skillHTML = localStorage.getItem("skill-html");
    const skillName = localStorage.getItem("skill-name");
    skillId = parseInt(localStorage.getItem("skill-id"));

    document.getElementById("container").innerHTML = skillHTML;
    document.querySelector("h1").innerHTML = "Skill: " + skillName;

    submissions = JSON.parse(localStorage.getItem("evidenceSubmissions"));
    submissionsTable = document.getElementById("submissions-table");

    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (Array.from(checkboxes).every(cb => cb.checked)) {
                confetti();
                document.getElementById('oculto').removeAttribute('hidden');
            } else if (!Array.from(checkboxes).every(cb => cb.checked)) {
                document.getElementById('oculto').setAttribute('hidden', '');
            }
        });
    });

    const a = document.getElementById('textbox');
    a.onfocus = function (event) {
        let micampo = event.target;
        if (micampo.value === "Enter a URL or explanation as evidence for completing this skill") {
            micampo.value = "";
        }
    };
    a.onblur = function (event) {
        let micampo = event.target;
        if (micampo.value.trim() === "") {
            micampo.value = "Enter a URL or explanation as evidence for completing this skill";
        }
    };

    const submitButton = document.getElementById("submit")
    submitButton.addEventListener('click', () => {
        submitButton.classList.add('clicked');
        setTimeout(() => {
            submitButton.classList.remove('clicked');
        }, 200);

        const textbox = document.getElementById('textbox');
        if (textbox.value.trim() !== "") {
            let sumbission = {
                user: "user",
                evidence: textbox.value.trim(),
                status: "pending"
            }
            textbox.value = "";
            submissions[skillId].push(sumbission);
            localStorage.setItem("evidenceSubmissions", JSON.stringify(submissions));
            loadSubmissions(submissionsTable);
        }
    });

    loadSubmissions(submissionsTable);
}

function loadSubmissions() {

    submissionsTable.innerHTML = "<tr>\n" +
                                 "<th>User</th>\n" +
                                 "<th>Evidence</th>\n" +
                                 "<th>Actions</th>\n" +
                                 "</tr>";

    JSON.parse(localStorage.getItem("evidenceSubmissions"))[skillId].forEach((s, i, arr) => {
        if (s.status !== "pending") return;

        const row = document.createElement("tr");

        const userCol = document.createElement("td");
        userCol.innerText = s.user;

        const evidenceCol = document.createElement("td");
        evidenceCol.innerText = s.evidence;

        const actionsCol = document.createElement("td");
        const approveButton = document.createElement("button");
        approveButton.innerText = "Approve";
        approveButton.classList.add('button-green');
        approveButton.addEventListener("click", e => {
            approveButton.classList.add('clicked');
            setTimeout(() => {
                approveButton.classList.remove('clicked');
            }, 200);
            submissions[skillId][i] = {
                user: s.user,
                evidence: s.evidence,
                status: "approved"
            };
            localStorage.setItem("evidenceSubmissions", JSON.stringify(submissions));
            loadSubmissions();
        });
        actionsCol.appendChild(approveButton);

        const rejectButton = document.createElement("button");
        rejectButton.innerText = "Reject";
        rejectButton.classList.add('button-red');
        rejectButton.addEventListener("click", e => {
            rejectButton.classList.add('clicked');
            setTimeout(() => {
                rejectButton.classList.remove('clicked');
            }, 200);
            submissions[skillId][i] = {
                user: s.user,
                evidence: s.evidence,
                status: "rejected"
            };
            localStorage.setItem("evidenceSubmissions", JSON.stringify(submissions));
            loadSubmissions();
        });
        actionsCol.appendChild(rejectButton);

        row.appendChild(userCol);
        row.appendChild(evidenceCol);
        row.appendChild(actionsCol);

        submissionsTable.appendChild(row);
    });
}
