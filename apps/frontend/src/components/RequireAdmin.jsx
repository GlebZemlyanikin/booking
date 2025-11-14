import { Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAdmin } from '../utils/auth.js';

export default function RequireAdmin({ children }) {
    const location = useLocation();
    const [checking, setChecking] = useState(true);
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        async function check() {
            const result = await isAdmin();
            setAdmin(result);
            setChecking(false);
        }
        check();
    }, []);

    if (checking) {
        return <div className="text-neutral-400 py-6">Проверка доступа...</div>;
    }

    if (!admin) {
        return (
            <Navigate
                to="/signin"
                replace
                state={{ from: location.pathname }}
            />
        );
    }

    return children;
}
