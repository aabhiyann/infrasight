import { useEffect, useRef, useState } from "react";

interface UseAutoRefreshOptions {
  intervalMs?: number;
  enabled?: boolean;
  onRefresh: () => void | Promise<void>;
}

export function useAutoRefresh({
  intervalMs = 300000, // 5 minutes default
  enabled = true,
  onRefresh,
}: UseAutoRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const intervalRef = useRef<number | null>(null);

  const refresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);
    try {
      await onRefresh();
      setLastRefresh(new Date());
    } catch (error) {
      console.error("Auto-refresh failed:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const manualRefresh = () => {
    refresh();
  };

  useEffect(() => {
    if (!enabled) return;

    intervalRef.current = setInterval(refresh, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [enabled, intervalMs, onRefresh]);

  return {
    isRefreshing,
    lastRefresh,
    manualRefresh,
  };
}
