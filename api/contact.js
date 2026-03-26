export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      access_key: process.env.WEB3FORMS_KEY, // Clave oculta en variables de entorno
      name: req.body.name,
      email: req.body.email,
      message: req.body.message
    })
  });

  const data = await response.json();
  res.status(200).json(data);
}