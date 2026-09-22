import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter email and password");
      return;
    }

    setLoading(true);

    try {
      const response = await loginUser({
        email: email.trim(),
        password,
      });

      console.log("Login response:", response);
      console.log("User role:", response?.role);

      // ==========================================
      // SAVE LOGIN INFORMATION
      // ==========================================

      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userEmail", response.email || email.trim());
      localStorage.setItem("user", JSON.stringify(response));

      // ==========================================
      // ROLE-BASED REDIRECTION
      // ==========================================

      const role = response?.role?.toUpperCase();

      if (role === "COMPANY") {
        // Company goes to company dashboard
        navigate("/company/dashboard");
      } else if (role === "STUDENT") {
        // Student goes to Find Jobs
        navigate("/jobs");
      } else {
        // Unknown role
        console.warn("Unknown user role:", response?.role);

        alert(
          "Login successful, but your account role is missing or invalid."
        );

        navigate("/");
      }

    } catch (error) {
      console.error("Login error:", error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Login failed. Please check your email and password.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ================= LEFT ================= */}

      <div className="login-left">

        <div className="left-content">

          {/* Logo */}

          <div className="campus-logo">

            <div className="logo-box">
              C
            </div>

            <div className="logo-text">
              Campus<span>Connect</span>
            </div>

          </div>


          {/* Hero */}

          <div className="hero-text">

            <div className="hero-label">
              CAMPUSCONNECT
            </div>

            <h1>
              Find your next
              <br />
              <span>OPPORTUNITY.</span>
            </h1>

            <p>
              Discover internships, jobs and career
              opportunities built for students and freshers.
            </p>

          </div>


          {/* Red Line */}

          <div className="red-line"></div>


          {/* Statistics */}

          <div className="stats">

            <div className="stat">
              <strong>10K+</strong>
              <span>Students</span>
            </div>

            <div className="stat">
              <strong>2K+</strong>
              <span>Opportunities</span>
            </div>

            <div className="stat">
              <strong>5K+</strong>
              <span>Companies</span>
            </div>

          </div>

        </div>

      </div>


      {/* ================= RIGHT ================= */}

      <div className="login-right">

        <div className="glass-card">

          {/* Header */}

          <div className="login-header">

            <div className="welcome-label">
              WELCOME BACK
            </div>

            <h2>
              Sign in
            </h2>

            <p>
              Log in to continue your journey.
            </p>

          </div>


          {/* Login Form */}

          <form onSubmit={handleLogin}>

            {/* Email */}

            <div className="form-group">

              <label htmlFor="email">
                Email
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />

            </div>


            {/* Password */}

            <div className="form-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="password-wrapper">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
                />

                <button
                  type="button"
                  className="show-password"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  disabled={loading}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* Login Button */}

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? "Signing in..." : "Sign in"}

              {!loading && (
                <span>→</span>
              )}

            </button>

          </form>


          {/* Register */}

          <div className="register-area">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account →
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Login;