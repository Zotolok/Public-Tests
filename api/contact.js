export default async function handler(req, res) {
  // Solo acepta método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido' 
    });
  }

  try {
    // Enviar a Web3Forms con la clave protegida
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: process.env.WEB3FORMS_KEY, // Clave oculta
        name: req.body.name,
        email: req.body.email,
        message: req.body.message,
        subject: 'Nuevo mensaje desde la landing'
      })
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({
        success: true,
        message: 'Mensaje enviado correctamente'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: 'Error al enviar el mensaje'
      });
    }
  } catch (error) {
    console.error('Error en contact.js:', error);
    return res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
}