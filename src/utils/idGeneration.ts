
// Utility functions for generating valid IDs

export const generateUUID = (): string => {
  return crypto.randomUUID();
};

export const isValidUUID = (id: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
};

export const convertLegacyId = (legacyId: string): string => {
  // Se já é um UUID válido, retorna como está
  if (isValidUUID(legacyId)) {
    return legacyId;
  }
  
  // Gera um novo UUID para IDs legados inválidos
  return generateUUID();
};

export const createIdMapping = (items: any[]): Map<string, string> => {
  const mapping = new Map<string, string>();
  
  items.forEach(item => {
    if (item.id && !isValidUUID(item.id)) {
      mapping.set(item.id, generateUUID());
    }
  });
  
  return mapping;
};
