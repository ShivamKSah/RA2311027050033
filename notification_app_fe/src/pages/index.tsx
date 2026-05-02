import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Box, Container, Typography, ToggleButtonGroup, ToggleButton, Pagination, Badge, Stack, Paper } from "@mui/material";
import Navbar from "@/components/Navbar";
import NotificationList from "@/components/NotificationList";
import { useNotifications } from "@/hooks/useNotifications";
import { Log } from "logging-middleware/src";
import { getViewedIds } from "@/state/notificationStore";

const AllNotificationsPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const { notifications, loading, error } = useNotifications({
    page,
    limit: 10,
    ...(typeFilter !== "All" && { notification_type: typeFilter }),
  });

  useEffect(() => {
    Log("frontend", "info", "page", "All Notifications page loaded");
  }, []);

  useEffect(() => {
    if (notifications.length > 0) {
      const viewedIds = getViewedIds();
      const unread = notifications.filter(n => !viewedIds.includes(n.ID)).length;
      setUnreadCount(unread);
    } else {
      setUnreadCount(0);
    }
  }, [notifications]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    Log("frontend", "info", "page", `User navigated to page number: ${value}`);
  };

  const handleFilterChange = (event: React.MouseEvent<HTMLElement>, newType: string | null) => {
    if (newType !== null) {
      setTypeFilter(newType);
      setPage(1);
      Log("frontend", "info", "page", `User applied type filter: ${newType}`);
    }
  };

  return (
    <>
      <Head>
        <title>All Notifications | Campus Notifications</title>
      </Head>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: { xs: 4, md: 8 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} spacing={3} mb={6}>
            <Box>
              <Badge 
                badgeContent={unreadCount} 
                color="primary" 
                sx={{ 
                  "& .MuiBadge-badge": { 
                    right: -10, 
                    top: 10, 
                    fontSize: "0.8rem", 
                    height: 24, 
                    minWidth: 24, 
                    borderRadius: 12,
                    border: "2px solid #F8FAFC"
                  } 
                }}
              >
                <Typography variant="h3" component="h1" sx={{ color: "text.primary", fontWeight: 800 }}>
                  All Notifications
                </Typography>
              </Badge>
              <Typography variant="subtitle1" sx={{ mt: 1, color: "text.secondary", fontWeight: 500 }}>
                Stay updated with the latest campus activities and announcements.
              </Typography>
            </Box>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 0.5, 
                borderRadius: 4, 
                bgcolor: "rgba(226, 232, 240, 0.4)",
                border: "1px solid rgba(226, 232, 240, 0.8)"
              }}
            >
              <ToggleButtonGroup
                value={typeFilter}
                exclusive
                onChange={handleFilterChange}
                size="small"
                sx={{ 
                  "& .MuiToggleButton-root": { 
                    border: "none",
                    borderRadius: 3,
                    px: 2,
                    fontWeight: 600,
                    color: "text.secondary",
                    "&.Mui-selected": {
                      bgcolor: "white",
                      color: "primary.main",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      "&:hover": {
                        bgcolor: "white",
                      }
                    }
                  } 
                }}
              >
                <ToggleButton value="All">All</ToggleButton>
                <ToggleButton value="Placement">Placement</ToggleButton>
                <ToggleButton value="Result">Result</ToggleButton>
                <ToggleButton value="Event">Event</ToggleButton>
              </ToggleButtonGroup>
            </Paper>
          </Stack>

          <NotificationList notifications={notifications} loading={loading} error={error} />

          {!loading && !error && notifications.length > 0 && (
            <Box display="flex" justifyContent="center" mt={6}>
              <Pagination
                count={10}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontWeight: 600,
                    borderRadius: 2,
                  }
                }}
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default AllNotificationsPage;
