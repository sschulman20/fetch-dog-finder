"use client";

import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  CircularProgress,
} from "@mui/material";

export default function LoginForm({ onLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onLogin(name, email);
    } catch (error) {
      console.error(error);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="xs" sx={{ mt: 8 }}>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 2,
          borderRadius: 2,
          boxShadow: 3,
          backgroundColor: "white",
        }}
      >
        <img
          src="/images/fetch.png"
          alt="Logo"
          style={{ width: "200px", marginBottom: "16px" }}
        />
        <Typography variant="h5" gutterBottom>
          Dog Finder
        </Typography>
        <TextField
          label="Name"
          variant="outlined"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          variant="outlined"
          type="email"
          fullWidth
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mb: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Login"}
        </Button>
        {error && (
          <Typography
            variant="body2"
            color="error"
            sx={{ textAlign: "center" }}
          >
            {error}
          </Typography>
        )}
      </Box>
    </Container>
  );
}
