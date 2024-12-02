export function saveTimerState(timeLeft) {
  if (typeof window !== 'undefined' && window.localStorage) {
      const expiryTime = Date.now() + timeLeft * 1000;
      localStorage.setItem('2faTimer', expiryTime.toString());
  }
}

export function getStoredTime() {
  if (typeof window !== 'undefined' && window.localStorage) {
      const storedExpiry = localStorage.getItem('2faTimer');
      if (!storedExpiry) return null;

      const expiryTime = parseInt(storedExpiry, 10);
      const now = Date.now();
      const remainingTime = Math.floor((expiryTime - now) / 1000);

      return remainingTime > 0 ? remainingTime : 0;
  }
  return null;
}

// delete the stored time
export function deleteStoredTime() {
  if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('2faTimer');
  }
}
