
export const generateUUID = (): string => {
  return 'xxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};

export const createIdMapping = (items: any[]): Map<string, string> => {
  const mapping = new Map<string, string>();
  items.forEach(item => {
    if (item.id) {
      const newId = isValidUUID(item.id) ? item.id : generateUUID();
      mapping.set(item.id, newId);
    }
  });
  return mapping;
};
