export const sleep = (ms: number): Promise<any> => {
  return new Promise((resolve: any) => setTimeout(resolve, ms));
};
