export type ShouldRetryHandler = (
  response: Response | null,
  retryNumber: number,
) => Promise<boolean>;

export const defaultShouldRetryHandler: ShouldRetryHandler = async (
  response: Response | null,
  retryNumber: number,
) => {
  if (response === null) return false;
  if (retryNumber > 2) return false;
  return response.status >= 400 && response.status < 500;
};
