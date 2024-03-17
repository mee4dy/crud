export function replacePK(payload, pk) {
  if (typeof payload === 'string') {
    if (payload.includes(':pk')) {
      payload = payload.replace(':pk', pk);
    }

    if (payload === 'pk') {
      payload = pk;
    }
  }

  if (typeof payload === 'object') {
    if (payload.key === 'pk') {
      payload.key = pk;
    }

    if (payload.field === 'pk') {
      payload.field = pk;
    }
  }

  return payload;
}

export function replacePKItems(items, pk) {
  if (!Array.isArray(items)) {
    return items;
  }

  return items.map((item) => {
    item.pk = item[pk];

    return item;
  });
}
