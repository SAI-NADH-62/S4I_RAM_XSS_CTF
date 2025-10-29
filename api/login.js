export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method not allowed' });

  let body = req.body;
  // If Vercel doesn't parse JSON automatically (rare), try to parse
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch(e) { body = {}; }
  }

  const username = (body.username || '').toString();
  const password = (body.password || '').toString();

  // Naive "vulnerable" SQL string (for demonstration/logging)
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
  console.log('[vulnerable query]', query);

  // Legit user (for realism)
  const realUser = { username: 'alice', password: 'alicepass' };

  // If credentials match a real user
  if (username === realUser.username && password === realUser.password) {
    const token = Buffer.from('alice|' + Date.now()).toString('base64');
    return res.json({ success: true, redirect: `/api/admin?token=${encodeURIComponent(token)}` });
  }

  // Insecure detection: accept many classic bypass patterns
  const normalized = query.replace(/\s+/g, ' ').toLowerCase();

  const patterns = [
    "' or '1'='1",
    '" or "1"="1"',
    '" or "1"="1',
    "' or '1'='1'--",
    "' or 1=1--",
    ' or 1=1',
    "--",
    '/*',
    `" or 1=1`,
    `') or ('1'='1` // some wrapped variants
  ];

  const found = patterns.some(p => normalized.includes(p));

  // Also accept exact classic payload used in your request (double-quote variant)
  if (!found) {
    const raw = (username + '\n' + password).toLowerCase();
    if (raw.includes('admin" or "1"="1"') || raw.includes("admin' or '1'='1'")) {
      // detected
    }
  }

  if (found || username.toLowerCase().includes('admin" or "1"="1"') || username.toLowerCase().includes("admin' or '1'='1'")) {
    const token = Buffer.from('admin|' + Date.now()).toString('base64');
    // redirect to serverless admin page (admin query param optional)
    return res.json({ success: true, redirect: `/api/admin?token=${encodeURIComponent(token)}&admin=1` });
  }

  return res.json({ success: false, message: 'Invalid username or password' });
}