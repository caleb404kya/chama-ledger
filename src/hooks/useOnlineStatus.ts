import { useEffect, useState } from 'react';
import { storage } from '../services/storage';

export function useOnlineStatus() {
  const [browserOnline, setBrowserOnline] = useState(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [forcedOffline, setForcedOfflineState] = useState(storage.isForcedOffline());

  useEffect(() => {
    const handleOnline = () => setBrowserOnline(true);
    const handleOffline = () => setBrowserOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Custom listener for forced offline toggle
    const handleStorageChange = () => {
      setForcedOfflineState(storage.isForcedOffline());
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isOnline = browserOnline && !forcedOffline;

  const toggleSimulateOffline = () => {
    const nextVal = !forcedOffline;
    storage.setForcedOffline(nextVal);
    setForcedOfflineState(nextVal);
  };

  return {
    isOnline,
    browserOnline,
    forcedOffline,
    toggleSimulateOffline,
  };
}
