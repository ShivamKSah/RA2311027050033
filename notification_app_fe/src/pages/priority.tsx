import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import { Box, Container, Typography, Alert } from "@mui/material";
import Navbar from "@/components/Navbar";
import NotificationList from "@/components/NotificationList";
import PriorityInboxFilter from "@/components/PriorityInboxFilter";
import { useNotifications } from "@/hooks/useNotifications";
import { getTopNNotifications, Notification } from "@/utils/priorityInbox";
import { ApiNotification } from "@/api/notificationsApi";
import { Log } from "logging-middleware/src";

const PriorityInboxPage: React.FC = () => {
  const [n, setN] = useState<number>(10);
  const [filterType, setFilterType] = useState<string>("All");
  const [priorityList, setPriorityList] = useState<ApiNotification[]>([]);
  const [isComputing, setIsComputing] = useState<boolean>(false);

  // Fetch ALL notifications (no limit) to compute priority across the entire dataset
  const { notifications, loading, error } = useNotifications();

  useEffect(() => {
    Log("frontend", "info", "page", "Priority Inbox page loaded");
  }, []);

  useEffect(() => {
    let isMounted = true;

    const computePriority = async () => {
      if (notifications.length === 0 || loading || error) return;
      
      const validN = isNaN(n) || n < 1 ? 10 : n;

      setIsComputing(true);
      try {
        // Step 1: Compute top N notifications using the MinHeap algorithm
        const topN = await getTopNNotifications(notifications, validN);
        
        // Step 2: Apply the type filter *after* computing top N
        let finalResults = topN;
        if (filterType !== "All") {
          finalResults = topN.filter(notif => notif.Type === filterType);
        }

        if (isMounted) {
          setPriorityList(finalResults);
          Log("frontend", "info", "page", `Priority list computed for top ${validN} notifications`);
          
          if (finalResults.length === 0 && topN.length > 0) {
            Log("frontend", "warn", "page", "No notifications matched current priority filter");
          }
        }
      } finally {
        if (isMounted) setIsComputing(false);
      }
    };

    computePriority();

    return () => {
      isMounted = false;
    };
  }, [notifications, n, filterType, loading, error]);

  const isValidN = !isNaN(n) && n >= 1 && n <= 50;

  return (
    <>
      <Head>
        <title>Priority Inbox | Campus Notifications</title>
      </Head>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
        <Navbar />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Box mb={4}>
            <Typography variant="h4" component="h1" gutterBottom>
              Priority Inbox
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {isValidN ? `Showing top ${n} notifications by importance` : "Showing priority notifications"}
            </Typography>
          </Box>

          <PriorityInboxFilter
            n={n}
            setN={setN}
            filterType={filterType}
            setFilterType={setFilterType}
          />

          {!loading && !isComputing && priorityList.length === 0 && notifications.length > 0 && isValidN && (
            <Alert severity="warning" sx={{ mb: 3 }}>
              No top-{n} notifications match the "{filterType}" filter. Try changing the filter type.
            </Alert>
          )}

          <NotificationList
            notifications={priorityList}
            loading={loading || isComputing}
            error={error}
          />
        </Container>
      </Box>
    </>
  );
};

export default PriorityInboxPage;
