import { useState } from 'react';
import PriceDisplay from '../../PriceDisplay';
import Modal from '../../ui/Modal';
import styles from './AdminPropertiesList.module.css';

export default function AdminPropertiesList({ items, onDelete, onEdit }) {
    const [deleteModal, setDeleteModal] = useState({
        open: false,
        property: null,
    });

    const handleDeleteClick = (propertyItem) => {
        setDeleteModal({ open: true, property: propertyItem });
    };

    const handleConfirmDelete = () => {
        if (deleteModal.property) {
            onDelete(deleteModal.property);
            setDeleteModal({ open: false, property: null });
        }
    };

    const handleCancelDelete = () => {
        setDeleteModal({ open: false, property: null });
    };

    return (
        <>
            <div className={styles.grid}>
                {items.map((propertyItem) => (
                    <div key={propertyItem.id} className={styles.card}>
                        <h3 className={styles.title}>{propertyItem.title}</h3>
                        <p className={styles.city}>{propertyItem.address.city}</p>
                        <div className={styles.content}>
                            <div className={styles.price}>
                                <PriceDisplay amount={propertyItem.price} />
                                /ночь
                            </div>
                            <div className={styles.buttons}>
                                {onEdit && (
                                    <button
                                        className={styles.editButton}
                                        onClick={() => onEdit(propertyItem)}
                                    >
                                        Редактировать
                                    </button>
                                )}
                                <button
                                    className={styles.deleteButton}
                                    onClick={() => handleDeleteClick(propertyItem)}
                                >
                                    Удалить
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
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
                <p>
                    Вы уверены, что хотите удалить объект{' '}
                    <strong>"{deleteModal.property?.title}"</strong>?
                </p>
                <p className="text-red-600 mt-2">
                    Это действие нельзя отменить. Все связанные бронирования также
                    будут удалены.
                </p>
            </Modal>
        </>
    );
}

