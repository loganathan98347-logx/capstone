import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/authService";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================

  const user = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  // =========================================================
  // USER INFORMATION
  // =========================================================

  const userName =
    user?.name ||
    localStorage.getItem("userEmail") ||
    "User";

  const userRole =
    user?.role?.toUpperCase() || "STUDENT";

  const isCompany = userRole === "COMPANY";
  const isStudent = userRole === "STUDENT";

  // Display role
  const displayRole = isCompany
    ? "Company"
    : isStudent
      ? "Student"
      : userRole;

  // Avatar initial
  const initial = userName
    .charAt(0)
    .toUpperCase();

  // =========================================================
  // STUDENT NAVIGATION
  // =========================================================

  const studentLinks = [
    {
      to: "/jobs",
      label: "Find Jobs",
      icon: "💼",
    },
    {
      to: "/companies",
      label: "Companies",
      icon: "🏢",
    },
    {
      to: "/applications",
      label: "Applications",
      icon: "📄",
    },
  ];

  // =========================================================
  // COMPANY NAVIGATION
  // =========================================================

  const companyLinks = [
    {
      to: "/company/dashboard",
      label: "Dashboard",
      icon: "📊",
    },
    {
      to: "/company/jobs",
      label: "My Jobs",
      icon: "💼",
    },
    {
      to: "/company/jobs/create",
      label: "Post a Job",
      icon: "➕",
    },
    {
      to: "/company/applications",
      label: "Applications",
      icon: "📄",
    },
  ];

  // =========================================================
  // SELECT NAVIGATION BASED ON ROLE
  // =========================================================

  const navLinks = isCompany
    ? companyLinks
    : studentLinks;

  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = () => {
    logoutUser();

    setMenuOpen(false);

    navigate("/login");
  };

  // =========================================================
  // PROFILE
  // =========================================================

  const handleProfileClick = () => {
    setMenuOpen(false);

    if (isCompany) {
      navigate("/company/profile");
    } else {
      navigate("/profile");
    }
  };

  // =========================================================
  // NOTIFICATIONS
  // =========================================================

  const handleNotificationClick = () => {
    // Notification page will be connected later
    console.log("Notifications clicked");
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <nav className="navbar">

      {/* =====================================================
          LOGO
      ===================================================== */}

      <div
        className="navbar-logo"
        onClick={() =>
          navigate(
            isCompany
              ? "/company/dashboard"
              : "/jobs"
          )
        }
      >

        <div className="navbar-logo-box">
          CC
        </div>

        <div className="navbar-logo-text">

          <strong>
            CampusConnect
          </strong>

          <span>
            Build your future
          </span>

        </div>

      </div>


      {/* =====================================================
          DESKTOP NAVIGATION
      ===================================================== */}

      <div className="navbar-links">

        {navLinks.map((link) => (

          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `navbar-link ${
                isActive ? "active" : ""
              }`
            }
          >

            <span className="navbar-link-icon">
              {link.icon}
            </span>

            <span>
              {link.label}
            </span>

          </NavLink>

        ))}

      </div>


      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="navbar-right">

        {/* ===================================================
            NOTIFICATION
        =================================================== */}

        <button
          className="navbar-notification"
          type="button"
          aria-label="Notifications"
          onClick={handleNotificationClick}
        >

          🔔

          <span className="notification-dot"></span>

        </button>


        {/* ===================================================
            PROFILE
        =================================================== */}

        <button
          className="navbar-profile"
          type="button"
          onClick={handleProfileClick}
          aria-label="Open profile"
        >

          {/* Avatar */}

          <div className="navbar-avatar">
            {initial}
          </div>


          {/* User Information */}

          <div className="navbar-profile-info">

            <span className="navbar-profile-name">
              {userName}
            </span>

            <span className="navbar-profile-role">
              {displayRole}
            </span>

          </div>

        </button>


        {/* ===================================================
            LOGOUT
        =================================================== */}

        <button
          className="navbar-logout"
          type="button"
          onClick={handleLogout}
        >
          Logout
        </button>

      </div>


      {/* =====================================================
          MOBILE MENU BUTTON
      ===================================================== */}

      <button
        className="navbar-menu-button"
        type="button"
        onClick={() =>
          setMenuOpen(!menuOpen)
        }
        aria-label="Toggle menu"
      >
        ☰
      </button>


      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      {menuOpen && (

        <div className="navbar-mobile-menu">

          {/* =================================================
              MOBILE NAVIGATION
          ================================================= */}

          {navLinks.map((link) => (

            <NavLink
              key={link.to}
              to={link.to}
              onClick={() =>
                setMenuOpen(false)
              }
              className={({ isActive }) =>
                `navbar-mobile-link ${
                  isActive ? "active" : ""
                }`
              }
            >

              <span>
                {link.icon}
              </span>

              {link.label}

            </NavLink>

          ))}


          {/* =================================================
              MOBILE PROFILE
          ================================================= */}

          <button
            className="navbar-mobile-profile"
            type="button"
            onClick={handleProfileClick}
          >

            <span>
              👤
            </span>

            <span>
              {isCompany
                ? "Company Profile"
                : "Profile"}
            </span>

          </button>


          {/* =================================================
              MOBILE LOGOUT
          ================================================= */}

          <button
            className="navbar-mobile-logout"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      )}

    </nav>
  );
}

export default Navbar;