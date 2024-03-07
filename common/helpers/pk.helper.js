export default function replacePK(payload, pk) {
  if (Array.isArray(payload)) {
    return payload.map((payloadItem) => {
      return replacePK(payloadItem, pk);
    });
  }

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
