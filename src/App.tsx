import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEventNotifications } from "@/hooks/use-event-notifications";
import SkipLink from "@/components/SkipLink";
import BottomNav from "@/components/BottomNav";
import SplashScreen from "@/components/SplashScreen";
import HomePage from "@/pages/HomePage";
import CalendarPage from "@/pages/CalendarPage";
import MapPage from "@/pages/MapPage";
import CommunityPage from "@/pages/CommunityPage";
import ProfilePage from "@/pages/ProfilePage";
import LoginPage from "@/pages/LoginPage";
import HistoryPage from "@/pages/HistoryPage";
import CreateEventPage from "@/pages/CreateEventPage";
import EventDetailPage from "@/pages/EventDetailPage";
import CreatePostPage from "@/pages/CreatePostPage";
import NotificationsPage from "@/pages/NotificationsPage";
import NotificationSettingsPage from "@/pages/NotificationSettingsPage";
import MessagingPage from "@/pages/MessagingPage";
import SettingsPage from "@/pages/SettingsPage";
import StravaPage from "@/pages/StravaPage";
import AdminPage from "@/pages/AdminPage";
import ManageUsersPage from "@/pages/admin/ManageUsersPage";
import ProgramsPage from "@/pages/admin/ProgramsPage";
import MyGroupPage from "@/pages/admin/MyGroupPage";
import CreateUserPage from "@/pages/admin/CreateUserPage";
import ManageAdminsPage from "@/pages/admin/ManageAdminsPage";
import ShareProgramPage from "@/pages/admin/ShareProgramPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Pages where bottom nav should be hidden
const hideNavPages = ['/login', '/create-event', '/create-post', '/settings', '/strava', '/history', '/notifications', '/admin'];

// Protected route component - redirects visitors to login
const RequireAuth = ({ children }: { children: React.ReactNode }) => {
  const { isLoggedIn, isVisitor } = useAuth();
  if (!isLoggedIn && !isVisitor) {
    return <Navigate to="/login" replace />;
  }
  if (isVisitor && !isLoggedIn) {
    return <Navigate to="/calendar" replace />;
  }
  return <>{children}</>;
};

const AppContent = () => {
  const location = useLocation();
  const { isVisitor, isLoggedIn } = useAuth();
  const showNav = !hideNavPages.some(p => location.pathname.startsWith(p))
    && !location.pathname.startsWith('/event/');

  // Initialize event notifications system
  useEventNotifications();

  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      CapApp.addListener('backButton', ({ canGoBack }) => {
        if (canGoBack) {
          window.history.back();
        } else {
          CapApp.exitApp();
        }
      });
    }
  }, []);

  // Redirect visitors from non-allowed pages
  const isAllowedForVisitor = ['/', '/calendar', '/login', '/history'].some(
    path => location.pathname === path || location.pathname.startsWith('/event/')
  );
  
  if (isVisitor && !isLoggedIn && !isAllowedForVisitor) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      <SkipLink />
      <div className="w-full min-h-screen bg-background relative safe-top">
        <main id="main-content" tabIndex={-1}>
          <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/map" element={<RequireAuth><MapPage /></RequireAuth>} />
        <Route path="/community" element={<CommunityPage />} />

        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/create-event" element={<RequireAuth><CreateEventPage /></RequireAuth>} />
        <Route path="/event/:id" element={<EventDetailPage />} />
        <Route path="/create-post" element={<RequireAuth><CreatePostPage /></RequireAuth>} />
        <Route path="/notifications" element={<RequireAuth><NotificationsPage /></RequireAuth>} />
        <Route path="/notifications/settings" element={<RequireAuth><NotificationSettingsPage /></RequireAuth>} />
        <Route path="/messaging" element={<RequireAuth><MessagingPage /></RequireAuth>} />
        <Route path="/settings" element={<RequireAuth><SettingsPage /></RequireAuth>} />
        <Route path="/strava" element={<RequireAuth><StravaPage /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth><AdminPage /></RequireAuth>} />
        <Route path="/admin/users" element={<RequireAuth><ManageUsersPage /></RequireAuth>} />
        <Route path="/admin/create-user" element={<RequireAuth><CreateUserPage /></RequireAuth>} />
        <Route path="/admin/manage-admins" element={<RequireAuth><ManageAdminsPage /></RequireAuth>} />
        <Route path="/admin/programs" element={<RequireAuth><ProgramsPage /></RequireAuth>} />
        <Route path="/admin/share-program" element={<RequireAuth><ShareProgramPage /></RequireAuth>} />
        <Route path="/admin/my-group" element={<RequireAuth><MyGroupPage /></RequireAuth>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </main>
        {showNav && <BottomNav />}
      </div>
    </>
  );
};

const App = () => {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <ThemeProvider>
            {showSplash ? (
              <SplashScreen onFinish={() => setShowSplash(false)} />
            ) : (
              <>
                <Toaster />
                <Sonner />
                <HashRouter>
                  <AppContent />
                </HashRouter>
              </>
            )}
          </ThemeProvider>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
