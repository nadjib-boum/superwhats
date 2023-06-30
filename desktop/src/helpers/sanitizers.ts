export const sanitizePhone = (phone: string): string => {
  return phone.replace(/[-+\)\(\s]/g, "");
};
