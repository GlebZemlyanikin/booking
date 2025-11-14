import styles from './Modal.module.css';
import Button from '../Button';

export default function Modal({ isOpen, title, children, onClose, actions }) {
    if (!isOpen) return null;
    return (
        <div className={styles.overlay}>
            <button
                type="button"
                className={styles.backdrop}
                onClick={onClose}
                aria-label="Закрыть"
            />
            <div className={styles.modal}>
                {title && <h3 className={styles.title}>{title}</h3>}
                <div className={styles.content}>{children}</div>
                <div className={styles.actions}>
                    {actions?.length ? (
                        actions.map((action, idx) => (
                            <Button
                                key={idx}
                                variant={action.variant || 'secondary'}
                                onClick={action.onClick}
                                type="button"
                            >
                                {action.label}
                            </Button>
                        ))
                    ) : (
                        <Button
                            variant="secondary"
                            onClick={onClose}
                            type="button"
                        >
                            Ок
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}

