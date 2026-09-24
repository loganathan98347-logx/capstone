import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./JobDetails.css";

function JobDetails() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD JOB
  // =========================================================

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `http://localhost:8081/api/jobs/${id}`
      );

      console.log("Job details:", response.data);

      const data = response.data;

      const formattedJob = {
        id: data.id,
        company: data.companyName || "Company",
        title: data.title || "Untitled Job",
        location: data.location || "Not specified",
        mode: data.workMode || "Not specified",
        type: formatJobType(data.jobType),
        duration: data.duration || "Not specified",
        salary: data.salary || "Not specified",
        posted: formatPostedDate(data.createdAt),
        deadline: data.deadline,
        openings: data.openings,
        skills: Array.isArray(data.skills)
          ? data.skills
          : [],
        description:
          data.description ||
          "No job description available.",
      };

      setJob(formattedJob);

    } catch (error) {
      console.error(
        "Error loading job:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      if (error.response?.status === 404) {
        setError("Job not found.");
      } else {
        setError(
          "Unable to load job details. Please make sure the backend is running."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // FORMAT JOB TYPE
  // =========================================================

  const formatJobType = (type) => {
    if (!type) return "Other";

    const value = type.toUpperCase();

    if (value === "INTERNSHIP") {
      return "Internship";
    }

    if (value === "FULL_TIME") {
      return "Full-time";
    }

    if (value === "PART_TIME") {
      return "Part-time";
    }

    return type;
  };

  // =========================================================
  // FORMAT POSTED DATE
  // =========================================================

  const formatPostedDate = (date) => {
    if (!date) {
      return "Recently posted";
    }

    const created = new Date(date);
    const today = new Date();

    const difference =
      today.getTime() - created.getTime();

    const days = Math.floor(
      difference /
        (1000 * 60 * 60 * 24)
    );

    if (days <= 0) {
      return "Today";
    }

    if (days === 1) {
      return "1 day ago";
    }

    if (days < 7) {
      return `${days} days ago`;
    }

    if (days < 30) {
      const weeks = Math.floor(days / 7);

      return weeks === 1
        ? "1 week ago"
        : `${weeks} weeks ago`;
    }

    return created.toLocaleDateString();
  };

  // =========================================================
  // APPLY FOR JOB
  // =========================================================

  const handleApply = () => {
    if (!job) {
      return;
    }

    // -------------------------------------------------------
    // CHECK LOGIN
    // -------------------------------------------------------

    const storedUser =
      localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    // -------------------------------------------------------
    // CHECK USER DATA
    // -------------------------------------------------------

    try {
      const user =
        JSON.parse(storedUser);

      if (!user?.id) {
        alert(
          "User ID not found. Please login again."
        );
        return;
      }

      // -----------------------------------------------------
      // OPEN APPLICATION FORM
      // -----------------------------------------------------

      navigate(`/apply/${job.id}`);

    } catch (error) {
      console.error(
        "Invalid user data:",
        error
      );

      localStorage.removeItem("user");

      alert(
        "Your login session is invalid. Please login again."
      );

      navigate("/login");
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="job-details-page">

        <div className="job-details-loading">
          <div className="loading-spinner"></div>

          <p>
            Loading job details...
          </p>
        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error || !job) {
    return (
      <div className="job-details-page">

        <div className="job-details-error">

          <h2>
            {error || "Job not found"}
          </h2>

          <button
            onClick={() => navigate("/jobs")}
          >
            ← Back to Jobs
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="job-details-page">

      <div className="job-details-container">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          className="back-to-jobs"
          onClick={() => navigate("/jobs")}
        >
          ← Back to Jobs
        </button>

        {/* =================================================
            JOB HEADER
        ================================================= */}

        <div className="job-details-header">

          <div className="job-header-left">

            <div className="company-logo-large">
              {job.company
                ?.charAt(0)
                ?.toUpperCase() || "C"}
            </div>

            <div className="job-header-info">

              <span className="job-company">
                {job.company}
              </span>

              <h1>
                {job.title}
              </h1>

              <div className="job-header-meta">

                <span>
                  📍 {job.location}
                </span>

                <span>
                  💼 {job.type}
                </span>

                <span>
                  🏢 {job.mode}
                </span>

              </div>

            </div>

          </div>

          <div className="job-header-action">

            <button
              className="apply-button"
              onClick={handleApply}
            >
              Apply Now →
            </button>

          </div>

        </div>

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <div className="job-details-layout">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <div className="job-details-main">

            {/* DESCRIPTION */}

            <section className="job-section">

              <h2>
                About the Job
              </h2>

              <p className="job-description">
                {job.description}
              </p>

            </section>

            {/* SKILLS */}

            <section className="job-section">

              <h2>
                Required Skills
              </h2>

              {job.skills &&
              job.skills.length > 0 ? (

                <div className="skills-container">

                  {job.skills.map(
                    (skill, index) => (
                      <span
                        key={index}
                        className="skill-tag"
                      >
                        {typeof skill ===
                        "string"
                          ? skill
                          : skill.name}
                      </span>
                    )
                  )}

                </div>

              ) : (

                <p className="no-data">
                  No specific skills mentioned.
                </p>

              )}

            </section>

            {/* ADDITIONAL DETAILS */}

            <section className="job-section">

              <h2>
                Job Details
              </h2>

              <div className="job-info-grid">

                <div className="job-info-item">

                  <span className="info-label">
                    Job Type
                  </span>

                  <strong>
                    {job.type}
                  </strong>

                </div>

                <div className="job-info-item">

                  <span className="info-label">
                    Work Mode
                  </span>

                  <strong>
                    {job.mode}
                  </strong>

                </div>

                <div className="job-info-item">

                  <span className="info-label">
                    Duration
                  </span>

                  <strong>
                    {job.duration}
                  </strong>

                </div>

                <div className="job-info-item">

                  <span className="info-label">
                    Salary
                  </span>

                  <strong>
                    {job.salary}
                  </strong>

                </div>

              </div>

            </section>

          </div>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="job-details-sidebar">

            <div className="job-sidebar-card">

              <h3>
                Opportunity Details
              </h3>

              {/* LOCATION */}

              <div className="sidebar-detail">

                <span className="sidebar-icon">
                  📍
                </span>

                <div>
                  <small>
                    Location
                  </small>

                  <strong>
                    {job.location}
                  </strong>
                </div>

              </div>

              {/* WORK MODE */}

              <div className="sidebar-detail">

                <span className="sidebar-icon">
                  🏢
                </span>

                <div>
                  <small>
                    Work Mode
                  </small>

                  <strong>
                    {job.mode}
                  </strong>
                </div>

              </div>

              {/* DURATION */}

              <div className="sidebar-detail">

                <span className="sidebar-icon">
                  ⏱
                </span>

                <div>
                  <small>
                    Duration
                  </small>

                  <strong>
                    {job.duration}
                  </strong>
                </div>

              </div>

              {/* SALARY */}

              <div className="sidebar-detail">

                <span className="sidebar-icon">
                  ₹
                </span>

                <div>
                  <small>
                    Salary / Stipend
                  </small>

                  <strong>
                    {job.salary}
                  </strong>
                </div>

              </div>

              {/* OPENINGS */}

              {job.openings && (
                <div className="sidebar-detail">

                  <span className="sidebar-icon">
                    👥
                  </span>

                  <div>
                    <small>
                      Openings
                    </small>

                    <strong>
                      {job.openings}
                    </strong>
                  </div>

                </div>
              )}

              {/* DEADLINE */}

              {job.deadline && (
                <div className="sidebar-detail">

                  <span className="sidebar-icon">
                    📅
                  </span>

                  <div>
                    <small>
                      Application Deadline
                    </small>

                    <strong>
                      {new Date(
                        job.deadline
                      ).toLocaleDateString()}
                    </strong>
                  </div>

                </div>
              )}

              {/* POSTED */}

              <div className="sidebar-detail">

                <span className="sidebar-icon">
                  🕒
                </span>

                <div>
                  <small>
                    Posted
                  </small>

                  <strong>
                    {job.posted}
                  </strong>
                </div>

              </div>

              {/* SIDEBAR APPLY */}

              <button
                className="sidebar-apply-button"
                onClick={handleApply}
              >
                Apply Now →
              </button>

            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}

export default JobDetails;