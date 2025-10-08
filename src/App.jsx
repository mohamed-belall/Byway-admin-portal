import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { Login } from "./pages/login/Login.jsx";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAtom } from "jotai";
import { authAtom } from "./atoms/auth.js";
import Layout from "./components/Layout/Layout.jsx";
import Instructorpage from "./pages/instructor/InstructorPage.jsx";
import Coursepage from "./pages/Course/CoursePage.jsx";
import DashboardPage from "./pages/Dashboard/DashboardPage.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Layout>
                <DashboardPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route
          path="/instructors"
          element={
            <ProtectedRoute>
              <Layout>
                <Instructorpage />
              </Layout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/courses"
          element={
            <ProtectedRoute>
              <Layout>
                <Coursepage />
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
