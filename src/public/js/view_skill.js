window.onload = () => {
    const checkboxes = document.querySelectorAll('.checkbox');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (Array.from(checkboxes).every(cb => cb.checked)) {
                //confetti();
                document.getElementById('oculto').removeAttribute('hidden');
            } else if (!Array.from(checkboxes).every(cb => cb.checked)) {
                document.getElementById('oculto').setAttribute('hidden', '');
            }
        });
    });

    document.getElementById('submit').addEventListener('click', async function () {
        event.preventDefault();
        const evidence = document.getElementById('textbox').value;

        try {
            if (!evidence) {
                alert('Please provide evidence before submitting.');
                return;
            }

            const data = {
                skillId,
                evidence
            };

            const userSkillId = userSkills.find(userSkill => userSkill.user._id == user && userSkill.skill == skillId);
            if (userSkillId) data['userSkillId'] = userSkillId;

            const response = await fetch(`/skills/${skillTree}/submit-evidence/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            await response.json();
            if (response.ok) {
                confetti();
                setTimeout(() => { window.location.reload(); }, 500); //Tiempo para que se muestre el confeti antes de actualizar la página
            }
        } catch (err) {
            console.error(err);
            alert('Failed to submit evidence' + err);
        }
    });
}

async function postVerification(userSkillId, approved) {
    const data = {
        userSkillId,
        approved
    }
    const response = await fetch(`/skills/${skillTree}/${skillId}/verify`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    window.location.reload();
}