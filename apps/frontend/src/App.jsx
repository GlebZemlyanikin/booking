import { Routes, Route } from 'react-router-dom';
import { YMaps } from '@pbe/react-yandex-maps';
import Header from './components/Header';
import Home from './pages/Home.jsx';
import PropertyDetails from './pages/PropertyDetails/PropertyDetails.jsx';
import Checkout from './pages/Checkout.jsx';
import SignIn from './pages/SignIn.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import RequireAdmin from './components/RequireAdmin.jsx';

export default function App() {
    return (
        <YMaps
            query={{
                lang: 'ru_RU',
                apikey: import.meta.env.VITE_YANDEX_MAPS_API_KEY,
            }}
        >
            <div className="min-h-dvh flex flex-col bg-neutral-50 text-neutral-900">
                <Header />
                <main className="container mx-auto max-w-6xl px-4 py-6 grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/property/:id"
                            element={<PropertyDetails />}
                        />
                        <Route path="/checkout/:id" element={<Checkout />} />
                        <Route path="/signin" element={<SignIn />} />
                        <Route
                            path="/admin"
                            element={
                                <RequireAdmin>
                                    <AdminDashboard />
                                </RequireAdmin>
                            }
                        />
                    </Routes>
                </main>
                <footer className="border-t border-neutral-200 py-6 text-center text-neutral-500">
                    © {new Date().getFullYear()} Booking
                </footer>
            </div>
        </YMaps>
    );
}
