const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const api = {
  get: async (path: string) => {
    const res = await fetch(`${API_BASE}${path}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
  post: async (path: string, data: any) => {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  },
};