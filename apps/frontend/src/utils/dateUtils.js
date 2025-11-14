export function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = [
        'января',
        'февраля',
        'марта',
        'апреля',
        'мая',
        'июня',
        'июля',
        'августа',
        'сентября',
        'октября',
        'ноября',
        'декабря',
    ];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
}

export function formatDateRange(from, to) {
    if (!from || !to) return '';
    return `${formatDate(from)} - ${formatDate(to)}`;
}
