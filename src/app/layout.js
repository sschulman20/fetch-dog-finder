"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation"; // Import usePathname
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
} from "@mui/material";
import { logout } from "./actions/auth";

function Header({ onLogout }) {
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
        <Button color="inherit" component={Link} href="/dashboard">
          Search
        </Button>
        <Button color="inherit" component={Link} href="/favorites">
          Favorites
        </Button>
        {/* Add Logout Button */}
        <Button color="inherit" onClick={onLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default function RootLayout({ children }) {
  const router = useRouter(); // Initialize useRouter here to manage redirection
  const pathname = usePathname(); // Get the current route path

  const handleLogout = async () => {
    await logout(); // Ensure the logout process removes the cookie
    router.push("/"); // Redirect to the homepage after logout
  };

  // Check if the current page is the login page
  const isLoginPage = pathname === "/"; // Adjust the path based on your actual login page

  return (
    <html lang="en">
      <head>
        {/* Add favicon */}
        <link rel="icon" href="/images/icon.png" />
      </head>
      <body>
        {/* Pass the handleLogout function to the Header component */}
        <Header onLogout={handleLogout} />
        {/* Conditionally render the container based on the current route */}
        {isLoginPage ? (
          // Render children directly if on the login page
          <>{children}</>
        ) : (
          // Apply the layout container for other pages
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "100vh",
              backgroundColor: "#f5f5f5", // Light background color for the page
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
                maxWidth: 1200, // Max width to avoid content stretching too wide
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
