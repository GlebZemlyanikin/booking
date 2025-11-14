const BOOKINGS_KEY = 'bookings_v1';

export function getBookings() {
    try {
        return JSON.parse(localStorage.getItem(BOOKINGS_KEY) || '[]');
    } catch {
        return [];
    }
}

export function addBooking(booking) {
    const bookings = getBookings();
    bookings.push(booking);
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return booking;
}

export function removeBooking(createdAt) {
    const bookings = getBookings().filter(
        (booking) => booking.createdAt !== createdAt
    );
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    return bookings;
}

export function getBookingsByProperty(propertyId) {
    return getBookings().filter(
        (booking) => String(booking.propertyId) === String(propertyId)
    );
}
