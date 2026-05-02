import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Container } from "@mui/material";
import { useRouter } from "next/router";
import { Log } from "logging-middleware/src";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

const Navbar: React.FC = () => {
  const router = useRouter();
  const [value, setValue] = useState(router.pathname === "/priority" ? 1 : 0);

  useEffect(() => {
    if (router.pathname === "/") {
      setValue(0);
    } else if (router.pathname === "/priority") {
      setValue(1);
    }
  }, [router.pathname]);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    const tabName = newValue === 0 ? "All Notifications" : "Priority Inbox";
    Log("frontend", "info", "component", `Navigation tab changed to: ${tabName}`);
    if (newValue === 0) {
      router.push("/");
    } else {
      router.push("/priority");
    }
  };

  return (
    <AppBar position="sticky">
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ height: 72 }}>
          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, gap: 1.5 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: "12px",
                background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
              }}
            >
              <NotificationsActiveIcon />
            </Box>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 700,
                background: "linear-gradient(135deg, #0F172A 0%, #334155 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Campus Notifications
            </Typography>
          </Box>

          <Box sx={{ display: { xs: "none", md: "block" } }}>
            <Tabs
              value={value}
              onChange={handleChange}
              sx={{
                "& .MuiTab-root": {
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  minHeight: 72,
                  color: "#64748B",
                  "&.Mui-selected": {
                    color: "#2563EB",
                  },
                },
                "& .MuiTabs-indicator": {
                  height: 3,
                  borderRadius: "3px 3px 0 0",
                  backgroundColor: "#2563EB",
                },
              }}
            >
              <Tab label="All Notifications" />
              <Tab label="Priority Inbox" />
            </Tabs>
          </Box>
        </Toolbar>
      </Container>
      
      {/* Mobile Tabs */}
      <Box sx={{ display: { xs: "block", md: "none" }, borderTop: "1px solid rgba(226, 232, 240, 0.8)" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              fontWeight: 600,
              color: "#64748B",
              "&.Mui-selected": {
                color: "#2563EB",
              },
            },
          }}
        >
          <Tab label="All Notifications" />
          <Tab label="Priority Inbox" />
        </Tabs>
      </Box>
    </AppBar>
  );
};

export default Navbar;
