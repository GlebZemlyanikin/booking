export function formatBooking(booking) {
    if (!booking) return null;

    const formatDate = (date) => {
        if (!date) return null;
        const d = new Date(date);
        return d.toISOString().split('T')[0];
    };

    const propertyId = booking.propertyId?._id
        ? {
              id: String(booking.propertyId._id),
              title: booking.propertyId.title,
          }
        : String(booking.propertyId);

    return {
        id: String(booking._id || booking.id),
        propertyId,
        from: formatDate(booking.from),
        to: formatDate(booking.to),
        guests: booking.guests,
        nights: booking.nights,
        total: booking.total,
        pricePerNight: booking.pricePerNight,
        createdAt: booking.createdAt
            ? new Date(booking.createdAt).toISOString()
            : null,
        updatedAt: booking.updatedAt
            ? new Date(booking.updatedAt).toISOString()
            : null,
    };
}
