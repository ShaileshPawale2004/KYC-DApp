// index.js
require('dotenv').config();
const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const mysql      = require('mysql2/promise');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Create a MySQL connection pool
const pool = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// 1) Customer submits or fetches KYC
app.post('/api/kyc', async (req, res) => {
  const { hash, customerData } = req.body;
  if (!hash || !customerData) {
    return res.status(400).json({ error: 'hash & customerData required' });
  }
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT * FROM kyc_records WHERE document_hash = ?',
      [hash]
    );
    if (rows.length) {
      return res.json({ fromCache: true, record: rows[0] });
    }
    const { name, dob, address, phone } = customerData;
    await conn.query(
      `INSERT INTO kyc_records 
         (document_hash, name, dob, address, phone) 
       VALUES (?, ?, ?, ?, ?)`,
      [hash, name, dob, address, phone]
    );
    const [newRows] = await conn.query(
      'SELECT * FROM kyc_records WHERE document_hash = ?',
      [hash]
    );
    res.json({ fromCache: false, record: newRows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    conn.release();
  }
});

// 2) Bank verifies a KYC
app.post('/api/kyc/verify', async (req, res) => {
  const { hash, bankName } = req.body;
  if (!hash || !bankName) {
    return res.status(400).json({ error: 'hash & bankName required' });
  }
  const conn = await pool.getConnection();
  try {
    const verifiedAt = new Date();
    const [result] = await conn.query(
      `UPDATE kyc_records
         SET bank_verified = 1,
             verified_by   = ?,
             verified_at   = ?
       WHERE document_hash = ?`,
      [bankName, verifiedAt, hash]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No record found for that hash' });
    }
    const [rows] = await conn.query(
      'SELECT * FROM kyc_records WHERE document_hash = ?',
      [hash]
    );
    res.json({ success: true, record: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    conn.release();
  }
});

// 3) Retrieve a KYC record
app.get('/api/kyc/:hash', async (req, res) => {
  const hash = req.params.hash;
  const conn = await pool.getConnection();
  try {
    const [rows] = await conn.query(
      'SELECT * FROM kyc_records WHERE document_hash = ?',
      [hash]
    );
    if (!rows.length) {
      return res.status(404).json({ error: 'No record found' });
    }
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  } finally {
    conn.release();
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`KYC server listening on http://localhost:${PORT}`);
});
