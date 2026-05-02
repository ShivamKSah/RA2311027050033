/**
 * useNotifications Custom Hook
 *
 * Manages the lifecycle of notification data fetching.
 * Handles loading, error, and data states with automatic
 * refetching when parameters change.
 */

"use client";

import { useState, useEffect, useCallback } from "react";
import {
  fetchNotifications,
  NotificationParams,
  ApiNotification,
} from "@/api/notificationsApi";
import { Log } from "logging-middleware/src";

/** Hook return type */
interface UseNotificationsResult {
  notifications: ApiNotification[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

/**
 * Custom hook for fetching and managing notification data.
 *
 * @param params - Query parameters passed to the API
 * @returns Object with notifications data, loading state, error, and refetch function
 */
export function useNotifications(
  params?: NotificationParams
): UseNotificationsResult {
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchNotifications(params);
      setNotifications(data);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(errorMessage);
      await Log(
        "frontend",
        "error",
        "hook",
        `useNotifications encountered fetch error: ${errorMessage}`
      );
    } finally {
      setLoading(false);
    }
  }, [params?.limit, params?.page, params?.notification_type]);

  useEffect(() => {
    Log("frontend", "debug", "hook", "useNotifications hook initialised");
    loadNotifications();
  }, [loadNotifications]);

  return {
    notifications,
    loading,
    error,
    refetch: loadNotifications,
  };
}
