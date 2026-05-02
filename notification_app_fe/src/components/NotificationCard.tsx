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
  }, [notification.ID]);

  const handleClick = () => {
    if (!viewed) {
      markAsViewed(notification.ID);
      setViewed(true);
      Log("frontend", "info", "component", `Notification marked as viewed, ID=${notification.ID}`);
    }
  };

  const getTypeStyles = () => {
    switch (notification.Type) {
      case "Placement":
        return { color: "#2563EB", bg: "#EFF6FF", border: "#BFDBFE" };
      case "Result":
        return { color: "#059669", bg: "#ECFDF5", border: "#A7F3D0" };
      case "Event":
        return { color: "#D97706", bg: "#FFFBEB", border: "#FDE68A" };
      default:
        return { color: "#4B5563", bg: "#F3F4F6", border: "#E5E7EB" };
    }
  };

  const styles = getTypeStyles();

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
        opacity: viewed ? 0.7 : 1,
        borderLeft: viewed ? "4px solid #E2E8F0" : `4px solid ${styles.color}`,
        backgroundColor: viewed ? "#F8FAFC" : "#FFFFFF",
        mb: 2,
        position: "relative",
        overflow: "hidden",
        "&::after": viewed ? {} : {
          content: '""',
          position: "absolute",
          top: 12,
          right: 12,
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: styles.color,
          boxShadow: `0 0 0 4px ${styles.bg}`,
        }
      }}
    >
      <CardContent sx={{ py: 2.5, "&:last-child": { pb: 2.5 } }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Chip
            label={notification.Type}
            size="small"
            sx={{
              backgroundColor: styles.bg,
              color: styles.color,
              border: `1px solid ${styles.border}`,
              fontWeight: 700,
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          />
          <Typography 
            variant="caption" 
            sx={{ 
              color: "text.secondary",
              fontWeight: 500,
              fontFamily: "'Inter', sans-serif"
            }}
          >
            {formatDate(notification.Timestamp)}
          </Typography>
        </Box>
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: viewed ? 500 : 600, 
            color: viewed ? "text.secondary" : "text.primary",
            fontSize: "1.1rem",
            lineHeight: 1.4,
            fontFamily: "'Inter', sans-serif"
          }}
        >
          {notification.Message}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
