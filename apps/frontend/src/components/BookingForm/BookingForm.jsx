import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PriceDisplay from '../PriceDisplay';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import { formatDateRange } from '../../utils/dateUtils.js';
import BookingCalendar from '../BookingCalendar';
import styles from './BookingForm.module.css';

const BOOKINGS_API = `${
    import.meta.env.VITE_API_URL || 'http://localhost:4000'
}/api/bookings`;

export default function BookingForm({
    propertyId,
    defaultPrice,
    propertyTitle,
}) {
    const [from, setFrom] = useState('');
    const [to, setTo] = useState('');
    const [guests, setGuests] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const [modal, setModal] = useState({
        open: false,
        title: '',
        content: null,
        actions: [],
    });

    const closeModal = () => setModal((prev) => ({ ...prev, open: false }));

    const handleDateSelect = (selectedFrom, selectedTo) => {
        setFrom(selectedFrom || '');
        setTo(selectedTo || '');
    };

    const invalidDates = useMemo(() => {
        if (!from || !to) return false;
        return new Date(to).getTime() < new Date(from).getTime();
    }, [from, to]);

    const nights = useMemo(() => {
        if (!from || !to) return 0;
        const diffMs = new Date(to).getTime() - new Date(from).getTime();
        if (diffMs <= 0) return 0;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return Math.max(1, diffDays);
    }, [from, to]);

    const total = useMemo(() => {
        if (!nights || !defaultPrice) return 0;
        return nights * Number(defaultPrice);
    }, [nights, defaultPrice]);

    function submit(event) {
        event.preventDefault();
        if (!from || !to) return;
        if (invalidDates || nights === 0) {
            setModal({
                open: true,
                title: 'Ошибка',
                content: (
                    <span className="text-red-600">
                        {invalidDates
                            ? 'Дата выезда не может быть раньше даты заезда.'
                            : 'Нужно выбрать минимум 1 ночь.'}
                    </span>
                ),
                actions: [
                    {
                        label: 'Понятно',
                        onClick: closeModal,
                    },
                ],
            });
            return;
        }

        const pending = {
            propertyId,
            from,
            to,
            guests: Number(guests),
            nights,
            total,
            pricePerNight: Number(defaultPrice),
        };
        setModal({
            open: true,
            title: 'Подтвердите бронирование',
            content: (
                <div className="space-y-1">
                    <div>
                        <b>Объект:</b> {propertyTitle || `#${propertyId}`}
                    </div>
                    <div>
                        <b>Даты:</b> {formatDateRange(from, to)}
                    </div>
                    <div>
                        <b>Гостей:</b> {guests}
                    </div>
                    <div>
                        <b>Ночей:</b> {nights}
                    </div>
                    <div>
                        <b>Итого:</b> <PriceDisplay amount={total} />
                    </div>
                </div>
            ),
            actions: [
                {
                    label: isSubmitting ? 'Создание...' : 'Подтвердить',
                    variant: 'primary',
                    onClick: async () => {
                        setIsSubmitting(true);
                        try {
                            const response = await fetch(BOOKINGS_API, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(pending),
                            });

                            if (!response.ok) {
                                const errorData = await response
                                    .json()
                                    .catch(() => ({
                                        error: `Ошибка ${response.status}: ${response.statusText}`,
                                    }));
                                throw new Error(
                                    errorData.error ||
                                        errorData.details ||
                                        'Ошибка при создании бронирования'
                                );
                            }

                            await response.json();
                            closeModal();

                            setModal({
                                open: true,
                                title: 'Бронирование успешно создано!',
                                content: (
                                    <div className="space-y-2">
                                        <p className="text-green-600 font-medium">
                                            Ваше бронирование подтверждено
                                        </p>
                                        <div className="space-y-1 text-sm">
                                            <div>
                                                <b>Объект:</b>{' '}
                                                {propertyTitle ||
                                                    `#${propertyId}`}
                                            </div>
                                            <div>
                                                <b>Даты:</b>{' '}
                                                {formatDateRange(from, to)}
                                            </div>
                                            <div>
                                                <b>Гостей:</b> {guests}
                                            </div>
                                            <div>
                                                <b>Ночей:</b> {nights}
                                            </div>
                                            <div>
                                                <b>Итого:</b>{' '}
                                                <PriceDisplay amount={total} />
                                            </div>
                                        </div>
                                    </div>
                                ),
                                actions: [
                                    {
                                        label: 'Отлично',
                                        variant: 'primary',
                                        onClick: () => {
                                            closeModal();
                                            setFrom('');
                                            setTo('');
                                            setGuests(1);
                                            navigate('/');
                                        },
                                    },
                                ],
                            });
                        } catch (error) {
                            setModal({
                                open: true,
                                title: 'Ошибка',
                                content: (
                                    <span className="text-red-600">
                                        {error.message ||
                                            'Не удалось создать бронирование'}
                                    </span>
                                ),
                                actions: [
                                    {
                                        label: 'Понятно',
                                        onClick: closeModal,
                                    },
                                ],
                            });
                        } finally {
                            setIsSubmitting(false);
                        }
                    },
                    disabled: isSubmitting,
                },
                {
                    label: 'Изменить',
                    onClick: closeModal,
                    disabled: isSubmitting,
                },
            ],
        });
    }

    return (
        <>
            <form onSubmit={submit} className={styles.form}>
                <div className={styles.datesSection}>
                    <label className={styles.datesLabel}>Даты проживания</label>
                    <BookingCalendar
                        propertyId={propertyId}
                        selectedFrom={from}
                        selectedTo={to}
                        onDateSelect={handleDateSelect}
                    />
                    <div className={styles.datesInputs}>
                        <div className={styles.dateInputGroup}>
                            <label className={styles.dateInputLabel}>
                                Заезд
                            </label>
                            <input
                                id="checkin-date"
                                name="checkin"
                                className={styles.dateInput}
                                type="date"
                                value={from}
                                onChange={(event) => {
                                    setFrom(event.target.value);
                                    if (to && event.target.value > to) {
                                        setTo('');
                                    }
                                }}
                            />
                        </div>
                        <div className={styles.dateInputGroup}>
                            <label className={styles.dateInputLabel}>
                                Выезд
                            </label>
                            <input
                                id="checkout-date"
                                name="checkout"
                                className={styles.dateInput}
                                type="date"
                                value={to}
                                onChange={(event) => {
                                    setTo(event.target.value);
                                }}
                                min={from || undefined}
                            />
                        </div>
                    </div>
                </div>

                <div className={styles.guestsSection}>
                    <label className={styles.guestsLabel}>
                        Количество гостей
                    </label>
                    <input
                        id="guests-count"
                        name="guests"
                        className={styles.guestsInput}
                        type="number"
                        min={1}
                        value={guests}
                        onChange={(event) =>
                            setGuests(Number(event.target.value))
                        }
                    />
                </div>

                {invalidDates && (
                    <div className={styles.errorMessage}>
                        <span className={styles.errorText}>
                            Дата выезда не может быть раньше даты заезда
                        </span>
                    </div>
                )}

                {!invalidDates && nights > 0 && (
                    <div className={styles.bookingInfo}>
                        <div className={styles.bookingRow}>
                            <span className={styles.bookingLabel}>
                                <PriceDisplay amount={defaultPrice} /> ×{' '}
                                {nights}{' '}
                                {nights === 1
                                    ? 'ночь'
                                    : nights < 5
                                    ? 'ночи'
                                    : 'ночей'}
                            </span>
                            <span className={styles.bookingValue}>
                                <PriceDisplay amount={total} />
                            </span>
                        </div>
                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Итого</span>
                            <span className={styles.totalValue}>
                                <PriceDisplay amount={total} />
                            </span>
                        </div>
                    </div>
                )}

                <Button
                    className={styles.submitButton}
                    type="submit"
                    disabled={invalidDates || nights === 0}
                >
                    {nights > 0 ? (
                        <>
                            Забронировать за <PriceDisplay amount={total} />
                        </>
                    ) : (
                        <>Выберите даты для бронирования</>
                    )}
                </Button>

                {nights === 0 && !invalidDates && (
                    <p className={styles.hint}>Выберите даты заезда и выезда</p>
                )}
            </form>
            <Modal
                isOpen={modal.open}
                title={modal.title}
                onClose={closeModal}
                actions={modal.actions}
            >
                {modal.content}
            </Modal>
        </>
    );
}
