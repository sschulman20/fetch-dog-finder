"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Stack, // Import Stack component from MUI
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { logout } from "./actions/auth";
import { useState } from "react";

function Header({ onLogout, drawerOpen, toggleDrawer, isLoginPage }) {
  const menuItems = (
    <>
      <Button color="inherit" component={Link} href="/dashboard">
        Search
      </Button>
      <Button color="inherit" component={Link} href="/favorites">
        Favorites
      </Button>
      <Button color="inherit" onClick={onLogout}>
        Logout
      </Button>
    </>
  );

  return (
    <AppBar position="static">
      <Toolbar>
        <img
          src="/images/icon.png"
          alt="Dog Finder Icon"
          style={{ width: 30, height: "auto", marginRight: "8px" }}
        />
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Dog Finder
        </Typography>

        {/* Display menu items only if not on the homepage */}
        {!isLoginPage && (
          <>
            {/* Display menu items on desktop */}
            <Box sx={{ display: { xs: "none", sm: "block" } }}>{menuItems}</Box>

            {/* Show MenuIcon for mobile */}
            <IconButton
              color="inherit"
              onClick={toggleDrawer}
              sx={{ display: { xs: "block", sm: "none" } }} // Only show on mobile
            >
              <MenuIcon />
            </IconButton>
          </>
        )}
      </Toolbar>

      {/* Drawer for Mobile Navigation */}
      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer}>
        {/* Stack menu items vertically in the drawer */}
        <Stack direction="column" spacing={2} sx={{ width: 250, padding: 20 }}>
          {!isLoginPage && menuItems}
        </Stack>
      </Drawer>
    </AppBar>
  );
}

export default function RootLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Get theme and media query for responsive design
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Check if screen is mobile

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen); // Toggle drawer visibility
  };

  // Check if the current page is the homepage ("/")
  const isLoginPage = pathname === "/";

  return (
    <html lang="en">
      <head></head>
      <body>
        {/* Pass the handleLogout function and drawer state to Header */}
        <Header
          onLogout={handleLogout}
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
          isLoginPage={isLoginPage} // Pass `isLoginPage` to the Header
        />

        {/* Only display the children without layout when on the root page */}
        {isLoginPage ? (
          <>{children}</>
        ) : (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              backgroundColor: "#f5f5f5",
              padding: 2,
            }}
          >
            <Container
              sx={{
                backgroundColor: "white",
                borderRadius: 2,
                boxShadow: 3,
                padding: 4,
                width: "100%",
                maxWidth: 1200,
              }}
            >
              {children}
            </Container>
          </Box>
        )}
      </body>
    </html>
  );
}
