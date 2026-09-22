import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MyJobs.css";

function MyJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMyJobs();
  }, []);

  const loadMyJobs = async () => {
    try {
      setLoading(true);
      setError("");

      // -----------------------------------------
      // GET LOGGED-IN USER
      // -----------------------------------------

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        setError("User session not found. Please login again.");
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);
      const userId = user?.id;

      if (!userId) {
        setError("User ID not found. Please login again.");
        setLoading(false);
        return;
      }

      // -----------------------------------------
      // GET COMPANY USING USER ID
      // -----------------------------------------

      const companyResponse = await axios.get(
        `http://localhost:8081/api/companies/user/${userId}`
      );

      const companyData = companyResponse.data;

      setCompany(companyData);

      if (!companyData?.id) {
        setError("Company ID not found.");
        setLoading(false);
        return;
      }

      // -----------------------------------------
      // GET JOBS POSTED BY THIS COMPANY
      // -----------------------------------------

      const jobsResponse = await axios.get(
        `http://localhost:8081/api/jobs/company/${companyData.id}`
      );

      const jobsData = Array.isArray(jobsResponse.data)
        ? jobsResponse.data
        : [];

      setJobs(jobsData);

    } catch (err) {
      console.error("My Jobs error:", err);

      setError(
        err.response?.data?.error ||
        err.response?.data?.message ||
        "Failed to load your jobs."
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------------
  // DELETE JOB
  // -----------------------------------------

  const handleDelete = async (jobId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8081/api/jobs/${jobId}`
      );

      setJobs((previousJobs) =>
        previousJobs.filter((job) => job.id !== jobId)
      );

      alert("Job deleted successfully.");

    } catch (err) {
      console.error("Delete job error:", err);

      alert(
        err.response?.data?.error ||
        "Failed to delete job."
      );
    }
  };

  // -----------------------------------------
  // LOADING
  // -----------------------------------------

  if (loading) {
    return (
      <div className="my-jobs-page">

        <div className="my-jobs-loading">

          <div className="my-jobs-spinner"></div>

          <p>Loading your jobs...</p>

        </div>

      </div>
    );
  }

  // -----------------------------------------
  // ERROR
  // -----------------------------------------

  if (error) {
    return (
      <div className="my-jobs-page">

        <div className="my-jobs-error">

          <div className="my-jobs-error-icon">
            !
          </div>

          <h2>Unable to load jobs</h2>

          <p>{error}</p>

          <button
            className="my-jobs-retry"
            onClick={loadMyJobs}
          >
            Try Again
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="my-jobs-page">

      {/* =========================================
          HEADER
      ========================================== */}

      <div className="my-jobs-header">

        <div>

          <span className="my-jobs-label">
            COMPANY PORTAL
          </span>

          <h1>My Jobs</h1>

          <p>
            Manage the jobs and internships posted by your company.
          </p>

        </div>

        <button
          className="post-job-button"
          onClick={() => navigate("/company/jobs/create")}
        >
          + Post a Job
        </button>

      </div>


      {/* =========================================
          COMPANY SUMMARY
      ========================================== */}

      {company && (
        <div className="my-company-summary">

          <div className="my-company-avatar">
            {(company.name || "C")
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <h2>
              {company.name || "Company"}
            </h2>

            <p>
              {company.email || "Company account"}
            </p>

          </div>

          <div className="job-count-box">

            <span>
              TOTAL JOBS
            </span>

            <strong>
              {jobs.length}
            </strong>

          </div>

        </div>
      )}


      {/* =========================================
          NO JOBS
      ========================================== */}

      {jobs.length === 0 ? (

        <div className="no-jobs-card">

          <div className="no-jobs-icon">
            💼
          </div>

          <h2>No jobs posted yet</h2>

          <p>
            You haven't posted any jobs or internships.
            Start hiring by creating your first job.
          </p>

          <button
            className="empty-post-button"
            onClick={() => navigate("/company/jobs/create")}
          >
            + Post Your First Job
          </button>

        </div>

      ) : (

        /* =========================================
           JOB LIST
        ========================================== */

        <div className="my-jobs-list">

          {jobs.map((job) => (

            <div
              className="my-job-card"
              key={job.id}
            >

              {/* TOP */}

              <div className="my-job-top">

                <div>

                  <span className="job-type-badge">
                    {job.jobType || "JOB"}
                  </span>

                  <h2>
                    {job.title || "Untitled Job"}
                  </h2>

                  <p className="job-company-name">
                    {job.companyName ||
                      company?.name ||
                      "Your Company"}
                  </p>

                </div>

                <div className="job-status">
                  ACTIVE
                </div>

              </div>


              {/* DESCRIPTION */}

              <p className="my-job-description">
                {job.description ||
                  "No description provided."}
              </p>


              {/* DETAILS */}

              <div className="my-job-details">

                <div className="job-detail">

                  <span className="detail-icon">
                    📍
                  </span>

                  <div>
                    <small>Location</small>
                    <strong>
                      {job.location || "Not specified"}
                    </strong>
                  </div>

                </div>


                <div className="job-detail">

                  <span className="detail-icon">
                    💰
                  </span>

                  <div>
                    <small>Salary / Stipend</small>
                    <strong>
                      {job.salary || "Not specified"}
                    </strong>
                  </div>

                </div>


                <div className="job-detail">

                  <span className="detail-icon">
                    👥
                  </span>

                  <div>
                    <small>Openings</small>
                    <strong>
                      {job.openings || 0}
                    </strong>
                  </div>

                </div>


                <div className="job-detail">

                  <span className="detail-icon">
                    📅
                  </span>

                  <div>
                    <small>Deadline</small>
                    <strong>
                      {job.deadline || "Not specified"}
                    </strong>
                  </div>

                </div>

              </div>


              {/* SKILLS */}

              {job.skills &&
                job.skills.length > 0 && (

                  <div className="my-job-skills">

                    <span className="skills-title">
                      Skills
                    </span>

                    <div className="skills-list">

                      {job.skills.map(
                        (skill, index) => (

                          <span
                            className="skill-tag"
                            key={index}
                          >
                            {skill}
                          </span>

                        )
                      )}

                    </div>

                  </div>

                )}


              {/* ACTIONS */}

              <div className="my-job-actions">

                <button
                  className="view-job-button"
                  onClick={() =>
                    navigate(`/jobs/${job.id}`)
                  }
                >
                  View Job
                </button>

                <button
                  className="applications-button"
                  onClick={() =>
                    navigate(
                      `/company/applications?jobId=${job.id}`
                    )
                  }
                >
                  View Applications
                </button>

                <button
                  className="delete-job-button"
                  onClick={() =>
                    handleDelete(job.id)
                  }
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyJobs;