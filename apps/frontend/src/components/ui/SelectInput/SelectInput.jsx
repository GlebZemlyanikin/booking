import styles from './SelectInput.module.css';

export default function SelectInput({
    label,
    value,
    onChange,
    children,
    id,
    className = '',
}) {
    return (
        <label className={`${styles.label} ${className}`}>
            {label && <span className={styles.labelText}>{label}</span>}
            <select
                id={id}
                className={styles.select}
                value={value}
                onChange={(event) => onChange?.(event.target.value)}
            >
                {children}
            </select>
        </label>
    );
}

