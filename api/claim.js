// api/claim.js
export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'only POST' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e){ }
  }

  const token = body && body.token;
  const challenge = (body && body.challenge || '').toUpperCase();

  if (!token || !challenge) {
    return res.status(400).json({ error: 'missing token or challenge' });
  }

  const expected = {
    REFLECTED: 'reflected-token-REX1',
    STORED: 'stored-token-SPR1NT3R',
    DOM: 'dom-token-DRAGON2',
    ATTR: 'attr-token-SILVER4',
    SVG: 'svg-token-SCRIPT5'
  };

  if (expected[challenge] !== token) {
    return res.status(403).json({ error: 'invalid token' });
  }

  const envName = `FLAG_${challenge}`;
  const flag = process.env[envName] || `flag{missing_${challenge}}`;

  return res.json({ flag });
}
