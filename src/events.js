const listeners = new Map();

export function initEvents() {
  listeners.clear();
}

export function on(event, callback) {
  if (!listeners.has(event)) {
    listeners.set(event, []);
  }
  listeners.get(event).push(callback);
  return () => off(event, callback);
}

export function off(event, callback) {
  if (!listeners.has(event)) return;
  const arr = listeners.get(event).filter(cb => cb !== callback);
  listeners.set(event, arr);
}

export function emit(event, payload) {
  if (!listeners.has(event)) return;
  listeners.get(event).forEach(cb => {
    try {
      cb(payload);
    } catch (err) {
      console.error(`Error in event listener for ${event}:`, err);
    }
  });
}