import React, { useEffect } from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import { ApiNotification } from "@/api/notificationsApi";
import NotificationCard from "./NotificationCard";
import { Log } from "logging-middleware/src";

interface NotificationListProps {
  notifications: ApiNotification[];
  loading: boolean;
  error: string | null;
}

const NotificationList: React.FC<NotificationListProps> = ({
  notifications,
  loading,
  error,
}) => {
  useEffect(() => {
    if (!loading && !error) {
      Log(
        "frontend",
        "debug",
        "component",
        `NotificationList rendered with ${notifications.length} items`
      );
    }
  }, [loading, error, notifications.length]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  if (notifications.length === 0) {
    return (
      <Box textAlign="center" py={5} px={2} bgcolor="#F5F7FA" borderRadius={2}>
        <Typography variant="h6" color="text.secondary">
          No notifications found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {notifications.map((notification) => (
        <NotificationCard key={notification.ID} notification={notification} />
      ))}
    </Box>
  );
};

export default NotificationList;
