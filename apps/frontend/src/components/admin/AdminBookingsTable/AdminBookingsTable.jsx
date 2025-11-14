import { useState } from 'react';
import AdminBookingFilters from '../AdminBookingFilters';
import Modal from '../../ui/Modal';
import { formatDateRange } from '../../../utils/dateUtils.js';
import styles from './AdminBookingsTable.module.css';

export default function AdminBookingsTable({
    bookings,
    properties,
    filters,
    setFilters,
    onRemove,
}) {
    const [deleteModal, setDeleteModal] = useState({
        open: false,
        booking: null,
    });

    const handleDeleteClick = (booking) => {
        setDeleteModal({ open: true, booking });
    };

    const handleConfirmDelete = () => {
        if (deleteModal.booking) {
            onRemove(deleteModal.booking);
            setDeleteModal({ open: false, booking: null });
        }
    };

    const handleCancelDelete = () => {
        setDeleteModal({ open: false, booking: null });
    };
    const filtered = bookings.filter((booking) => {
        let propertyIdString;
        if (
            typeof booking.propertyId === 'object' &&
            booking.propertyId !== null &&
            booking.propertyId.id
        ) {
            propertyIdString = String(booking.propertyId.id);
        } else {
            propertyIdString = String(booking.propertyId);
        }

        const foundProperty = properties.find(
            (property) => String(property.id) === propertyIdString
        );
        if (
            filters.city &&
            foundProperty &&
            !foundProperty.address.city
                .toLowerCase()
                .includes(filters.city.toLowerCase())
        )
            return false;
        if (filters.from && new Date(booking.from) < new Date(filters.from))
            return false;
        if (filters.to && new Date(booking.to) > new Date(filters.to))
            return false;
        return true;
    });

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Бронирования</h2>
            <AdminBookingFilters
                filters={filters}
                setFilters={setFilters}
                onReset={() => setFilters({ city: '', from: '', to: '' })}
            />
            {!bookings.length ? (
                <div className={styles.emptyMessage}>Пока нет бронирований</div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead className={styles.thead}>
                            <tr>
                                <th className={styles.th}>Дата создания</th>
                                <th className={styles.th}>Объект</th>
                                <th className={styles.th}>Даты</th>
                                <th className={styles.th}>Гостей</th>
                                <th className={styles.th}>Цена</th>
                                <th className={styles.th}></th>
                            </tr>
                        </thead>
                        <tbody className={styles.tbody}>
                            {filtered.map((booking) => {
                                let propertyIdString;
                                let propertyTitle = null;

                                if (
                                    typeof booking.propertyId === 'object' &&
                                    booking.propertyId !== null &&
                                    booking.propertyId.id
                                ) {
                                    propertyIdString = String(
                                        booking.propertyId.id
                                    );
                                    propertyTitle =
                                        booking.propertyId.title || null;
                                } else {
                                    propertyIdString = String(
                                        booking.propertyId
                                    );
                                }

                                const propertyItem = properties.find(
                                    (property) =>
                                        String(property.id) === propertyIdString
                                );

                                const displayTitle =
                                    propertyTitle ||
                                    propertyItem?.title ||
                                    `Объект #${propertyIdString}`;

                                return (
                                    <tr
                                        key={booking.id || booking.createdAt}
                                        className={styles.tr}
                                    >
                                        <td className={styles.td}>
                                            {booking.createdAt
                                                ? new Date(
                                                      booking.createdAt
                                                  ).toLocaleString('ru-RU')
                                                : '—'}
                                        </td>
                                        <td className={styles.td}>
                                            {displayTitle}
                                        </td>
                                        <td className={styles.td}>
                                            {formatDateRange(
                                                booking.from,
                                                booking.to
                                            )}
                                        </td>
                                        <td className={styles.td}>
                                            {booking.guests}
                                        </td>
                                        <td className={styles.td}>
                                            {booking.total
                                                ? new Intl.NumberFormat(
                                                      'ru-RU'
                                                  ).format(
                                                      Number(booking.total)
                                                  ) + ' ₽'
                                                : '—'}
                                        </td>
                                        <td className={styles.tdActions}>
                                            <button
                                                className={styles.deleteButton}
                                                onClick={() =>
                                                    handleDeleteClick(booking)
                                                }
                                            >
                                                Удалить
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
            <Modal
                isOpen={deleteModal.open}
                title="Подтверждение удаления"
                onClose={handleCancelDelete}
                actions={[
                    {
                        label: 'Удалить',
                        variant: 'accent',
                        onClick: handleConfirmDelete,
                    },
                    {
                        label: 'Отмена',
                        variant: 'secondary',
                        onClick: handleCancelDelete,
                    },
                ]}
            >
                <p>Вы уверены, что хотите удалить это бронирование?</p>
                {deleteModal.booking && (
                    <div className="mt-3 space-y-1 text-sm">
                        <p>
                            <strong>Даты:</strong>{' '}
                            {formatDateRange(
                                deleteModal.booking.from,
                                deleteModal.booking.to
                            )}
                        </p>
                        <p>
                            <strong>Гостей:</strong>{' '}
                            {deleteModal.booking.guests}
                        </p>
                        {deleteModal.booking.total && (
                            <p>
                                <strong>Сумма:</strong>{' '}
                                {new Intl.NumberFormat('ru-RU').format(
                                    Number(deleteModal.booking.total)
                                )}{' '}
                                ₽
                            </p>
                        )}
                    </div>
                )}
                <p className="text-red-600 mt-3">
                    Это действие нельзя отменить.
                </p>
            </Modal>
        </div>
    );
}
