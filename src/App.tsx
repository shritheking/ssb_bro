import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layouts
import { PublicLayout } from './layouts/PublicLayout'
import { StudentLayout } from './layouts/StudentLayout'
import { AdminLayout } from './layouts/AdminLayout'

// Public Pages
import { HomePage } from './pages/public/HomePage'
import { AboutPage } from './pages/public/AboutPage'
import { JourneyPage } from './pages/public/JourneyPage'
import { ProgrammesPage } from './pages/public/ProgrammesPage'
import { ResourcesPage } from './pages/public/ResourcesPage'
import { StoriesPage } from './pages/public/StoriesPage'
import { FaqPage } from './pages/public/FaqPage'
import { ContactPage } from './pages/public/ContactPage'

// Student Pages
import { StudentLoginPage } from './pages/student/StudentLoginPage'
import { StudentDashboardPage } from './pages/student/StudentDashboardPage'
import { StudentProgrammesPage } from './pages/student/StudentProgrammesPage'
import { StudentPracticePage } from './pages/student/StudentPracticePage'
import { StudentAssignmentsPage } from './pages/student/StudentAssignmentsPage'
import { StudentFeedbackPage } from './pages/student/StudentFeedbackPage'
import { StudentProgressPage } from './pages/student/StudentProgressPage'
import { StudentSessionsPage } from './pages/student/StudentSessionsPage'
import { ZoomMeetingPage } from './pages/student/ZoomMeetingPage'
import StudentResourcesPage from './pages/student/StudentResourcesPage'
import { StudentProfilePage } from './pages/student/StudentProfilePage'

// Admin Pages
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { AdminAspirantsPage } from './pages/admin/AdminAspirantsPage'
import { AdminProgrammesPage } from './pages/admin/AdminProgrammesPage'
import { AdminBatchesPage } from './pages/admin/AdminBatchesPage'
import { AdminAssignmentsPage } from './pages/admin/AdminAssignmentsPage'
import { AdminSubmissionsPage } from './pages/admin/AdminSubmissionsPage'
import { AdminFeedbackPage } from './pages/admin/AdminFeedbackPage'
import { AdminSessionsPage } from './pages/admin/AdminSessionsPage'
import AdminResourcesPage from './pages/admin/AdminResourcesPage'
import AdminNotificationsPage from './pages/admin/AdminNotificationsPage'
import AdminSettingsPage from './pages/admin/AdminSettingsPage'

// 404
import NotFoundPage from './pages/NotFoundPage'

// --- Protected Route Guards ---
function StudentRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  if (!auth?.isStudentLoggedIn) return <Navigate to="/student/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  if (!auth?.isAdminLoggedIn) return <Navigate to="/admin/login" replace />
  return <>{children}</>
}

import { ScrollToTop } from './components/common/ScrollToTop'

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
      {/* ── PUBLIC ROUTES ── */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/journey" element={<JourneyPage />} />
        <Route path="/programmes" element={<ProgrammesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/stories" element={<StoriesPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Route>

      {/* ── STUDENT AUTH ── */}
      <Route path="/student/login" element={<StudentLoginPage />} />

      {/* ── STUDENT PORTAL (protected) ── */}
      <Route
        path="/student"
        element={
          <StudentRoute>
            <StudentLayout />
          </StudentRoute>
        }
      >
        <Route index element={<Navigate to="/student/dashboard" replace />} />
        <Route path="dashboard" element={<StudentDashboardPage />} />
        <Route path="programmes" element={<StudentProgrammesPage />} />
        <Route path="practice" element={<StudentPracticePage />} />
        <Route path="assignments" element={<StudentAssignmentsPage />} />
        <Route path="feedback" element={<StudentFeedbackPage />} />
        <Route path="progress" element={<StudentProgressPage />} />
        <Route path="sessions" element={<StudentSessionsPage />} />
        <Route path="resources" element={<StudentResourcesPage />} />
        <Route path="profile" element={<StudentProfilePage />} />
      </Route>

      {/* ── FULL-PAGE DEDICATED LIVE CLASS & MEETING ROOM (MOBILE & DESKTOP) ── */}
      <Route
        path="/student/live-meeting"
        element={
          <StudentRoute>
            <ZoomMeetingPage />
          </StudentRoute>
        }
      />
      <Route
        path="/student/zoom-meeting"
        element={
          <StudentRoute>
            <ZoomMeetingPage />
          </StudentRoute>
        }
      />

      {/* ── ADMIN AUTH ── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />

      {/* ── ADMIN DASHBOARD (protected) ── */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboardPage />} />
        <Route path="aspirants" element={<AdminAspirantsPage />} />
        <Route path="programmes" element={<AdminProgrammesPage />} />
        <Route path="batches" element={<AdminBatchesPage />} />
        <Route path="assignments" element={<AdminAssignmentsPage />} />
        <Route path="submissions" element={<AdminSubmissionsPage />} />
        <Route path="feedback" element={<AdminFeedbackPage />} />
        <Route path="sessions" element={<AdminSessionsPage />} />
        <Route path="resources" element={<AdminResourcesPage />} />
        <Route path="notifications" element={<AdminNotificationsPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>

      {/* ── 404 ── */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </>
  )
}
