// app/layout.tsx
import { ThemeProvider } from './providers/ThemeProvider'
import { AuthProvider } from '@/contexts/AuthContext'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'ETO Resources Portal',
  description: 'Resource portal for Electro Technical Officers in merchant navy',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  )
}