import { create } from 'zustand';

interface AuthState {
    isLoggedIn: boolean;
    token: string | null;
    savedRecipes: string[];
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    deleteAccount: () => Promise<void>;
    fetchSavedRecipes: () => Promise<void>;
    addSavedRecipe: (recipeId: string) => Promise<void>;
    removeSavedRecipe: (recipeId: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    isLoggedIn: !!localStorage.getItem('allerchef_token'),
    token: localStorage.getItem('allerchef_token'),
    savedRecipes: [],
    login: async (email, password) => {
        const res = await fetch('/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok && data.token) {
            localStorage.setItem('allerchef_token', data.token);
            set({ isLoggedIn: true, token: data.token });
            await get().fetchSavedRecipes();
        } else {
            throw new Error(data.message || 'Login failed');
        }
    },
    register: async (name, email, password) => {
        const res = await fetch('/api/users/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (res.ok && data.token) {
            localStorage.setItem('allerchef_token', data.token);
            set({ isLoggedIn: true, token: data.token });
            await get().fetchSavedRecipes();
        } else {
            throw new Error(data.message || 'Registration failed');
        }
    },
    logout: () => {
        localStorage.removeItem('allerchef_token');
        set({ isLoggedIn: false, token: null, savedRecipes: [] });
    },
    deleteAccount: async () => {
        const token = get().token;
        if (!token) return;
        const res = await fetch('/api/users/delete', {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            localStorage.removeItem('allerchef_token');
            set({ isLoggedIn: false, token: null, savedRecipes: [] });
        } else {
            const data = await res.json();
            throw new Error(data.message || 'Delete failed');
        }
    },
    fetchSavedRecipes: async () => {
        const token = get().token;
        if (!token) return;
        const res = await fetch('/api/users/saved', {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            const data = await res.json();
            console.log('Fetched saved recipes:', data);
            set({ savedRecipes: data });
        } else {
            set({ savedRecipes: [] });
        }
    },
    addSavedRecipe: async (recipeId: string) => {
        const token = get().token;
        if (!token) return;
        console.log('addSavedRecipe called with:', recipeId);
        const res = await fetch('/api/users/saved', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ recipeId }),
        });
        if (res.ok) {
            const data = await res.json();
            console.log('addSavedRecipe response:', data);
            set({ savedRecipes: data });
        }
    },
    removeSavedRecipe: async (recipeId: string) => {
        const token = get().token;
        if (!token) return;
        console.log('removeSavedRecipe called with:', recipeId);
        const res = await fetch(`/api/users/saved/${recipeId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
            const data = await res.json();
            console.log('removeSavedRecipe response:', data);
            set({ savedRecipes: data });
        }
    },
})); 