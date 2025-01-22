// app/dashboard/page.tsx
'use client'

import { useAuth } from '@/contexts/AuthContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import NavigationBar from '@/components/NavigationBar'
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActionArea,
} from '@mui/material'
import {
  Book as BookIcon,
  Assignment as AssignmentIcon,
  Flight as FlightIcon,
  Help as HelpIcon,
} from '@mui/icons-material'
import { useRouter } from 'next/navigation'

const resourceCards = [
  {
    title: 'Study Material',
    icon: <BookIcon sx={{ fontSize: 40 }} />,
    description: 'Access comprehensive study materials and resources for ETOs',
    path: '/study-material',
  },
  {
    title: 'DG Shipping',
    icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
    description: 'Important documents and updates from DG Shipping',
    path: '/dg-shipping',
  },
  {
    title: 'Visa Applications',
    icon: <FlightIcon sx={{ fontSize: 40 }} />,
    description: 'Visa application procedures and requirements',
    path: '/visa',
  },
  {
    title: 'FAQs',
    icon: <HelpIcon sx={{ fontSize: 40 }} />,
    description: 'Frequently asked questions and answers',
    path: '/faqs',
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  return (
    <ProtectedRoute>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <NavigationBar />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            pt: 10,
            pb: 4,
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
          }}
        >
          <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom>
              Welcome, {user?.email}
            </Typography>
            
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="body1">
                Access all your ETO resources in one place. Select a category below to get started.
              </Typography>
            </Paper>

            <Grid container spacing={4}>
              {resourceCards.map((card) => (
                <Grid item xs={12} sm={6} md={3} key={card.title}>
                  <Card 
                    sx={{ height: '100%' }}
                    onClick={() => router.push(card.path)}
                  >
                    <CardActionArea sx={{ height: '100%' }}>
                      <CardContent sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        gap: 2,
                      }}>
                        {card.icon}
                        <Typography gutterBottom variant="h6" component="h2">
                          {card.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {card.description}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ProtectedRoute>
  )
}