import styles from './PriceDisplay.module.css';

export default function PriceDisplay({
    amount,
    currency = '₽',
    className = '',
}) {
    const value = Number(amount) || 0;
    const formatted = new Intl.NumberFormat('ru-RU').format(value);
    return (
        <span className={`${styles.price} ${className}`}>
            {formatted} {currency}
        </span>
    );
}

