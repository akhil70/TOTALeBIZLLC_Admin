import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in ms

export function useInactivityLogout() {
  const navigate = useNavigate();
  const timerRef = useRef(null);

  const logout = () => {
    localStorage.clear();
    navigate('/');
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    timerRef.current = setTimeout(() => {
      logout();
    }, INACTIVITY_TIMEOUT);
  };

  const handleActivity = () => {
    resetTimer();
  };

  useEffect(() => {
    // Set initial timer
    resetTimer();

    // Add event listeners
    window.addEventListener('mousedown', handleActivity);
    window.addEventListener('keydown', handleActivity);
    window.addEventListener('touchstart', handleActivity);
    window.addEventListener('scroll', handleActivity);
    window.addEventListener('click', handleActivity);

    // Cleanup
    return () => {
      window.removeEventListener('mousedown', handleActivity);
      window.removeEventListener('keydown', handleActivity);
      window.removeEventListener('touchstart', handleActivity);
      window.removeEventListener('scroll', handleActivity);
      window.removeEventListener('click', handleActivity);

      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [navigate]);
}
