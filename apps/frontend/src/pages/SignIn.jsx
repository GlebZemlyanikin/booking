import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { loginAdmin } from '../utils/auth.js';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';

export default function SignIn() {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [remember, setRemember] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const nav = useNavigate();
    const location = useLocation();
    const [modalOpen, setModalOpen] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    async function submit(e) {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');

        const ok = await loginAdmin(email, pass, remember);

        if (ok) {
            const redirectTo = location.state?.from || '/admin';
            nav(redirectTo, { replace: true });
        } else {
            setErrorMessage('Неверные учетные данные');
            setModalOpen(true);
        }

        setIsLoading(false);
    }
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Войти</h1>
            <form onSubmit={submit} className="grid grid-cols-1 gap-2 max-w-md">
                <input
                    id="email"
                    name="email"
                    className="input"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={isLoading}
                />
                <input
                    id="password"
                    name="password"
                    className="input"
                    type="password"
                    placeholder="Пароль"
                    value={pass}
                    onChange={(e) => setPass(e.target.value)}
                    required
                    disabled={isLoading}
                />
                <label className="flex items-center gap-2 text-sm text-neutral-600">
                    <input
                        id="remember"
                        name="remember"
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        disabled={isLoading}
                    />
                    Запомнить меня
                </label>
                <Button variant="primary" type="submit" disabled={isLoading}>
                    {isLoading ? 'Вход...' : 'Войти'}
                </Button>
            </form>
            <Modal
                isOpen={modalOpen}
                title="Ошибка входа"
                onClose={() => setModalOpen(false)}
                actions={[
                    { label: 'Понятно', onClick: () => setModalOpen(false) },
                ]}
            >
                {errorMessage}
            </Modal>
        </div>
    );
}
