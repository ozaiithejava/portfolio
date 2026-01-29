import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { api } from '../lib/api';
import { Lock } from 'lucide-react';

export function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await api.login({ username, password });
            localStorage.setItem('token', data.token);
            navigate('/admin');
        } catch (err) {
            setError('Invalid credentials');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-card border border-border rounded-2xl p-8 shadow-2xl"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-3 bg-primary/20 rounded-full">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                </div>
                <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>

                {error && (
                    <div className="bg-destructive/20 text-destructive p-3 rounded-lg mb-4 text-center text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-secondary border border-transparent focus:border-primary focus:outline-none transition-colors"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-secondary border border-transparent focus:border-primary focus:outline-none transition-colors"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-2 bg-primary text-primary-foreground font-bold rounded-lg hover:brightness-110 transition-all"
                    >
                        Login
                    </button>
                </form>
            </motion.div>
        </div>
    );
}
