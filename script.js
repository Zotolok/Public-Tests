// Manejar envío del formulario
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
    
    console.log('📤 Enviando datos:', formData);
    
    try {
        // Enviar a la Serverless Function
        console.log('🌐 Haciendo fetch a /api/contact');
        
        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        console.log('📥 Response status:', response.status);
        console.log('📥 Response ok:', response.ok);
        
        const data = await response.json();
        console.log('📦 Data recibida:', data);
        
        if (response.ok && data.success) {
            // Éxito
            alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
            this.reset();
        } else {
            // Error del servidor
            console.error('❌ Error del servidor:', data);
            alert('Hubo un error al enviar el mensaje: ' + (data.message || 'Error desconocido'));
        }
    } catch (error) {
        // Error de conexión
        console.error('❌ Error completo:', error);
        console.error('❌ Error name:', error.name);
        console.error('❌ Error message:', error.message);
        alert('Error de conexión. Por favor verifica tu internet e intenta nuevamente.\n\nDetalles: ' + error.message);
    } finally {
        // Restaurar botón
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    }
});