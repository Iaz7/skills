window.onload = () => {

    const tableBody = document.getElementById("table-body");
    fetch('../badges/get-badges.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar el archivo JSON');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            data.forEach(badge => {
                // Crea una nueva fila y celdas
                const fila = document.createElement('tr');

                // Crea la celda para el rango
                const rangeCelda = document.createElement('td');
                rangeCelda.textContent = badge.rango;

                // Crea la celda para los bitpoints
                const bitpointsCelda = document.createElement('td');
                bitpointsCelda.textContent = `${badge.bitpoints_min} - ${badge.bitpoints_max}`;

                // Crea la celda para la imagen del badge
                const badgeCelda = document.createElement('td');
                const badgeImg = document.createElement('img');
                badgeImg.src = `https://raw.githubusercontent.com/Obijuan/digital-electronics-with-open-FPGAs-tutorial/master/rangos/png/${badge.png}`;
                badgeImg.alt = badge.rango;
                badgeImg.width = 50;
                badgeCelda.appendChild(badgeImg);

                // Agrega las celdas a la fila
                fila.appendChild(rangeCelda);
                fila.appendChild(badgeCelda);
                fila.appendChild(bitpointsCelda);

                // Agrega la fila al cuerpo de la tabla
                tableBody.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error en la solicitud fetch:', error);
        })
}