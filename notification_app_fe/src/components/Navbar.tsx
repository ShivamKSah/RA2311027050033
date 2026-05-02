import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from "@mui/material";
import { useRouter } from "next/router";
import { Log } from "logging-middleware/src";

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
    <AppBar position="sticky" color="primary" elevation={2}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Campus Notifications
        </Typography>
        <Box sx={{ display: { xs: "none", md: "block" } }}>
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="All Notifications" />
            <Tab label="Priority Inbox" />
          </Tabs>
        </Box>
      </Toolbar>
      <Box sx={{ display: { xs: "block", md: "none" }, bgcolor: "primary.dark" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          textColor="inherit"
          indicatorColor="secondary"
          variant="fullWidth"
        >
          <Tab label="All Notifications" />
          <Tab label="Priority Inbox" />
        </Tabs>
      </Box>
    </AppBar>
  );
};

export default Navbar;
