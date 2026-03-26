document.getElementById('contactForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitButton = this.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Deshabilitar botón y mostrar estado de carga
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    // Recopilar datos del formulario
    const formData = {
        name: this.querySelector('[name="name"]').value,
        email: this.querySelector('[name="email"]').value,
        message: this.querySelector('[name="message"]').value
    };
    
    try {
        // Enviar a la Serverless Function
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (response.ok && data.success) {
            // Éxito
            alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
            this.reset();
        } else {
            // Error del servidor
            alert('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.');
        }
    } catch (error) {
        // Error de conexión
        console.error('Error:', error);
        alert('Error de conexión. Por favor verifica tu internet e intenta nuevamente.');
    } finally {
        // Restaurar botón
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});