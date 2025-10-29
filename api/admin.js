// api/admin.js
export default function handler(req, res) {
  const { token = '' } = req.query || {};
  if (!token) return res.status(403).send('<h1>403 Forbidden</h1>');

  try {
    const decoded = Buffer.from(token, 'base64').toString();
    if (!decoded.startsWith('admin') && !decoded.startsWith('alice')) {
      return res.status(403).send('<h1>403 Forbidden</h1>');
    }
  } catch (e) {
    return res.status(403).send('<h1>403 Forbidden</h1>');
  }

  const html = `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Admin Dashboard</title>
    <link rel="stylesheet" href="/assets/style.css">
  </head>
  <body>
    <header class="site-header">
      <div class="container header-inner">
        <div class="brand">
          <strong>CyberHawks</strong> Admin
          <span class="tag">internal</span>
        </div>
      </div>
    </header>

    <main class="container">
      <section class="card">
        <h2>Administrator Profile</h2>
        <p><strong>Username:</strong> L0rD_admin</p>
        <p><strong>Email:</strong> admin@cyberhawks.com</p>
        <p><strong>Role:</strong> superadmin</p>
        <p class="small-muted">FLAG: <code>CHCTF{4dm1n_d4t4_Br34ch3d_By_0xG0D}	</code></p>
      </section>

      <section class="card" style="margin-top:18px;">
        <h3>Recent Transactions</h3>
        <table style="width:100%; border-collapse:collapse; margin-top:8px;">
          <thead>
            <tr style="text-align:left; color:var(--muted);">
              <th>ID</th><th>User</th><th>Amount</th><th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>TX1001</td><td>alice</td><td>$120.00</td><td>Complete</td></tr>
            <tr><td>TX1002</td><td>bob</td><td>$750.00</td><td>Pending</td></tr>
            <tr><td>TX1003</td><td>charlie</td><td>$12,000.00</td><td>Complete</td></tr>
          </tbody>
        </table>
      </section>

      <section class="card" style="margin-top:18px;">
        <h3>Admin Controls</h3>
        <p>Welcome to the admin area. You can manage users and transactions from here.</p>
      </section>

    </main>

    <footer class="site-footer">
      <div class="container">
        <small>CTF Admin • Do not reuse in production</small>
      </div>
    </footer>
  </body>
  </html>`;

  res.setHeader('Content-Type', 'text/html');
  res.status(200).send(html);
}