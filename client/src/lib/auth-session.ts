const SESSION_KEY = "user_login_timestamp";
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export const saveLoginTimestamp = () => {
  localStorage.setItem(SESSION_KEY, Date.now().toString());
};

export const clearLoginTimestamp = () => {
  localStorage.removeItem(SESSION_KEY);
};

export const isSessionExpired = (): boolean => {
  const storedTime = localStorage.getItem(SESSION_KEY);
  if (!storedTime) return false;

  const startTime = parseInt(storedTime, 10);
  const currentTime = Date.now();

  return currentTime - startTime > SEVEN_DAYS_MS;
};
