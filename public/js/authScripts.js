async function registerUser(){
    const userNameR = document.getElementById("UserNameR").value;
    const passwordR = document.getElementById("PasswordR").value;
    const passwordConfirmR = document.getElementById("ConfirmedPasswordR").value;

    const response = await fetch("http://localhost:3000/users/register", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({username: userNameR,password: passwordR})
    });
    const data = await response.json();
    if (response.status === 201) {
        alert("Iniciaste sesión correctamente");
        window.location.href = "http://localhost:3000/users/login";
    }
    else{
        alert("Error al iniciar sesión")
    }
}

async function loginUser(){
    const userNameL = document.getElementById("UserNameL").value;
    const passwordL = document.getElementById("PasswordL").value;

    const response = await fetch("http://localhost:3000/users/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({userNameL, passwordL})
    });
    const data = await response.json();
    if (response.status === 200) {
        alert(data.message);
        window.location.href = "/";
    }
    else{
        alert(data.error)
    }
}