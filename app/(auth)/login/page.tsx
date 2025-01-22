// app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Divider,
} from '@mui/material'
import { Google as GoogleIcon } from '@mui/icons-material'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signInWithEmail, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signInWithEmail(email, password)
    } catch (error) {
      console.error('Error signing in:', error)
      // Add error handling here
    }
  }

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          marginTop: 8,
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          
          <Divider sx={{ my: 2 }}>or</Divider>
          
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            onClick={signInWithGoogle}
            sx={{ mb: 2 }}
          >
            Sign in with Google
          </Button>
          
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link href="/register" style={{ textDecoration: 'none' }}>
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}