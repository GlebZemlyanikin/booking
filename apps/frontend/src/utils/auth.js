const TOKEN_KEY = 'auth_token';

export function getToken() {
    return (
        localStorage.getItem(TOKEN_KEY) ||
        sessionStorage.getItem(TOKEN_KEY) ||
        null
    );
}

export function setToken(token, remember = false) {
    if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
        sessionStorage.removeItem(TOKEN_KEY);
    } else {
        sessionStorage.setItem(TOKEN_KEY, token);
        localStorage.removeItem(TOKEN_KEY);
    }
}

export function removeToken() {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
}

export async function isAdmin() {
    const token = getToken();
    if (!token) return false;

    try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const response = await fetch(`${API_URL}/api/auth/verify`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
            removeToken();
            return false;
        }

        const data = await response.json();
        return data.user?.role === 'admin';
    } catch {
        removeToken();
        return false;
    }
}

export async function loginAdmin(email, password, remember) {
    try {
        const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';
        const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) return false;

        const data = await response.json();
        setToken(data.token, remember);
        return true;
    } catch {
        return false;
    }
}

export function logoutAdmin() {
    removeToken();
}

export function getAuthHeaders() {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
}
