import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Box, Container, Typography, Alert, Stack, Paper } from "@mui/material";
import Navbar from "@/components/Navbar";
import NotificationList from "@/components/NotificationList";
import PriorityInboxFilter from "@/components/PriorityInboxFilter";
import { useNotifications } from "@/hooks/useNotifications";
import { getTopNNotifications } from "@/utils/priorityInbox";
import { ApiNotification } from "@/api/notificationsApi";
import { Log } from "logging-middleware/src";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

const PriorityInboxPage: React.FC = () => {
  const [n, setN] = useState<number>(10);
  const [filterType, setFilterType] = useState<string>("All");
  const [priorityList, setPriorityList] = useState<ApiNotification[]>([]);
  const [isComputing, setIsComputing] = useState<boolean>(false);

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
        const topN = await getTopNNotifications(notifications, validN);
        
        let finalResults = topN;
        if (filterType !== "All") {
          finalResults = topN.filter(notif => notif.Type === filterType);
        }

        if (isMounted) {
          setPriorityList(finalResults);
          Log("frontend", "info", "page", `Priority list computed for top ${validN} notifications`);
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
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 8 }}>
        <Navbar />
        <Container maxWidth="md" sx={{ mt: { xs: 4, md: 8 } }}>
          <Stack spacing={4}>
            <Box>
              <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                <AutoAwesomeIcon color="primary" sx={{ fontSize: 32 }} />
                <Typography variant="h3" component="h1" sx={{ fontWeight: 800 }}>
                  Priority Inbox
                </Typography>
              </Stack>
              <Typography variant="subtitle1" sx={{ color: "text.secondary", fontWeight: 500 }}>
                {isValidN ? `AI-driven priority ranking for your top ${n} notifications.` : "Smart prioritization for your campus life."}
              </Typography>
            </Box>

            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                borderRadius: 4, 
                border: "1px solid rgba(226, 232, 240, 0.8)",
                bgcolor: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.02)"
              }}
            >
              <PriorityInboxFilter
                n={n}
                setN={setN}
                filterType={filterType}
                setFilterType={setFilterType}
              />
            </Paper>

            {!loading && !isComputing && priorityList.length === 0 && notifications.length > 0 && isValidN && (
              <Alert 
                severity="info" 
                variant="outlined"
                sx={{ 
                  borderRadius: 3,
                  borderColor: "rgba(37, 99, 235, 0.1)",
                  bgcolor: "rgba(37, 99, 235, 0.02)",
                  color: "primary.dark",
                  "& .MuiAlert-icon": { color: "primary.main" }
                }}
              >
                No top-{n} notifications match the "{filterType}" filter. Try adjusting your selection.
              </Alert>
            )}

            <NotificationList
              notifications={priorityList}
              loading={loading || isComputing}
              error={error}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

export default PriorityInboxPage;
