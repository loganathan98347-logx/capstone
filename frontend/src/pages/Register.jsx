import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import api from "../services/api";

import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
    companyName: "",
    college: "",
    graduationYear: "",
    cgpa: "",
  });

  const [otp, setOtp] = useState("");

  // ==========================================
  // INPUT CHANGE
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  };

  // ==========================================
  // REGISTER
  // ==========================================

  const handleRegister = async (e) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.role
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must contain at least 6 characters.");
      return;
    }

    // COMPANY VALIDATION
    if (
      formData.role === "COMPANY" &&
      !formData.companyName.trim()
    ) {
      alert("Please enter your company name.");
      return;
    }

    // STUDENT VALIDATION
    if (formData.role === "STUDENT") {
      if (!formData.college.trim()) {
        alert("Please enter your college name.");
        return;
      }

      if (!formData.graduationYear) {
        alert("Please enter your graduation year.");
        return;
      }

      if (
        formData.cgpa === "" ||
        Number(formData.cgpa) < 0 ||
        Number(formData.cgpa) > 10
      ) {
        alert("CGPA must be between 0 and 10.");
        return;
      }
    }

    setLoading(true);

    try {
      const response = await registerUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,

        companyName:
          formData.role === "COMPANY"
            ? formData.companyName.trim()
            : "",

        college:
          formData.role === "STUDENT"
            ? formData.college.trim()
            : "",

        graduationYear:
          formData.role === "STUDENT"
            ? formData.graduationYear
            : "",

        cgpa:
          formData.role === "STUDENT"
            ? formData.cgpa
            : "",
      });

      console.log("Registration response:", response);

      alert(
        "OTP sent successfully to your email. Please check your inbox."
      );

      setStep(2);

    } catch (error) {
      console.error("Registration error:", error);

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Unable to send OTP. Please try again.";

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VERIFY OTP
  // ==========================================

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!otp) {
      alert("Please enter the OTP.");
      return;
    }

    if (!/^[0-9]{6}$/.test(otp)) {
      alert("OTP must contain exactly 6 digits.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/auth/verify-otp",
        {
          email: formData.email.trim(),
          otp: otp,
        }
      );

      console.log(
        "Email OTP verification response:",
        response.data
      );

      alert(
        "Email verified successfully! Registration completed."
      );

      navigate("/login");

    } catch (error) {
      console.error(
        "Email OTP verification error:",
        error
      );

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Invalid or expired OTP. Please try again.";

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // BACK
  // ==========================================

  const handleBackToRegistration = () => {
    setStep(1);
    setOtp("");
  };

  return (
    <div className="register-page">

      {/* =================================================
          LEFT SIDE
      ================================================= */}

      <section className="register-left">

        <div className="register-left-content">

          {/* LOGO */}

          <div className="register-brand">

            <div className="register-logo-box">
              C
            </div>

            <div className="register-logo-text">
              Campus<span>Connect</span>
            </div>

          </div>

          {/* HERO */}

          <div className="register-hero">

            <div className="register-label">
              CAMPUSCONNECT
            </div>

            <h1>
              Build your
              <br />
              <span>OPPORTUNITY.</span>
            </h1>

            <p>
              Create your profile and discover internships,
              jobs and career opportunities built for students
              and freshers.
            </p>

            <div className="register-red-line"></div>

            {/* STATS */}

            <div className="register-stats">

              <div>
                <strong>10K+</strong>
                <span>STUDENTS</span>
              </div>

              <div>
                <strong>2K+</strong>
                <span>OPPORTUNITIES</span>
              </div>

              <div>
                <strong>5K+</strong>
                <span>COMPANIES</span>
              </div>

            </div>

          </div>

        </div>

      </section>


      {/* =================================================
          RIGHT SIDE
      ================================================= */}

      <section className="register-right">

        {/* GLASS LAYER */}

        <div className="register-glass">

          {step === 1 ? (

            <>
              {/* HEADER */}

              <div className="register-header">

                <div className="register-welcome">
                  CREATE ACCOUNT
                </div>

                <h2>
                  Join CampusConnect
                </h2>

                <p>
                  Start building your career journey.
                </p>

              </div>


              {/* FORM */}

              <form
                className="register-form"
                onSubmit={handleRegister}
              >

                {/* FULL NAME */}

                <div className="register-form-group">

                  <label>
                    Full Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={loading}
                  />

                </div>


                {/* EMAIL */}

                <div className="register-form-group">

                  <label>
                    Email *
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    disabled={loading}
                  />

                  <small>
                    OTP will be sent to your email.
                  </small>

                </div>


                {/* PASSWORD */}

                <div className="register-form-group">

                  <label>
                    Password *
                  </label>

                  <div className="register-password-wrapper">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={loading}
                    />

                    <button
                      type="button"
                      className="register-show-password"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                      disabled={loading}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                </div>


                {/* ACCOUNT TYPE */}

                <div className="register-form-group">

                  <label>
                    Account Type *
                  </label>

                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    disabled={loading}
                  >

                    <option value="STUDENT">
                      Student
                    </option>

                    <option value="COMPANY">
                      Company
                    </option>

                  </select>

                </div>


                {/* STUDENT */}

                {formData.role === "STUDENT" && (
                  <>

                    <div className="register-form-group">

                      <label>
                        College *
                      </label>

                      <input
                        type="text"
                        name="college"
                        placeholder="Enter your college"
                        value={formData.college}
                        onChange={handleChange}
                        disabled={loading}
                      />

                    </div>


                    <div className="register-row">

                      <div className="register-form-group">

                        <label>
                          Graduation Year *
                        </label>

                        <input
                          type="number"
                          name="graduationYear"
                          placeholder="2028"
                          min="2020"
                          max="2100"
                          value={formData.graduationYear}
                          onChange={handleChange}
                          disabled={loading}
                        />

                      </div>


                      <div className="register-form-group">

                        <label>
                          CGPA *
                        </label>

                        <input
                          type="number"
                          name="cgpa"
                          placeholder="8.5"
                          min="0"
                          max="10"
                          step="0.01"
                          value={formData.cgpa}
                          onChange={handleChange}
                          disabled={loading}
                        />

                      </div>

                    </div>

                  </>
                )}


                {/* COMPANY */}

                {formData.role === "COMPANY" && (

                  <div className="register-form-group">

                    <label>
                      Company Name *
                    </label>

                    <input
                      type="text"
                      name="companyName"
                      placeholder="Enter company name"
                      value={formData.companyName}
                      onChange={handleChange}
                      disabled={loading}
                    />

                  </div>

                )}


                {/* BUTTON */}

                <button
                  type="submit"
                  className="register-button"
                  disabled={loading}
                >

                  {loading
                    ? "Sending OTP..."
                    : "Create Account"}

                  {!loading && (
                    <span>→</span>
                  )}

                </button>

              </form>


              {/* LOGIN */}

              <div className="register-login-link">

                <span>
                  Already have an account?
                </span>

                <Link to="/login">
                  Sign in →
                </Link>

              </div>

            </>

          ) : (

            /* =================================================
               OTP SCREEN
            ================================================= */

            <>

              <div className="register-header">

                <div className="register-welcome">
                  EMAIL VERIFICATION
                </div>

                <h2>
                  Verify your email
                </h2>

                <p>
                  We sent a 6-digit OTP to your email.
                </p>

              </div>


              <div className="otp-email">
                {formData.email}
              </div>


              <p className="otp-message">
                Please check your inbox or spam folder.
              </p>


              <form
                className="register-form"
                onSubmit={handleVerifyOtp}
              >

                <div className="register-form-group">

                  <label>
                    Enter Email OTP
                  </label>

                  <div className="otp-section">

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder="000000"
                      value={otp}
                      onChange={(e) => {

                        const value =
                          e.target.value.replace(
                            /\D/g,
                            ""
                          );

                        setOtp(
                          value.slice(0, 6)
                        );

                      }}
                      disabled={loading}
                    />

                  </div>

                </div>


                <button
                  type="submit"
                  className="register-button"
                  disabled={loading}
                >

                  {loading
                    ? "Verifying..."
                    : "Verify Email"}

                  {!loading && (
                    <span>→</span>
                  )}

                </button>

              </form>


              <button
                type="button"
                className="back-register-button"
                onClick={handleBackToRegistration}
                disabled={loading}
              >
                ← Back to registration
              </button>

            </>

          )}

        </div>

      </section>

    </div>
  );
}

export default Register;