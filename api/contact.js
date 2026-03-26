export default async function handler(req, res) {
  // Solo acepta método POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Método no permitido' 
    });
  }

  // Validar que el body tenga los campos necesarios
  if (!req.body || !req.body.name || !req.body.email || !req.body.message) {
    return res.status(400).json({
      success: false,
      message: 'Faltan campos requeridos (name, email, message)'
    });
  }

  // Validar que la variable de entorno exista
  if (!process.env.WEB3FORMS_KEY) {
    console.error('❌ ERROR: WEB3FORMS_KEY no está definida');
    return res.status(500).json({
      success: false,
      message: 'Error de configuración del servidor'
    });
  }

  try {
    const payload = {
      access_key: process.env.WEB3FORMS_KEY,
      name: req.body.name,
      email: req.body.email,
      message: req.body.message,
      subject: 'Nuevo mensaje desde la landing'
    };

    console.log('📤 Enviando a Web3Forms...');
    console.log('🔑 Access key presente:', process.env.WEB3FORMS_KEY ? 'Sí' : 'No');
    console.log('📦 Payload:', JSON.stringify(payload, null, 2));

    // Enviar a Web3Forms
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        // IMPORTANTE: Pon la URL real de tu sitio aquí
        'Origin': 'public-tests-ebon.vercel.app', 
        'Referer': 'public-tests-ebon.vercel.app/'
      },
      body: JSON.stringify(payload)
    });

    console.log('📥 Response status:', response.status);
    console.log('📥 Response headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

    // Verificar el Content-Type de la respuesta
    const contentType = response.headers.get('content-type');
    console.log('📝 Content-Type:', contentType);

    // Si no es JSON, leer como texto para ver qué devolvió
    if (!contentType || !contentType.includes('application/json')) {
      const text = await response.text();
      console.error('❌ Respuesta no es JSON:', text.substring(0, 500));
      return res.status(500).json({
        success: false,
        message: 'Error: Web3Forms no devolvió JSON. Verifica tu access_key.'
      });
    }

    const data = await response.json();
    console.log('📦 Data recibida:', JSON.stringify(data, null, 2));

    if (data.success) {
      console.log('✅ Email enviado correctamente');
      return res.status(200).json({
        success: true,
        message: 'Mensaje enviado correctamente'
      });
    } else {
      console.error('⚠️ Web3Forms rechazó el envío:', data);
      return res.status(400).json({
        success: false,
        message: data.message || 'Error al enviar el mensaje'
      });
    }
  } catch (error) {
    console.error('❌ Error en contact.js:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    
    return res.status(500).json({
      success: false,
      message: 'Error del servidor',
      error: error.message
    });
  }
}