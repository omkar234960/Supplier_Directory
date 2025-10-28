const express = require('express');
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const DB_PATH = path.join(__dirname, 'database.sqlite');
const db = new sqlite3.Database(DB_PATH);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Initialize DB: suppliers + messages
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS suppliers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      email TEXT,
      phone TEXT,
      whatsapp TEXT,
      location TEXT,
      rating REAL DEFAULT 4.0,
      products TEXT,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      supplier_id INTEGER NOT NULL,
      method TEXT NOT NULL,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (supplier_id) REFERENCES suppliers(id) ON DELETE CASCADE
    )
  `);

  // Insert sample suppliers if table empty
  db.get(`SELECT COUNT(*) as cnt FROM suppliers`, (err, row) => {
    if (err) {
      console.error('DB count error', err);
      return;
    }
    if (row && row.cnt === 0) {
      const stmt = db.prepare(`
        INSERT INTO suppliers (name, category, email, phone, whatsapp, location, rating, products, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const sample = [
        ['Apex Electronics','Electronics','apex@example.com','+919900000001','919900000001','Mumbai, India',4.5,'Resistors, Capacitors','Reliable supplier'],
        ['Textile House','Textiles','textile@example.com','+919900000002','919900000002','Delhi, India',4.2,'Cotton Fabric, Threads','Fast delivery'],
        ['MetalWorks','Metals','metal@example.com','+919900000003','919900000003','Pune, India',4.0,'Steel Sheets, Rods','Bulk discounts']
      ];

      for (const s of sample) stmt.run(...s);
      stmt.finalize(() => console.log('Inserted sample suppliers'));
    }
  });
});

// Helper: run SQL and return Promise
function runAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve(this);
    });
  });
}

function allAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
}

function getAsync(sql, params = []) {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
}

/** Routes root base: /api **/
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

/**
 * GET /api/suppliers
 * optional query: ?search=... & category=...
 */
app.get('/api/suppliers', async (req, res) => {
  try {
    const { search = '', category = '' } = req.query;
    let sql = 'SELECT * FROM suppliers';
    const params = [];

    if (search && category && category !== 'All') {
      sql += ' WHERE (name LIKE ? OR products LIKE ? OR location LIKE ?) AND category = ?';
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern, category);
    } else if (search) {
      sql += ' WHERE name LIKE ? OR products LIKE ? OR location LIKE ?';
      const pattern = `%${search}%`;
      params.push(pattern, pattern, pattern);
    } else if (category && category !== 'All') {
      sql += ' WHERE category = ?';
      params.push(category);
    }

    sql += ' ORDER BY rating DESC, name ASC';

    const rows = await allAsync(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load suppliers' });
  }
});

/** GET supplier by id **/
app.get('/api/suppliers/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const row = await getAsync('SELECT * FROM suppliers WHERE id = ?', [id]);
    if (!row) return res.status(404).json({ error: 'Supplier not found' });
    res.json(row);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch supplier' });
  }
});

/** CREATE supplier **/
app.post('/api/suppliers', async (req, res) => {
  try {
    const {
      name, category, email, phone, whatsapp, location, rating = 4.0, products = '', notes = ''
    } = req.body;

    if (!name) return res.status(400).json({ error: 'Name required' });

    const result = await runAsync(
      `INSERT INTO suppliers (name, category, email, phone, whatsapp, location, rating, products, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [name, category, email, phone, whatsapp, location, rating, products, notes]
    );

    const newId = result.lastID;
    const newRow = await getAsync('SELECT * FROM suppliers WHERE id = ?', [newId]);
    res.status(201).json(newRow);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create supplier' });
  }
});

/** UPDATE supplier **/
app.put('/api/suppliers/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const {
      name, category, email, phone, whatsapp, location, rating = 4.0, products = '', notes = ''
    } = req.body;

    const exists = await getAsync('SELECT id FROM suppliers WHERE id = ?', [id]);
    if (!exists) return res.status(404).json({ error: 'Supplier not found' });

    await runAsync(
      `UPDATE suppliers SET name = ?, category = ?, email = ?, phone = ?, whatsapp = ?, location = ?, rating = ?, products = ?, notes = ? WHERE id = ?`,
      [name, category, email, phone, whatsapp, location, rating, products, notes, id]
    );

    const updated = await getAsync('SELECT * FROM suppliers WHERE id = ?', [id]);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update supplier' });
  }
});

/** DELETE supplier **/
app.delete('/api/suppliers/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    await runAsync('DELETE FROM suppliers WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete supplier' });
  }
});

/** CONTACT supplier — store message in messages table (C1) **/
app.post('/api/suppliers/:id/contact', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const supplier = await getAsync('SELECT id FROM suppliers WHERE id = ?', [id]);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

    const { method = 'email', message = '' } = req.body;
    await runAsync(
      'INSERT INTO messages (supplier_id, method, message) VALUES (?, ?, ?)',
      [id, method, message]
    );

    res.json({ success: true, msg: 'Message saved' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

/** GET messages for supplier (optional, handy for debug) **/
app.get('/api/suppliers/:id/messages', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const rows = await allAsync('SELECT * FROM messages WHERE supplier_id = ? ORDER BY created_at DESC', [id]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load messages' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
