import { useState } from 'react';
import Modal from '../Modal';
import styles from './PhotoPreviewGrid.module.css';

export default function PhotoPreviewGrid({ value, onRemove }) {
    const [deleteModal, setDeleteModal] = useState({
        open: false,
        url: null,
    });

    const urls = (value || '')
        .split(/[\n,]/)
        .map((segment) => segment.trim())
        .filter(Boolean);

    const handleDeleteClick = (url) => {
        setDeleteModal({ open: true, url });
    };

    const handleConfirmDelete = () => {
        if (deleteModal.url) {
            onRemove?.(deleteModal.url);
            setDeleteModal({ open: false, url: null });
        }
    };

    const handleCancelDelete = () => {
        setDeleteModal({ open: false, url: null });
    };

    if (!urls.length) return null;

    return (
        <>
            <div className={styles.grid}>
                {urls.map((url) => (
                    <div
                        key={url}
                        className={styles.item}
                    >
                        <img
                            src={url}
                            alt="preview"
                            className={styles.image}
                        />
                        <button
                            type="button"
                            className={styles.removeButton}
                            onClick={() => handleDeleteClick(url)}
                        >
                            Удалить
                        </button>
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
                    Вы уверены, что хотите удалить это фото?
                </p>
                {deleteModal.url && (
                    <div className="mt-3">
                        <img
                            src={deleteModal.url}
                            alt="preview"
                            className="max-w-xs max-h-48 rounded-lg border border-gray-200"
                        />
                    </div>
                )}
            </Modal>
        </>
    );
}

