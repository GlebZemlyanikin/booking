import { useState, useMemo, useCallback, useEffect } from 'react';
import styles from './BookingCalendar.module.css';

const BOOKINGS_API = `${
    import.meta.env.VITE_API_URL || 'http://localhost:4000'
}/api/bookings`;

const MONTH_NAMES = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь',
];
const WEEK_DAYS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const isDatePast = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    return date < today;
};

const getDayClassName = (day) => {
    const classes = [styles.dayBase];
    if (!day.isCurrentMonth) classes.push(styles.dayOtherMonth);
    else if (day.isPast) classes.push(styles.dayPast);
    else if (day.isBooked) classes.push(styles.dayBooked);
    else if (day.isSelected) classes.push(styles.daySelected);
    else if (day.isInRange) classes.push(styles.dayInRange);
    else classes.push(styles.dayAvailable);
    return classes.join(' ');
};

const CalendarHeader = ({ currentMonth, onPrevious, onNext }) => (
    <div className={styles.header}>
        <button
            type="button"
            onClick={onPrevious}
            className={styles.headerButton}
            aria-label="Предыдущий месяц"
        >
            ‹
        </button>
        <h3 className={styles.headerTitle}>
            {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
            type="button"
            onClick={onNext}
            className={styles.headerButton}
            aria-label="Следующий месяц"
        >
            ›
        </button>
    </div>
);

const CalendarDay = ({ day, onClick }) => (
    <button
        type="button"
        className={getDayClassName(day)}
        onClick={() => onClick(day.dateString, day.isSelectable)}
        disabled={!day.isSelectable}
        title={
            day.isBooked
                ? 'Забронировано'
                : day.isPast
                ? 'Прошедшая дата'
                : day.dateString
        }
    >
        {day.date.getDate()}
    </button>
);

const CalendarLegend = () => {
    const legendItems = [
        {
            colorClass: styles.legendColorBooked,
            label: 'Забронировано',
            short: 'Зан.',
        },
        {
            colorClass: styles.legendColorSelected,
            label: 'Выбрано',
            short: 'Выб.',
        },
        {
            colorClass: styles.legendColorRange,
            label: 'Диапазон',
            short: 'Диап.',
        },
    ];

    return (
        <div className={styles.legend}>
            {legendItems.map((item, idx) => (
                <div key={idx} className={styles.legendItem}>
                    <div
                        className={`${styles.legendColor} ${item.colorClass}`}
                    ></div>
                    <span className={styles.legendLabel}>{item.label}</span>
                    <span className={styles.legendLabelShort}>
                        {item.short}
                    </span>
                </div>
            ))}
        </div>
    );
};

export default function BookingCalendar({
    propertyId,
    selectedFrom,
    selectedTo,
    onDateSelect,
}) {
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch(
                    `${BOOKINGS_API}/property/${propertyId}`
                );
                if (response.ok) {
                    const data = await response.json();
                    setBookings(data);
                }
            } catch (error) {
                console.error('Ошибка при загрузке бронирований:', error);
            }
        };

        if (propertyId) {
            fetchBookings();
        }
    }, [propertyId]);

    const bookedDates = useMemo(() => {
        const dates = new Set();
        bookings.forEach((booking) => {
            const start = new Date(booking.from);
            const end = new Date(booking.to);
            const current = new Date(start);
            while (current < end) {
                dates.add(current.toISOString().split('T')[0]);
                current.setDate(current.getDate() + 1);
            }
        });
        return dates;
    }, [bookings]);

    const isDateBooked = useCallback(
        (dateString) => bookedDates.has(dateString),
        [bookedDates]
    );

    const isDateSelectable = useCallback(
        (dateString) => !isDateBooked(dateString) && !isDatePast(dateString),
        [isDateBooked]
    );

    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());

        const days = [];
        const current = new Date(startDate);
        for (let i = 0; i < 42; i++) {
            const dateString = current.toISOString().split('T')[0];
            days.push({
                date: new Date(current),
                dateString,
                isCurrentMonth: current.getMonth() === month,
                isBooked: isDateBooked(dateString),
                isPast: isDatePast(dateString),
                isSelectable: isDateSelectable(dateString),
                isSelected:
                    dateString === selectedFrom || dateString === selectedTo,
                isInRange:
                    selectedFrom &&
                    selectedTo &&
                    dateString >= selectedFrom &&
                    dateString <= selectedTo,
            });
            current.setDate(current.getDate() + 1);
        }
        return days;
    }, [
        currentMonth,
        selectedFrom,
        selectedTo,
        isDateBooked,
        isDateSelectable,
    ]);

    const handleDateClick = useCallback(
        (dateString, isSelectable) => {
            if (!isSelectable) return;
            if (!selectedFrom || (selectedFrom && selectedTo)) {
                onDateSelect(dateString, null);
            } else if (selectedFrom && !selectedTo) {
                if (dateString <= selectedFrom) {
                    onDateSelect(dateString, null);
                } else {
                    const start = new Date(selectedFrom);
                    const end = new Date(dateString);
                    let hasConflict = false;
                    for (
                        let d = new Date(start);
                        d < end;
                        d.setDate(d.getDate() + 1)
                    ) {
                        if (isDateBooked(d.toISOString().split('T')[0])) {
                            hasConflict = true;
                            break;
                        }
                    }
                    if (!hasConflict) onDateSelect(selectedFrom, dateString);
                }
            }
        },
        [selectedFrom, selectedTo, isDateBooked, onDateSelect]
    );

    const goToPreviousMonth = () =>
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
        );
    const goToNextMonth = () =>
        setCurrentMonth(
            new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
        );

    return (
        <div className={styles.calendar}>
            <CalendarHeader
                currentMonth={currentMonth}
                onPrevious={goToPreviousMonth}
                onNext={goToNextMonth}
            />

            <div className={styles.weekDays}>
                {WEEK_DAYS.map((day) => (
                    <div key={day} className={styles.weekDay}>
                        {day}
                    </div>
                ))}
            </div>

            <div className={styles.daysGrid}>
                {calendarDays.map((day, index) => (
                    <CalendarDay
                        key={index}
                        day={day}
                        onClick={handleDateClick}
                    />
                ))}
            </div>

            <CalendarLegend />
        </div>
    );
}
