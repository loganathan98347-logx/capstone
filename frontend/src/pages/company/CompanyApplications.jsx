import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./CompanyApplications.css";

function CompanyApplications() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const jobId = searchParams.get("jobId");

  const [company, setCompany] = useState(null);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadApplications();
  }, [jobId]);

  const loadApplications = async () => {
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

      // ==========================================
      // GET COMPANY
      // ==========================================

      const companyResponse = await axios.get(
        `http://localhost:8081/api/companies/user/${userId}`
      );

      const companyData = companyResponse.data;

      setCompany(companyData);

      if (!companyData?.id) {
        setError("Company profile not found.");
        return;
      }

      // ==========================================
      // GET COMPANY JOBS
      // ==========================================

      const jobsResponse = await axios.get(
        `http://localhost:8081/api/jobs/company/${companyData.id}`
      );

      const companyJobs = Array.isArray(jobsResponse.data)
        ? jobsResponse.data
        : [];

      setJobs(companyJobs);

      // ==========================================
      // GET APPLICATIONS
      // ==========================================

      const applicationRequests = companyJobs
        .filter((job) => !jobId || String(job.id) === String(jobId))
        .map(async (job) => {
          try {
            const response = await axios.get(
              `http://localhost:8081/api/applications/job/${job.id}`
            );

            return Array.isArray(response.data)
              ? response.data.map((application) => ({
                  ...application,
                  jobId: job.id,
                  jobTitle: job.title,
                  companyName:
                    job.companyName || companyData.name,
                }))
              : [];
          } catch (err) {
            console.error(
              `Failed to load applications for job ${job.id}`,
              err
            );

            return [];
          }
        });

      const results = await Promise.all(applicationRequests);

      const combinedApplications = results.flat();

      setApplications(combinedApplications);

    } catch (err) {
      console.error("Company applications error:", err);

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Failed to load applications."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // STATUS UPDATE
  // ==========================================

  const updateApplicationStatus = async (
    applicationId,
    status
  ) => {
    try {
      await axios.put(
        `http://localhost:8081/api/applications/${applicationId}/status`,
        {
          status,
        }
      );

      setApplications((previous) =>
        previous.map((application) =>
          application.id === applicationId
            ? {
                ...application,
                status,
              }
            : application
        )
      );

      alert(`Application ${status.toLowerCase()}.`);

    } catch (err) {
      console.error("Status update error:", err);

      alert(
        err.response?.data?.error ||
          "Failed to update application status."
      );
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="company-applications-page">
        <div className="company-applications-loading">
          <div className="applications-spinner"></div>
          <p>Loading applications...</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================

  if (error) {
    return (
      <div className="company-applications-page">
        <div className="company-applications-error">

          <div className="applications-error-icon">
            !
          </div>

          <h2>Unable to load applications</h2>

          <p>{error}</p>

          <button
            onClick={loadApplications}
            className="applications-retry-button"
          >
            Try Again
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="company-applications-page">

      {/* ==========================================
          HEADER
      =========================================== */}

      <div className="company-applications-header">

        <div>
          <span className="applications-label">
            COMPANY PORTAL
          </span>

          <h1>Applications</h1>

          <p>
            Review students who applied for your jobs.
          </p>
        </div>

        <button
          className="applications-back-button"
          onClick={() => navigate("/company/jobs")}
        >
          ← My Jobs
        </button>

      </div>


      {/* ==========================================
          SUMMARY
      =========================================== */}

      <div className="applications-summary">

        <div className="application-summary-card">

          <span>COMPANY</span>

          <strong>
            {company?.name || "Company"}
          </strong>

        </div>

        <div className="application-summary-card">

          <span>JOBS</span>

          <strong>
            {jobs.length}
          </strong>

        </div>

        <div className="application-summary-card">

          <span>APPLICATIONS</span>

          <strong>
            {applications.length}
          </strong>

        </div>

      </div>


      {/* ==========================================
          NO APPLICATIONS
      =========================================== */}

      {applications.length === 0 ? (

        <div className="no-applications-card">

          <div className="no-applications-icon">
            📄
          </div>

          <h2>No applications yet</h2>

          <p>
            Applications from students will appear here
            when they apply for your jobs.
          </p>

          <button
            onClick={() => navigate("/company/jobs")}
            className="view-my-jobs-button"
          >
            View My Jobs
          </button>

        </div>

      ) : (

        /* ==========================================
           APPLICATION LIST
        =========================================== */

        <div className="applications-list">

          {applications.map((application) => {

            const student = application.student;

            const studentName =
              student?.name ||
              "Student";

            const studentEmail =
              student?.email ||
              "Email not available";

            const initial =
              studentName
                .charAt(0)
                .toUpperCase();

            const status =
              application.status ||
              "APPLIED";

            return (
              <div
                className="company-application-card"
                key={application.id}
              >

                {/* STUDENT */}

                <div className="application-student">

                  <div className="student-avatar">
                    {initial}
                  </div>

                  <div>

                    <h2>
                      {studentName}
                    </h2>

                    <p>
                      {studentEmail}
                    </p>

                  </div>

                </div>


                {/* JOB */}

                <div className="application-job">

                  <span>
                    APPLIED FOR
                  </span>

                  <strong>
                    {application.jobTitle ||
                      "Job"}
                  </strong>

                </div>


                {/* STUDENT DETAILS */}

                <div className="student-details">

                  <div>
                    <small>College</small>

                    <strong>
                      {student?.college ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <small>Department</small>

                    <strong>
                      {student?.department ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <small>CGPA</small>

                    <strong>
                      {student?.cgpa ??
                        "Not provided"}
                    </strong>
                  </div>

                  <div>
                    <small>Graduation</small>

                    <strong>
                      {student?.graduationYear ||
                        "Not provided"}
                    </strong>
                  </div>

                </div>


                {/* STATUS */}

                <div className="application-status-row">

                  <span
                    className={`application-status ${status.toLowerCase()}`}
                  >
                    {status}
                  </span>

                  <div className="application-actions">

                    {status !== "SHORTLISTED" && (
                      <button
                        className="shortlist-button"
                        onClick={() =>
                          updateApplicationStatus(
                            application.id,
                            "SHORTLISTED"
                          )
                        }
                      >
                        ✓ Shortlist
                      </button>
                    )}

                    {status !== "REJECTED" && (
                      <button
                        className="reject-button"
                        onClick={() =>
                          updateApplicationStatus(
                            application.id,
                            "REJECTED"
                          )
                        }
                      >
                        ✕ Reject
                      </button>
                    )}

                  </div>

                </div>

              </div>
            );
          })}

        </div>

      )}

    </div>
  );
}

export default CompanyApplications;