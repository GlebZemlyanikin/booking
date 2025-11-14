export function normalizeProperty(p = {}) {
    const id = p.id ?? (p._id ? String(p._id) : undefined);
    return {
        id: id ? String(id) : undefined,
        title: p.title || '',
        address: {
            city: p.address?.city || '',
            street: p.address?.street || '',
        },
        price: Number(p.price) || 0,
        guests: Number(p.guests) || 1,
        rooms: Number(p.rooms) || 1,
        photos: Array.isArray(p.photos) ? p.photos : [],
        description: typeof p.description === 'string' ? p.description : '',
        coords:
            p.coords && typeof p.coords === 'object'
                ? {
                      lat:
                          typeof p.coords.lat === 'number'
                              ? p.coords.lat
                              : undefined,
                      lng:
                          typeof p.coords.lng === 'number'
                              ? p.coords.lng
                              : undefined,
                  }
                : undefined,
    };
}

export function normalizeProperties(list) {
    return Array.isArray(list) ? list.map(normalizeProperty) : [];
}
