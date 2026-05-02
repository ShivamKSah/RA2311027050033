import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { ApiNotification } from "@/api/notificationsApi";
import { Log } from "logging-middleware/src";
import { isViewed, markAsViewed } from "@/state/notificationStore";

interface NotificationCardProps {
  notification: ApiNotification;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification }) => {
  const [viewed, setViewed] = useState<boolean>(false);

  useEffect(() => {
    setViewed(isViewed(notification.ID));
    Log(
      "frontend",
      "debug",
      "component",
      `NotificationCard rendered, ID=${notification.ID}, viewed=${isViewed(notification.ID)}`
    );
  }, [notification.ID]);

  const handleClick = () => {
    if (!viewed) {
      markAsViewed(notification.ID);
      setViewed(true);
    }
  };

  const getChipColor = () => {
    switch (notification.Type) {
      case "Placement":
        return "#1565C0";
      case "Result":
        return "#2E7D32";
      case "Event":
        return "#E65100";
      default:
        return "#757575";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <Card
      onClick={handleClick}
      sx={{
        cursor: "pointer",
        opacity: viewed ? 0.55 : 1,
        borderLeft: viewed ? "none" : `4px solid ${getChipColor()}`,
        boxShadow: viewed ? "none" : 2,
        backgroundColor: viewed ? "#F9FAFB" : "#FFFFFF",
        mb: 2,
        position: "relative",
        "&:hover": {
          boxShadow: viewed ? "none" : 4,
          transform: viewed ? "none" : "translateY(-2px)",
        },
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Chip
            label={notification.Type}
            size="small"
            sx={{
              backgroundColor: getChipColor(),
              color: "#FFF",
              fontWeight: "bold",
            }}
          />
          <Typography variant="caption" color="text.secondary">
            {formatDate(notification.Timestamp)}
          </Typography>
        </Box>
        <Typography variant="body1" sx={{ fontWeight: viewed ? 400 : 500, color: "text.primary" }}>
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
