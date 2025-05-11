import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ConfigProvider } from "antd";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

// Components
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
        },
      }}
    >
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Redirect fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ConfigProvider>
  );
};

export default App;
