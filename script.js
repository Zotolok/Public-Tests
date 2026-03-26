const form = document.getElementById('formu');
const result = document.getElementById('resultMessage');

form.addEventListener('submit', function(e) {
    e.preventDefault(); // Detenemos la recarga de página obligatoriamente

    // 1. Validar Captcha
    const hCaptcha = form.querySelector('textarea[name=h-captcha-response]').value;
    if (!hCaptcha) {
        alert("Please fill out captcha field");
        return;
    }

    // 2. Preparar el feedback visual
    result.style.display = "block";
    result.innerHTML = "Enviando...";
    result.style.color = "#333"; // Color neutro mientras envía

    // 3. Capturar datos y enviar vía Fetch
    const formData = new FormData(form);
    const object = Object.fromEntries(formData);
    const json = JSON.stringify(object);

    fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: json
    })
    .then(async (response) => {
        let jsonRes = await response.json();
        if (response.status == 200) {
            // ÉXITO: Mostramos mensaje y limpiamos todo
            result.innerHTML = "¡Mensaje enviado con éxito!";
            result.style.color = "green";
            form.reset(); // Borra los campos (Nombre, Email, etc.)
            
            // Si usas el script de Web3Forms, a veces hay que resetear el captcha visualmente
            if (typeof hcaptcha !== 'undefined') hcaptcha.reset(); 
        } else {
            // ERROR DE SERVIDOR: Web3Forms nos dice qué pasó
            result.innerHTML = jsonRes.message || "Hubo un error al enviar.";
            result.style.color = "red";
        }
    })
    .catch(error => {
        // ERROR DE RED: No hay internet o el servidor no responde
        console.log(error);
        result.innerHTML = "Error de conexión. Intenta de nuevo.";
        result.style.color = "red";
    })
    .then(() => {
        // Opcional: Ocultar el mensaje después de 5 segundos
        setTimeout(() => {
            result.style.display = "none";
        }, 5000);
    });
});