import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";

// =========================================================
// COMPONENTS
// =========================================================

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// =========================================================
// STUDENT PAGES
// =========================================================

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import ApplicationForm from "./pages/ApplicationForm";
import Applications from "./pages/Applications";
import Companies from "./pages/Companies";
import CompanyDetails from "./pages/CompanyDetails";
import Profile from "./pages/Profile";

// =========================================================
// COMPANY PAGES
// =========================================================

import CompanyDashboard from "./pages/company/CompanyDashboard";
import CompanyProfile from "./pages/company/CompanyProfile";
import MyJobs from "./pages/company/MyJobs";
import PostJob from "./pages/company/PostJob";
import CompanyApplications from "./pages/company/CompanyApplications";

// =========================================================
// GLOBAL CSS
// =========================================================

import "./App.css";

// =========================================================
// APP LAYOUT
// =========================================================

function AppLayout() {
  return (
    <div className="app">

      <Navbar />

      <main className="main-content">
        <Outlet />
      </main>

    </div>
  );
}

// =========================================================
// MAIN APP
// =========================================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =================================================
            PUBLIC ROUTES
        ================================================= */}

        <Route
          path="/"
          element={<Dashboard />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        {/* =================================================
            PROTECTED ROUTES
        ================================================= */}

        <Route element={<ProtectedRoute />}>

          <Route element={<AppLayout />}>

            {/* =================================================
                STUDENT ROUTES
            ================================================= */}

            <Route
              path="/jobs"
              element={<Jobs />}
            />

            <Route
              path="/jobs/:id"
              element={<JobDetails />}
            />

            {/* =================================================
                NEW APPLICATION FORM
            ================================================= */}

            <Route
              path="/apply/:jobId"
              element={<ApplicationForm />}
            />

            <Route
              path="/applications"
              element={<Applications />}
            />

            <Route
              path="/companies"
              element={<Companies />}
            />

            <Route
              path="/companies/:id"
              element={<CompanyDetails />}
            />

            <Route
              path="/profile"
              element={<Profile />}
            />

            {/* =================================================
                COMPANY ROUTES
            ================================================= */}

            <Route
              path="/company/dashboard"
              element={<CompanyDashboard />}
            />

            <Route
              path="/company/profile"
              element={<CompanyProfile />}
            />

            <Route
              path="/company/jobs"
              element={<MyJobs />}
            />

            <Route
              path="/company/jobs/create"
              element={<PostJob />}
            />

            <Route
              path="/company/applications"
              element={<CompanyApplications />}
            />

          </Route>

        </Route>

        {/* =================================================
            UNKNOWN URL
        ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/"
              replace
            />
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;