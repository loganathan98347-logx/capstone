import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CompanyProfile.css";

function CompanyProfile() {
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    industry: "",
    location: "",
    website: "",
    description: "",
  });

  useEffect(() => {
    fetchCompanyProfile();
  }, []);

  /* =====================================================
     GET COMPANY PROFILE
  ===================================================== */

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

      // Fill edit form with existing company information
      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        industry: response.data.industry || "",
        location: response.data.location || "",
        website: response.data.website || "",
        description: response.data.description || "",
      });

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

  /* =====================================================
     HANDLE INPUT CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  /* =====================================================
     OPEN EDIT MODE
  ===================================================== */

  const handleEdit = () => {
    setSuccess("");
    setError("");

    // Make sure form contains latest company data
    setFormData({
      name: company?.name || "",
      email: company?.email || "",
      industry: company?.industry || "",
      location: company?.location || "",
      website: company?.website || "",
      description: company?.description || "",
    });

    setIsEditing(true);
  };

  /* =====================================================
     CANCEL EDIT
  ===================================================== */

  const handleCancel = () => {
    setFormData({
      name: company?.name || "",
      email: company?.email || "",
      industry: company?.industry || "",
      location: company?.location || "",
      website: company?.website || "",
      description: company?.description || "",
    });

    setError("");
    setSuccess("");
    setIsEditing(false);
  };

  /* =====================================================
     SAVE COMPANY PROFILE
  ===================================================== */

  const handleSave = async (e) => {
    e.preventDefault();

    if (!company?.id) {
      setError("Company ID not found.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await axios.put(
        `http://localhost:8081/api/companies/${company.id}`,
        formData
      );

      // Update displayed company information
      setCompany(response.data);

      // Update form with saved data
      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        industry: response.data.industry || "",
        location: response.data.location || "",
        website: response.data.website || "",
        description: response.data.description || "",
      });

      setIsEditing(false);
      setSuccess("Company profile updated successfully.");

    } catch (err) {
      console.error("Update company error:", err);

      setError(
        err.response?.data?.error ||
          "Failed to update company profile."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =====================================================
     LOADING
  ===================================================== */

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

  /* =====================================================
     ERROR
  ===================================================== */

  if (error && !company) {
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

  /* =====================================================
     NO COMPANY
  ===================================================== */

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

  /* =====================================================
     COMPANY DATA
  ===================================================== */

  const companyName = company.name || "Company";

  const initial = companyName
    .charAt(0)
    .toUpperCase();

  return (
    <div className="company-profile-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="company-profile-header">

        <div className="company-header-content">

          <div className="company-profile-label">
            COMPANY ACCOUNT
          </div>

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


      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {success && (
        <div className="company-profile-success">
          ✓ {success}
        </div>
      )}


      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && company && (
        <div className="company-profile-inline-error">
          {error}
        </div>
      )}


      {/* =================================================
          MAIN PROFILE CARD
      ================================================= */}

      <div className="company-profile-card">

        {/* =================================================
            PROFILE TOP
        ================================================= */}

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
              <div className="company-industry">
                {company.industry}
              </div>
            )}

          </div>

        </div>


        {/* =================================================
            EDIT MODE
        ================================================= */}

        {isEditing ? (

          <form
            className="company-edit-form"
            onSubmit={handleSave}
          >

            <div className="company-information">

              <h3>Edit Company Information</h3>

              <div className="company-edit-grid">

                {/* COMPANY NAME */}

                <div className="company-form-group">

                  <label>
                    Company Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter company name"
                    required
                  />

                </div>


                {/* EMAIL */}

                <div className="company-form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter company email"
                    required
                  />

                </div>


                {/* INDUSTRY */}

                <div className="company-form-group">

                  <label>
                    Industry
                  </label>

                  <input
                    type="text"
                    name="industry"
                    value={formData.industry}
                    onChange={handleChange}
                    placeholder="e.g. Software, IT, Finance"
                  />

                </div>


                {/* LOCATION */}

                <div className="company-form-group">

                  <label>
                    Location
                  </label>

                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Chennai, Tamil Nadu"
                  />

                </div>


                {/* WEBSITE */}

                <div className="company-form-group">

                  <label>
                    Website
                  </label>

                  <input
                    type="text"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                  />

                </div>

              </div>


              {/* DESCRIPTION */}

              <div className="company-form-group company-description-input">

                <label>
                  About Company
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell students about your company..."
                  rows="6"
                />

              </div>

            </div>


            {/* =================================================
                EDIT ACTIONS
            ================================================= */}

            <div className="company-profile-actions">

              <button
                type="submit"
                className="company-save-btn"
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "✓ Save Changes"}
              </button>

              <button
                type="button"
                className="company-cancel-btn"
                onClick={handleCancel}
                disabled={saving}
              >
                ✕ Cancel
              </button>

            </div>

          </form>

        ) : (

          <>
            {/* =================================================
                NORMAL COMPANY INFORMATION
            ================================================= */}

            <div className="company-information">

              <h3>Company Information</h3>

              <div className="company-info-grid">

                {/* COMPANY NAME */}

                <div className="company-info-item">

                  <div className="info-label">
                    Company Name
                  </div>

                  <div className="info-value">
                    {company.name || "Not provided"}
                  </div>

                </div>


                {/* EMAIL */}

                <div className="company-info-item">

                  <div className="info-label">
                    Email
                  </div>

                  <div className="info-value">
                    {company.email || "Not provided"}
                  </div>

                </div>


                {/* INDUSTRY */}

                <div className="company-info-item">

                  <div className="info-label">
                    Industry
                  </div>

                  <div className="info-value">
                    {company.industry || "Not provided"}
                  </div>

                </div>


                {/* LOCATION */}

                <div className="company-info-item">

                  <div className="info-label">
                    Location
                  </div>

                  <div className="info-value">
                    {company.location || "Not provided"}
                  </div>

                </div>


                {/* WEBSITE */}

                <div className="company-info-item">

                  <div className="info-label">
                    Website
                  </div>

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
                    <div className="info-value">
                      Not provided
                    </div>
                  )}

                </div>


                {/* COMPANY ID */}

                <div className="company-info-item">

                  <div className="info-label">
                    Company ID
                  </div>

                  <div className="info-value">
                    #{company.id}
                  </div>

                </div>

              </div>

            </div>


            {/* =================================================
                ABOUT COMPANY
            ================================================= */}

            <div className="company-description-section">

              <h3>About Company</h3>

              <p>
                {company.description ||
                  "No company description has been added yet."}
              </p>

            </div>


            {/* =================================================
                ACTION BUTTONS
            ================================================= */}

            <div className="company-profile-actions">

              <button
                className="company-edit-btn"
                onClick={handleEdit}
              >
                ✎ Edit Profile
              </button>

              <button
                className="company-jobs-btn"
                onClick={() =>
                  navigate("/company/jobs")
                }
              >
                💼 View My Jobs
              </button>

            </div>

          </>

        )}

      </div>

    </div>
  );
}

export default CompanyProfile;