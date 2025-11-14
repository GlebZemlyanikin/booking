import { useState } from 'react';
import PriceDisplay from '../components/PriceDisplay';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { formatDateRange } from '../utils/dateUtils.js';
import useProperties from '../hooks/useProperties.js';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';

const BOOKINGS_API = `${
    import.meta.env.VITE_API_URL || 'http://localhost:4000'
}/api/bookings`;

function useQuery() {
    const { search } = useLocation();
    return Object.fromEntries(new URLSearchParams(search));
}

export default function Checkout() {
    const { id } = useParams();
    const q = useQuery();
    const nav = useNavigate();
    const { properties } = useProperties();
    const property = properties.find((prop) => String(prop.id) === String(id));
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    if (!property)
        return <div className="text-neutral-400 py-6">Объект не найден</div>;

    const nights =
        q.from && q.to
            ? Math.max(
                  1,
                  Math.ceil(
                      (new Date(q.to) - new Date(q.from)) /
                          (1000 * 60 * 60 * 24)
                  )
              )
            : 1;
    const total = nights * property.price;

    async function cancelBooking() {
        if (!q.bookingId) return;
        setIsDeleting(true);
        try {
            const response = await fetch(`${BOOKINGS_API}/${q.bookingId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Не удалось отменить бронирование');
            }
            nav(`/property/${property.id}`);
        } catch (error) {
            console.error('Ошибка при отмене бронирования:', error);
            alert('Не удалось отменить бронирование. Попробуйте позже.');
        } finally {
            setIsDeleting(false);
        }
    }

    const handleCancelClick = () => {
        setCancelModalOpen(true);
    };

    const handleConfirmCancel = () => {
        cancelBooking();
        setCancelModalOpen(false);
    };

    const handleCancelModal = () => {
        setCancelModalOpen(false);
    };

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold">Подтверждение бронирования</h1>
            <div className="grid grid-cols-[1fr_320px] gap-4">
                <div className="space-y-2">
                    <h3 className="font-semibold">{property.title}</h3>
                    <p className="text-neutral-400">{property.address.city}</p>
                    <p className="text-neutral-300">
                        Даты: {formatDateRange(q.from, q.to)}
                    </p>
                    <p className="text-neutral-300">Гостей: {q.guests}</p>
                    <p className="text-neutral-200 font-medium">
                        Итого: {nights} ночей ×{' '}
                        <PriceDisplay amount={property.price} /> ={' '}
                        <PriceDisplay amount={total} />
                    </p>
                </div>
                <div className="bg-white border border-neutral-300 rounded-xl p-3 space-y-3 shadow-sm">
                    <Button variant="primary" fullWidth>
                        Подтвердить (мок)
                    </Button>
                    {q.bookingId && (
                        <Button
                            onClick={handleCancelClick}
                            variant="secondary"
                            fullWidth
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Отмена...' : 'Отменить бронирование'}
                        </Button>
                    )}
                    <p className="text-neutral-400 text-sm">
                        Оплата не настроена — учебный проект
                    </p>
                    <Link
                        to={`/property/${property.id}`}
                        className="w-full inline-flex justify-center btn-secondary"
                    >
                        Назад к объекту
                    </Link>
                </div>
            </div>
            <Modal
                isOpen={cancelModalOpen}
                title="Подтверждение отмены бронирования"
                onClose={handleCancelModal}
                actions={[
                    {
                        label: 'Отменить бронирование',
                        variant: 'accent',
                        onClick: handleConfirmCancel,
                    },
                    {
                        label: 'Нет, оставить',
                        variant: 'secondary',
                        onClick: handleCancelModal,
                    },
                ]}
            >
                <p>Вы уверены, что хотите отменить бронирование?</p>
                <div className="mt-3 space-y-1 text-sm">
                    <p>
                        <strong>Объект:</strong> {property.title}
                    </p>
                    <p>
                        <strong>Даты:</strong> {formatDateRange(q.from, q.to)}
                    </p>
                    <p>
                        <strong>Гостей:</strong> {q.guests}
                    </p>
                    <p>
                        <strong>Сумма:</strong> <PriceDisplay amount={total} />
                    </p>
                </div>
                <p className="text-red-600 mt-3">
                    Это действие нельзя отменить.
                </p>
            </Modal>
        </div>
    );
}
