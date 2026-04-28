import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Portfolio from "./components/Portfolio";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { Toaster } from "./components/ui/sonner";
import { ContentProvider } from "./contexts/ContentContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

const RequireAuth = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-[#8a8278]">
        Loading…
      </div>
    );
  }
  if (!user) return <Navigate to="/admin" replace />;
  return children;
};

function App() {
  return (
    <div className="App">
      <ContentProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<div className="grain"><Portfolio /></div>} />
              <Route path="/admin" element={<AdminLogin />} />
              <Route
                path="/admin/dashboard"
                element={
                  <RequireAuth>
                    <AdminDashboard />
                  </RequireAuth>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ContentProvider>
      <Toaster richColors position="bottom-right" theme="dark" />
    </div>
  );
}

export default App;
