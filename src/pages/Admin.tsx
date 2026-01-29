import { useEffect, useState } from 'react';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { Trash, Plus, Save, LogOut } from 'lucide-react';

export function Admin() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState<any[]>([]);
    const [editing, setEditing] = useState<any | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const data = await api.getProjects();
            setProjects(data);
        } catch (e) {
            console.error(e);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure?')) return;
        const token = localStorage.getItem('token') || '';
        await api.deleteProject(token, id);
        loadData();
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token') || '';
        const data = {
            ...editing,
            tags: Array.isArray(editing.tags) ? editing.tags : editing.tags.split(',').map((t: string) => t.trim()),
            stats: typeof editing.stats === 'string' ? JSON.parse(editing.stats) : editing.stats // Simple hack for now
        };

        try {
            if (editing.id) {
                await api.updateProject(token, editing.id, data);
            } else {
                await api.createProject(token, data);
            }
            setEditing(null);
            loadData();
        } catch (err) {
            alert('Error saving project');
        }
    };

    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-5xl mx-auto">
                <header className="flex justify-between items-center mb-10">
                    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                    <button onClick={handleLogout} className="flex items-center gap-2 text-destructive hover:text-destructive/80">
                        <LogOut className="w-5 h-5" /> Logout
                    </button>
                </header>

                {/* Project List */}
                <section className="bg-card border border-border rounded-xl p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold">Projects</h2>
                        <button
                            onClick={() => setEditing({ title: '', description: '', repo_url: '', tags: [], stats: {} })}
                            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg flex items-center gap-2 hover:brightness-110"
                        >
                            <Plus className="w-4 h-4" /> Add Project
                        </button>
                    </div>

                    <div className="space-y-4">
                        {projects.map(p => (
                            <div key={p.id} className="flex justify-between items-center p-4 bg-secondary/20 rounded-lg border border-border">
                                <div>
                                    <h3 className="font-bold">{p.title}</h3>
                                    <p className="text-sm text-muted-foreground">{p.repo_url}</p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditing(p)}
                                        className="px-3 py-1 bg-secondary text-foreground rounded hover:bg-secondary/80"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="px-3 py-1 bg-destructive/20 text-destructive rounded hover:bg-destructive/30"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Edit Modal (Simple Inline) */}
                {editing && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                        <div className="bg-card border border-border p-8 rounded-xl w-full max-w-2xl shadow-2xl overflow-y-auto max-h-[90vh]">
                            <h2 className="text-2xl font-bold mb-6">{editing.id ? 'Edit Project' : 'New Project'}</h2>
                            <form onSubmit={handleSave} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm mb-1">Title</label>
                                        <input
                                            className="w-full p-2 rounded bg-secondary border border-border"
                                            value={editing.title}
                                            onChange={e => setEditing({ ...editing, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Repo URL</label>
                                        <input
                                            className="w-full p-2 rounded bg-secondary border border-border"
                                            value={editing.repo_url}
                                            onChange={e => setEditing({ ...editing, repo_url: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Description</label>
                                    <textarea
                                        className="w-full p-2 rounded bg-secondary border border-border h-24"
                                        value={editing.description}
                                        onChange={e => setEditing({ ...editing, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Tags (comma separated)</label>
                                    <input
                                        className="w-full p-2 rounded bg-secondary border border-border"
                                        value={Array.isArray(editing.tags) ? editing.tags.join(', ') : editing.tags}
                                        onChange={e => setEditing({ ...editing, tags: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm mb-1">Stats (JSON Format)</label>
                                    <input
                                        className="w-full p-2 rounded bg-secondary border border-border font-mono text-sm"
                                        value={typeof editing.stats === 'object' ? JSON.stringify(editing.stats) : editing.stats}
                                        onChange={e => setEditing({ ...editing, stats: e.target.value })}
                                    />
                                </div>

                                <div className="flex justify-end gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => setEditing(null)}
                                        className="px-4 py-2 text-muted-foreground hover:text-foreground"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold"
                                    >
                                        Save
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
