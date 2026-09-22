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
  const [applying, setApplying] = useState(false);

  // =========================================================
  // LOAD JOB FROM BACKEND
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

      // Convert backend data to frontend format
      const formattedJob = {
        id: data.id,

        company:
          data.companyName || "Company",

        title:
          data.title || "Untitled Job",

        location:
          data.location || "Not specified",

        mode:
          data.workMode || "Not specified",

        type:
          formatJobType(data.jobType),

        duration:
          data.duration || "Not specified",

        salary:
          data.salary || "Not specified",

        posted:
          formatPostedDate(data.createdAt),

        deadline:
          data.deadline,

        openings:
          data.openings,

        skills:
          Array.isArray(data.skills)
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
    if (!type) {
      return "Other";
    }

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
      difference / (1000 * 60 * 60 * 24)
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

  const handleApply = async () => {
    if (!job) {
      return;
    }

    try {
      setApplying(true);

      // Get logged-in user
      const storedUser =
        localStorage.getItem("user");

      if (!storedUser) {
        alert("Please login first.");
        navigate("/login");
        return;
      }

      let user;

      try {
        user = JSON.parse(storedUser);
      } catch (parseError) {
        console.error(
          "Invalid user data:",
          parseError
        );

        alert(
          "Your login session is invalid. Please login again."
        );

        localStorage.removeItem("user");
        navigate("/login");

        return;
      }

      const userId = user?.id;

      if (!userId) {
        alert(
          "User ID not found. Please logout and login again."
        );

        return;
      }

      // Make application request
      const response = await axios.post(
        "http://localhost:8081/api/applications",
        {
          userId: Number(userId),
          jobId: Number(id),
        }
      );

      console.log(
        "Application saved:",
        response.data
      );

      alert(
        "Application submitted successfully!"
      );

    } catch (error) {
      console.error(
        "Application error:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to apply for this job.";

      alert(message);

    } finally {
      setApplying(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="job-details-page">

        <div className="job-not-found">

          <div className="not-found-icon">
            ⏳
          </div>

          <h1>
            Loading job...
          </h1>

          <p>
            Loading the latest job information.
          </p>

        </div>

      </div>
    );
  }

  // =========================================================
  // ERROR / NOT FOUND
  // =========================================================

  if (error || !job) {
    return (
      <div className="job-details-page">

        <div className="job-not-found">

          <div className="not-found-icon">
            !
          </div>

          <h1>
            Job not found
          </h1>

          <p>
            {error ||
              "The opportunity you are looking for does not exist."}
          </p>

          <button
            className="back-jobs-button"
            onClick={() => navigate("/jobs")}
          >
            ← Back to Jobs
          </button>

        </div>

      </div>
    );
  }

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="job-details-page">

      <div className="job-details-container">

        {/* ===================================================
            BACK BUTTON
        =================================================== */}

        <button
          className="back-button"
          onClick={() => navigate("/jobs")}
        >
          ← Back to Jobs
        </button>

        {/* ===================================================
            JOB HEADER
        =================================================== */}

        <section className="job-details-header">

          <div className="job-details-company-logo">
            {job.company
              .charAt(0)
              .toUpperCase()}
          </div>

          <div className="job-details-title-area">

            <span className="job-details-type">
              {job.type}
            </span>

            <h1>
              {job.title}
            </h1>

            <h3>
              {job.company}
            </h3>

            <div className="job-details-meta">

              <span>
                📍 {job.location}
              </span>

              <span>
                🏢 {job.mode}
              </span>

              <span>
                ⏱️ {job.duration}
              </span>

              <span>
                🕒 {job.posted}
              </span>

            </div>

          </div>

          <div className="job-details-header-action">

            <div className="job-details-salary">
              {job.salary}
            </div>

            <button
              className="apply-button"
              onClick={handleApply}
              disabled={applying}
            >
              {applying
                ? "Applying..."
                : "Apply Now →"}
            </button>

          </div>

        </section>

        {/* ===================================================
            MAIN GRID
        =================================================== */}

        <div className="job-details-grid">

          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <main className="job-details-main">

            {/* DESCRIPTION */}

            <section className="details-section">

              <h2>
                About the opportunity
              </h2>

              <p>
                {job.description}
              </p>

            </section>

            {/* JOB DESCRIPTION */}

            <section className="details-section">

              <h2>
                Job description
              </h2>

              <p>
                {job.description}
              </p>

            </section>

            {/* RESPONSIBILITIES */}

            <section className="details-section">

              <h2>
                Responsibilities
              </h2>

              <ul>

                <li>
                  Work on assigned projects and tasks
                </li>

                <li>
                  Collaborate with team members
                </li>

                <li>
                  Write clean and maintainable code
                </li>

                <li>
                  Participate in development activities
                </li>

                <li>
                  Test and improve applications
                </li>

              </ul>

            </section>

            {/* REQUIREMENTS */}

            <section className="details-section">

              <h2>
                Requirements
              </h2>

              <ul>

                <li>
                  Basic knowledge of programming
                </li>

                <li>
                  Good problem-solving skills
                </li>

                <li>
                  Ability to work in a team
                </li>

                <li>
                  Interest in learning new technologies
                </li>

              </ul>

            </section>

            {/* SKILLS */}

            <section className="details-section">

              <h2>
                Required skills
              </h2>

              {job.skills.length > 0 ? (

                <div className="details-skills">

                  {job.skills.map(
                    (skill, index) => (
                      <span
                        key={`${skill}-${index}`}
                      >
                        {skill}
                      </span>
                    )
                  )}

                </div>

              ) : (

                <p>
                  No specific skills listed.
                </p>

              )}

            </section>

          </main>

          {/* =================================================
              RIGHT SIDEBAR
          ================================================= */}

          <aside className="job-details-sidebar">

            {/* JOB OVERVIEW */}

            <div className="sidebar-card">

              <h2>
                Job overview
              </h2>

              {/* JOB TYPE */}

              <div className="overview-item">

                <span className="overview-icon">
                  💼
                </span>

                <div>

                  <small>
                    Job type
                  </small>

                  <strong>
                    {job.type}
                  </strong>

                </div>

              </div>

              {/* LOCATION */}

              <div className="overview-item">

                <span className="overview-icon">
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

              <div className="overview-item">

                <span className="overview-icon">
                  🏢
                </span>

                <div>

                  <small>
                    Work mode
                  </small>

                  <strong>
                    {job.mode}
                  </strong>

                </div>

              </div>

              {/* DURATION */}

              <div className="overview-item">

                <span className="overview-icon">
                  ⏱️
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

              <div className="overview-item">

                <span className="overview-icon">
                  💰
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

              <div className="overview-item">

                <span className="overview-icon">
                  👥
                </span>

                <div>

                  <small>
                    Openings
                  </small>

                  <strong>
                    {job.openings ||
                      "Not specified"}
                  </strong>

                </div>

              </div>

              {/* DEADLINE */}

              <div className="overview-item">

                <span className="overview-icon">
                  📅
                </span>

                <div>

                  <small>
                    Application deadline
                  </small>

                  <strong>
                    {job.deadline ||
                      "Not specified"}
                  </strong>

                </div>

              </div>

              {/* APPLY */}

              <button
                className="sidebar-apply-button"
                onClick={handleApply}
                disabled={applying}
              >
                {applying
                  ? "Applying..."
                  : "Apply Now →"}
              </button>

            </div>

            {/* =================================================
                COMPANY CARD
            ================================================= */}

            <div className="company-details-card">

              <div className="company-details-logo">
                {job.company
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <h2>
                {job.company}
              </h2>

              <p>
                Company offering career opportunities
                for students and fresh graduates.
              </p>

              <button
                type="button"
              >
                View Company →
              </button>

            </div>

          </aside>

        </div>

      </div>

    </div>
  );
}

export default JobDetails;