const response = await fetch('/api/contact', {  // ← A tu API
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
});