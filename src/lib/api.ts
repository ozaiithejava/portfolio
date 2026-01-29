const API_URL = 'http://localhost:3001/api';

export const api = {
    // Auth
    login: async (credentials: any) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials),
        });
        if (!res.ok) throw new Error('Login failed');
        return res.json();
    },

    // Public Data
    getProjects: async () => {
        const res = await fetch(`${API_URL}/projects`);
        if (!res.ok) throw new Error('Failed to fetch projects');
        return res.json();
    },

    getContent: async () => {
        const res = await fetch(`${API_URL}/content`);
        if (!res.ok) throw new Error('Failed to fetch content');
        return res.json();
    },

    // Protected
    createProject: async (token: string, data: any) => {
        const res = await fetch(`${API_URL}/projects`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to create project');
        return res.json();
    },

    updateProject: async (token: string, id: number, data: any) => {
        const res = await fetch(`${API_URL}/projects/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error('Failed to update project');
        return res.json();
    },

    deleteProject: async (token: string, id: number) => {
        const res = await fetch(`${API_URL}/projects/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Failed to delete project');
        return res.json();
    },

    updateContent: async (token: string, key: string, value: string) => {
        const res = await fetch(`${API_URL}/content`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ key, value }),
        });
        if (!res.ok) throw new Error('Failed to update content');
        return res.json();
    }
};
