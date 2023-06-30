export const serializeSSEChunk = (chunk: any): string => {
  return `data: ${JSON.stringify(chunk)}\n\n`;
};

export const serializePhone = (phone: string): string => {
  return `${phone}@c.us`;
};
