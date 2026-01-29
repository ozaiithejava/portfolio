import sqlite3Pkg from 'sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';

const sqlite3 = sqlite3Pkg.verbose();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    // Admin Table
    db.run(`CREATE TABLE IF NOT EXISTS admin (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
    )`);

    // Projects Table
    db.run(`CREATE TABLE IF NOT EXISTS projects (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT,
        description TEXT,
        repo_url TEXT,
        demo_url TEXT,
        tags TEXT,
        stats TEXT,
        "order" INTEGER DEFAULT 0,
        active INTEGER DEFAULT 1
    )`);

    // Text Content Table (for dynamic hero/about texts)
    db.run(`CREATE TABLE IF NOT EXISTS content (
        key TEXT PRIMARY KEY,
        value TEXT
    )`);

    // Seed Admin if not exists
    db.get("SELECT * FROM admin WHERE username = ?", ["admin"], (err, row) => {
        if (!row) {
            const hash = bcrypt.hashSync("admin123", 10);
            db.run("INSERT INTO admin (username, password) VALUES (?, ?)", ["admin", hash]);
            console.log("Admin account created: admin / admin123");
        }
    });

    // Seed Initial Projects
    db.get("SELECT count(*) as count FROM projects", [], (err, row) => {
        if (row && row.count === 0) {
            const initialProjects = [
                {
                    title: "High-Performance Proxy",
                    description: "A custom Netty-based reverse proxy handling 10k+ concurrent connections with <5ms latency.",
                    repo_url: "https://github.com/ozaiithejava/proxy",
                    tags: JSON.stringify(["Java", "Netty", "TCP"]),
                    stats: JSON.stringify({ "CCU": "10k+", "Latency": "2ms" })
                },
                {
                    title: "Game Engine Core",
                    description: "Multi-threaded ECS physics engine for Minecraft functionality implementation.",
                    repo_url: "https://github.com/ozaiithejava/core",
                    tags: JSON.stringify(["Kotlin", "ECS", "Physics"]),
                    stats: JSON.stringify({ "TPS": "20.0", "Entities": "5k+" })
                }
            ];

            // Use serialized execution for safety
            const stmt = db.prepare("INSERT INTO projects (title, description, repo_url, tags, stats) VALUES (?, ?, ?, ?, ?)");
            initialProjects.forEach(p => {
                stmt.run(p.title, p.description, p.repo_url, p.tags, p.stats);
            });
            stmt.finalize();
            console.log("Seeded initial projects.");
        }
    });
});

export default db;
