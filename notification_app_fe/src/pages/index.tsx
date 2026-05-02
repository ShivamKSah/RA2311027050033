import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Box, Container, Typography, ToggleButtonGroup, ToggleButton, Pagination, Badge } from "@mui/material";
import Navbar from "@/components/Navbar";
import NotificationList from "@/components/NotificationList";
import { useNotifications } from "@/hooks/useNotifications";
import { Log } from "logging-middleware/src";
import { getViewedIds } from "@/state/notificationStore";

const AllNotificationsPage: React.FC = () => {
  const [page, setPage] = useState<number>(1);
  const [typeFilter, setTypeFilter] = useState<string>("All");
  const [unreadCount, setUnreadCount] = useState<number>(0);

  // For unread count, we fetch all notifications without pagination/filter
  // to get the total number of notifications. Then subtract the viewed ones.
  // The API doesn't return total count, so we have to handle it carefully.
  // As a workaround for this specific UI, we'll track the unread count based on the current fetched data.
  
  const { notifications, loading, error } = useNotifications({
    page,
    limit: 10,
    ...(typeFilter !== "All" && { notification_type: typeFilter }),
  });

  useEffect(() => {
    Log("frontend", "info", "page", "All Notifications page loaded");
  }, []);

  useEffect(() => {
    // Calculate unread count for current view
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
      setPage(1); // Reset to first page on filter change
      Log("frontend", "info", "page", `User applied type filter: ${newType}`);
    }
  };

  return (
    <>
      <Head>
        <title>All Notifications | Campus Notifications</title>
      </Head>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={4} flexWrap="wrap" gap={2}>
            <Badge badgeContent={unreadCount} color="error">
              <Typography variant="h4" component="h1">
                All Notifications
              </Typography>
            </Badge>

            <ToggleButtonGroup
              color="primary"
              value={typeFilter}
              exclusive
              onChange={handleFilterChange}
              size="small"
              sx={{ bgcolor: "background.paper" }}
            >
              <ToggleButton value="All">All</ToggleButton>
              <ToggleButton value="Placement">Placement</ToggleButton>
              <ToggleButton value="Result">Result</ToggleButton>
              <ToggleButton value="Event">Event</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          <NotificationList notifications={notifications} loading={loading} error={error} />

          {!loading && !error && notifications.length > 0 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={10} // Assuming 10 pages maximum for demo purposes, API doesn't provide total pages
                page={page}
                onChange={handlePageChange}
                color="primary"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Container>
      </Box>
    </>
  );
};

export default AllNotificationsPage;
