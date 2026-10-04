export function serialize(data) {
  return JSON.stringify(data, null, 2);
}

export function deserialize(jsonStr) {
  try {
    return JSON.parse(jsonStr);
  } catch (err) {
    throw new Error('Invalid JSON format');
  }
}