import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { isAdmin, logoutAdmin } from '../../utils/auth.js';
import Button from '../ui/Button';
import styles from './Header.module.css';

export default function Header() {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const [admin, setAdmin] = useState(false);

    useEffect(() => {
        isAdmin().then(setAdmin);
    }, [pathname]);

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                <Link to="/" className={styles.logo}>
                    Booking
                </Link>
                <nav className={styles.nav}>
                    <Link
                        to="/"
                        className={`${styles.navLink} ${
                            pathname === '/'
                                ? styles.navLinkActive
                                : styles.navLinkInactive
                        }`}
                    >
                        Главная
                    </Link>
                    <Link
                        to="/admin"
                        className={`${styles.navLink} ${
                            pathname === '/admin'
                                ? styles.navLinkActive
                                : styles.navLinkInactive
                        }`}
                    >
                        Админ
                    </Link>
                    {admin && (
                        <Button
                            onClick={() => {
                                logoutAdmin();
                                navigate('/');
                            }}
                            className={styles.authButton}
                        >
                            Выйти
                        </Button>
                    )}
                </nav>
            </div>
        </header>
    );
}
