import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CompanyProfile.css";

function CompanyProfile() {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setError("User session not found. Please login again.");
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user?.id;

      if (!userId) {
        setError("User ID not found. Please login again.");
        return;
      }

      const response = await axios.get(
        `http://localhost:8081/api/companies/user/${userId}`
      );

      setCompany(response.data);

    } catch (err) {
      console.error("Company profile error:", err);

      setError(
        err.response?.data?.error ||
        "Failed to load company profile."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="company-profile-page">
        <div className="company-profile-loading">
          <div className="loading-spinner"></div>
          <p>Loading company profile...</p>
        </div>
      </div>
    );
  }

  // =========================
  // ERROR
  // =========================

  if (error) {
    return (
      <div className="company-profile-page">
        <div className="company-profile-error">
          <div className="error-icon">!</div>

          <h2>Unable to load profile</h2>

          <p>{error}</p>

          <button
            className="profile-retry-btn"
            onClick={fetchCompanyProfile}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =========================
  // NO COMPANY
  // =========================

  if (!company) {
    return (
      <div className="company-profile-page">
        <div className="company-profile-error">
          <div className="error-icon">!</div>

          <h2>Company profile not found</h2>

          <p>
            No company profile is connected to this account.
          </p>
        </div>
      </div>
    );
  }

  const companyName = company.name || "Company";

  const initial = companyName
    .charAt(0)
    .toUpperCase();

  return (
    <div className="company-profile-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <div className="company-profile-header">

        <div>
          <span className="company-profile-label">
            COMPANY ACCOUNT
          </span>

          <h1>Company Profile</h1>

          <p>
            Manage your company information and profile details.
          </p>
        </div>

        <button
          className="back-dashboard-btn"
          onClick={() => navigate("/company/dashboard")}
        >
          ← Dashboard
        </button>

      </div>


      {/* =====================================
          PROFILE CARD
      ====================================== */}

      <div className="company-profile-card">

        {/* PROFILE TOP */}

        <div className="company-profile-top">

          <div className="company-avatar">
            {initial}
          </div>

          <div className="company-profile-main">

            <h2>
              {company.name || "Company Name"}
            </h2>

            <p className="company-email">
              {company.email || "No email available"}
            </p>

            {company.industry && (
              <span className="company-industry">
                {company.industry}
              </span>
            )}

          </div>

        </div>


        {/* =====================================
            INFORMATION
        ====================================== */}

        <div className="company-information">

          <h3>Company Information</h3>

          <div className="company-info-grid">

            {/* COMPANY NAME */}

            <div className="company-info-item">

              <span className="info-label">
                Company Name
              </span>

              <span className="info-value">
                {company.name || "Not provided"}
              </span>

            </div>


            {/* EMAIL */}

            <div className="company-info-item">

              <span className="info-label">
                Email
              </span>

              <span className="info-value">
                {company.email || "Not provided"}
              </span>

            </div>


            {/* INDUSTRY */}

            <div className="company-info-item">

              <span className="info-label">
                Industry
              </span>

              <span className="info-value">
                {company.industry || "Not provided"}
              </span>

            </div>


            {/* LOCATION */}

            <div className="company-info-item">

              <span className="info-label">
                Location
              </span>

              <span className="info-value">
                {company.location || "Not provided"}
              </span>

            </div>


            {/* WEBSITE */}

            <div className="company-info-item">

              <span className="info-label">
                Website
              </span>

              {company.website ? (
                <a
                  href={
                    company.website.startsWith("http")
                      ? company.website
                      : `https://${company.website}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="company-website"
                >
                  {company.website}
                </a>
              ) : (
                <span className="info-value">
                  Not provided
                </span>
              )}

            </div>


            {/* COMPANY ID */}

            <div className="company-info-item">

              <span className="info-label">
                Company ID
              </span>

              <span className="info-value">
                #{company.id}
              </span>

            </div>

          </div>

        </div>


        {/* =====================================
            DESCRIPTION
        ====================================== */}

        <div className="company-description-section">

          <h3>About Company</h3>

          <p>
            {company.description ||
              "No company description has been added yet."}
          </p>

        </div>


        {/* =====================================
            ACTIONS
        ====================================== */}

        <div className="company-profile-actions">

          <button
            className="company-edit-btn"
            onClick={() => alert("Edit profile coming soon.")}
          >
            ✎ Edit Profile
          </button>

          <button
            className="company-jobs-btn"
            onClick={() => navigate("/company/jobs")}
          >
            💼 View My Jobs
          </button>

        </div>

      </div>

    </div>
  );
}

export default CompanyProfile;