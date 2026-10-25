import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import ProtectedRoute from '@/components/ProtectedRoute'
import Layout from '@/components/Layout'

// Pages
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import SignupPage from '@/pages/SignupPage'
import ResetPasswordPage from '@/pages/ResetPasswordPage'
import OnboardingPage from '@/pages/OnboardingPage'
import DashboardPage from '@/pages/DashboardPage'
import SOSPage from '@/pages/SOSPage'
import ContactsPage from '@/pages/ContactsPage'
import SafeTripPage from '@/pages/SafeTripPage'
import DigitalShieldPage from '@/pages/DigitalShieldPage'
import EvidenceVaultPage from '@/pages/EvidenceVaultPage'
import PrivacyPage from '@/pages/PrivacyPage'
import ResourcesPage from '@/pages/ResourcesPage'
import ProfilePage from '@/pages/ProfilePage'

function AppRoutes() {
  const { isAuthenticated, user } = useAuth()

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route path="/signup" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignupPage />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Onboarding */}
      <Route
        path="/onboarding"
        element={
          <ProtectedRoute>
            <OnboardingPage />
          </ProtectedRoute>
        }
      />

      {/* Protected app routes wrapped in Layout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            {user && !user.onboardingComplete
              ? <Navigate to="/onboarding" replace />
              : <Layout><DashboardPage /></Layout>
            }
          </ProtectedRoute>
        }
      />
      <Route path="/sos" element={<ProtectedRoute><Layout><SOSPage /></Layout></ProtectedRoute>} />
      <Route path="/contacts" element={<ProtectedRoute><Layout><ContactsPage /></Layout></ProtectedRoute>} />
      <Route path="/safe-trip" element={<ProtectedRoute><Layout><SafeTripPage /></Layout></ProtectedRoute>} />
      <Route path="/digital-shield" element={<ProtectedRoute><Layout><DigitalShieldPage /></Layout></ProtectedRoute>} />
      <Route path="/evidence-vault" element={<ProtectedRoute><Layout><EvidenceVaultPage /></Layout></ProtectedRoute>} />
      <Route path="/privacy" element={<ProtectedRoute><Layout><PrivacyPage /></Layout></ProtectedRoute>} />
      <Route path="/resources" element={<ProtectedRoute><Layout><ResourcesPage /></Layout></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><Layout><ProfilePage /></Layout></ProtectedRoute>} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/'} replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}
