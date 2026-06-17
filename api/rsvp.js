function parseBody(body) {
  if (!body) {
    return {};
  }

  if (typeof body === 'string') {
    try {
      return JSON.parse(body);
    } catch (error) {
      return {};
    }
  }

  return body;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { date, time } = parseBody(req.body);

  if (!date) {
    res.status(400).json({ error: 'Missing date' });
    return;
  }

  const selectedTime = time || 'sin hora definida';

  const resendApiKey = process.env.RESEND_API_KEY;
  const emailTo = process.env.EMAIL_TO;
  const emailFrom = process.env.EMAIL_FROM;

  if (!resendApiKey || !emailTo || !emailFrom) {
    res.status(500).json({ error: 'Missing email configuration' });
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: emailFrom,
      to: [emailTo],
      subject: `Ella eligió ${date} a ${selectedTime} para el Universo de Van Gogh`,
      html: `
        <div style="font-family: Georgia, serif; line-height: 1.6; color: #10233d;">
          <h2 style="margin: 0 0 12px;">Nueva confirmación</h2>
          <p style="margin: 0 0 12px;">Ella eligió <strong>${date}</strong> a <strong>${selectedTime}</strong> para la salida al Universo de Van Gogh.</p>
          <p style="margin: 0;">Revisa la invitación para seguir con el plan romántico.</p>
        </div>
      `
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    res.status(500).json({ error: 'Email send failed', details: errorText });
    return;
  }

  res.status(200).json({ ok: true });
};