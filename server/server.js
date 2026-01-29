import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from './db.js';

const app = express();
const PORT = 3001;
const JWT_SECRET = 'dev-secret-key-change-in-prod';

app.use(cors());
app.use(express.json());

// --- Middleware ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- Auth Routes ---
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM admin WHERE username = ?", [username], (err, user) => {
        if (err) return res.status(500).json({ error: err.message });
        if (!user) return res.status(401).json({ error: "Invalid credentials" });

        const passwordValid = bcrypt.compareSync(password, user.password);
        if (!passwordValid) return res.status(401).json({ error: "Invalid credentials" });

        const token = jwt.sign({ username: user.username, id: user.id }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: user.username });
    });
});

// --- Public Data Routes ---
app.get('/api/projects', (req, res) => {
    db.all("SELECT * FROM projects WHERE active = 1 ORDER BY `order` ASC, id DESC", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });

        // Parse JSON fields
        const projects = rows.map(r => ({
            ...r,
            tags: JSON.parse(r.tags || '[]'),
            stats: JSON.parse(r.stats || '{}')
        }));
        res.json(projects);
    });
});

app.get('/api/content', (req, res) => {
    db.all("SELECT * FROM content", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        // Return as object: { 'bio': '...', 'hero': '...' }
        const content = {};
        rows.forEach(r => content[r.key] = r.value);
        res.json(content);
    });
});

// --- Protected Admin Routes ---
app.post('/api/projects', authenticateToken, (req, res) => {
    const { title, description, repo_url, tags, stats } = req.body;
    const sql = "INSERT INTO projects (title, description, repo_url, tags, stats) VALUES (?, ?, ?, ?, ?)";
    const params = [title, description, repo_url, JSON.stringify(tags), JSON.stringify(stats)];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID, ...req.body });
    });
});

app.put('/api/projects/:id', authenticateToken, (req, res) => {
    const { title, description, repo_url, tags, stats, active } = req.body;
    const sql = "UPDATE projects SET title = ?, description = ?, repo_url = ?, tags = ?, stats = ?, active = ? WHERE id = ?";
    const params = [title, description, repo_url, JSON.stringify(tags), JSON.stringify(stats), active, req.params.id];

    db.run(sql, params, function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
    db.run("DELETE FROM projects WHERE id = ?", [req.params.id], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// Update content key-value
app.post('/api/content', authenticateToken, (req, res) => {
    const { key, value } = req.body;
    db.run("INSERT INTO content (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", [key, value], function (err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

// --- Start ---
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
