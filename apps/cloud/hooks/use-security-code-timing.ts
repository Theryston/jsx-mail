import { useState, useEffect } from 'react';
import moment from 'moment';
import { MAX_SECURITY_CODES_PER_HOUR } from '@/utils/constants';

interface SecurityCodeHistory {
  timestamp: number;
  type: 'minute' | 'hour';
}

export function useSecurityCodeTiming() {
  const [canSendCode, setCanSendCode] = useState(true);
  const [timeUntilNext, setTimeUntilNext] = useState<string>('');
  const [history, setHistory] = useState<SecurityCodeHistory[]>([]);
  const [lastSentAt, setLastSentAt] = useState<number | null>(null);
  const [isClearingLastSentAt, setIsClearingLastSentAt] = useState(false);

  useEffect(() => {
    const savedHistory = localStorage.getItem('securityCodeHistory');
    const savedLastSentAt = localStorage.getItem('securityCodeLastSentAt');

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
    if (savedLastSentAt) {
      setLastSentAt(Number(savedLastSentAt));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('securityCodeHistory', JSON.stringify(history));

    if (lastSentAt) {
      localStorage.setItem('securityCodeLastSentAt', lastSentAt.toString());
    } else {
      localStorage.removeItem('securityCodeLastSentAt');
    }
  }, [history, lastSentAt]);

  useEffect(() => {
    const checkTiming = () => {
      if (isClearingLastSentAt) {
        return;
      }

      const now = moment();
      const nextMinute = moment().add(1, 'minute').startOf('minute');
      const nextHour = moment().add(1, 'hour').startOf('hour');

      const oneHourAgo = now.clone().subtract(1, 'hour').valueOf();
      const newHistory = history.filter((h) => h.timestamp > oneHourAgo);
      setHistory(newHistory);

      if (lastSentAt) {
        const lastSentMoment = moment(lastSentAt);
        const minutesSinceLastSent = now.diff(lastSentMoment, 'minutes');
        const hoursSinceLastSent = now.diff(lastSentMoment, 'hours');

        if (minutesSinceLastSent < 1) {
          const secondsUntilNext = nextMinute.diff(now, 'seconds');
          if (secondsUntilNext <= 0) {
            setIsClearingLastSentAt(true);
            setLastSentAt(null);
            setCanSendCode(true);
            setTimeUntilNext('');
            setTimeout(() => setIsClearingLastSentAt(false), 100);
          } else {
            setTimeUntilNext(
              `${Math.floor(secondsUntilNext / 60)}m ${secondsUntilNext % 60}s`,
            );
            setCanSendCode(false);
          }
        } else if (
          hoursSinceLastSent < 1 &&
          newHistory.length >= MAX_SECURITY_CODES_PER_HOUR
        ) {
          const minutesUntilNext = nextHour.diff(now, 'minutes');
          const secondsUntilNext = nextHour.diff(now, 'seconds') % 60;
          if (minutesUntilNext <= 0 && secondsUntilNext <= 0) {
            setIsClearingLastSentAt(true);
            setLastSentAt(null);
            setCanSendCode(true);
            setTimeUntilNext('');
            setTimeout(() => setIsClearingLastSentAt(false), 100);
          } else {
            setTimeUntilNext(`${minutesUntilNext}m ${secondsUntilNext}s`);
            setCanSendCode(false);
          }
        } else {
          setIsClearingLastSentAt(true);
          setLastSentAt(null);
          setCanSendCode(true);
          setTimeUntilNext('');
          setTimeout(() => setIsClearingLastSentAt(false), 100);
        }
      } else {
        setCanSendCode(true);
        setTimeUntilNext('');
      }
    };

    checkTiming();
    const interval = setInterval(checkTiming, 1000);

    return () => clearInterval(interval);
  }, [history, lastSentAt, isClearingLastSentAt]);

  const recordCodeSent = () => {
    const now = moment().valueOf();
    setLastSentAt(now);
    setHistory((prev) => [
      ...prev,
      { timestamp: now, type: 'minute' },
      { timestamp: now, type: 'hour' },
    ]);
  };

  return {
    canSendCode,
    timeUntilNext,
    recordCodeSent,
  };
}
