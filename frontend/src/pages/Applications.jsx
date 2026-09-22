import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Applications.css";

function Applications() {
  const navigate = useNavigate();

  const [filter, setFilter] = useState("ALL");
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // GET LOGGED-IN USER
  // =========================================================

  const getLoggedInUser = () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));

      console.log("Logged-in user:", user);

      return user;
    } catch (error) {
      console.error("Invalid user data:", error);
      return null;
    }
  };

  // =========================================================
  // LOAD APPLICATIONS
  // =========================================================

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError("");

      const user = getLoggedInUser();

      if (!user || !user.id) {
        setError("User information not found. Please login again.");
        setLoading(false);
        return;
      }

      console.log("Fetching applications for user:", user.id);

      const response = await axios.get(
        `http://localhost:8081/api/applications/student/${user.id}`
      );

      console.log("Applications from backend:", response.data);

      const backendApplications = Array.isArray(response.data)
        ? response.data
        : [];

      const formattedApplications = backendApplications.map(
        (application) => {
          const job = application.job || {};
          const student = application.student || {};

          return {
            id: application.id,

            jobId: job.id,

            jobTitle:
              job.title || "Untitled Job",

            company:
              job.company ||
              job.companyName ||
              "Company",

            location:
              job.location ||
              "Not specified",

            type:
              formatJobType(job.jobType),

            appliedDate:
              formatDate(application.appliedAt),

            status:
              application.status || "APPLIED",

            salary:
              job.salary !== null &&
              job.salary !== undefined
                ? `₹${Number(job.salary).toLocaleString("en-IN")}`
                : "Not specified",

            skills:
              Array.isArray(job.skills)
                ? job.skills
                : [],

            studentName:
              student.name || "",

            studentEmail:
              student.email || "",
          };
        }
      );

      setApplications(formattedApplications);

    } catch (error) {
      console.error(
        "Error loading applications:",
        error
      );

      console.error(
        "Backend response:",
        error.response?.data
      );

      if (error.response?.status === 404) {
        setApplications([]);
      } else {
        setError(
          "Unable to load your applications. Please make sure the backend is running."
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

    const value = type.toString().toUpperCase();

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
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "Recently";
    }

    try {
      const value = new Date(date);

      if (Number.isNaN(value.getTime())) {
        return "Recently";
      }

      return value.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });

    } catch {
      return "Recently";
    }
  };

  // =========================================================
  // STATUS LABEL
  // =========================================================

  const getStatusLabel = (status) => {
    switch (status) {
      case "APPLIED":
        return "Applied";

      case "SHORTLISTED":
        return "Shortlisted";

      case "INTERVIEW":
        return "Interview";

      case "OFFERED":
        return "Offer Received";

      case "REJECTED":
        return "Not Selected";

      default:
        return status || "Applied";
    }
  };

  // =========================================================
  // FILTER
  // =========================================================

  const filteredApplications =
    filter === "ALL"
      ? applications
      : applications.filter(
          (application) =>
            application.status === filter
        );

  // =========================================================
  // STATISTICS
  // =========================================================

  const totalApplications =
    applications.length;

  const inProgress =
    applications.filter(
      (application) =>
        application.status === "APPLIED" ||
        application.status === "SHORTLISTED" ||
        application.status === "INTERVIEW"
    ).length;

  const interviews =
    applications.filter(
      (application) =>
        application.status === "INTERVIEW"
    ).length;

  const offers =
    applications.filter(
      (application) =>
        application.status === "OFFERED"
    ).length;

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="applications-page">

        <section className="applications-hero">

          <div className="applications-hero-content">

            <span className="applications-badge">
              CAMPUSCONNECT
            </span>

            <h1>
              My Applications
            </h1>

            <p>
              Loading your applications...
            </p>

          </div>

        </section>

        <main className="applications-content">

          <div className="no-applications">

            <div className="no-applications-icon">
              ⏳
            </div>

            <h2>
              Loading applications...
            </h2>

            <p>
              Please wait while we fetch your applications.
            </p>

          </div>

        </main>

      </div>
    );
  }

  // =========================================================
  // RETURN
  // =========================================================

  return (
    <div className="applications-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="applications-hero">

        <div className="applications-hero-content">

          <span className="applications-badge">
            CAMPUSCONNECT
          </span>

          <h1>
            My Applications
          </h1>

          <p>
            Track your internship and job applications
            from one place.
          </p>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="applications-content">

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div
            style={{
              padding: "20px",
              marginBottom: "25px",
              borderRadius: "12px",
              background: "#2a1010",
              color: "#ff6b6b",
              border: "1px solid #5c2020",
            }}
          >
            {error}
          </div>

        )}


        {/* ===================================================
            STATISTICS
        =================================================== */}

        <div className="application-stats">

          {/* TOTAL */}

          <div className="application-stat-card">

            <div className="stat-icon">
              📋
            </div>

            <div>

              <span>
                Total Applications
              </span>

              <strong>
                {totalApplications}
              </strong>

            </div>

          </div>


          {/* IN PROGRESS */}

          <div className="application-stat-card">

            <div className="stat-icon">
              ⏳
            </div>

            <div>

              <span>
                In Progress
              </span>

              <strong>
                {inProgress}
              </strong>

            </div>

          </div>


          {/* INTERVIEWS */}

          <div className="application-stat-card">

            <div className="stat-icon">
              🎯
            </div>

            <div>

              <span>
                Interviews
              </span>

              <strong>
                {interviews}
              </strong>

            </div>

          </div>


          {/* OFFERS */}

          <div className="application-stat-card">

            <div className="stat-icon">
              🎉
            </div>

            <div>

              <span>
                Offers
              </span>

              <strong>
                {offers}
              </strong>

            </div>

          </div>

        </div>


        {/* ===================================================
            TOOLBAR
        =================================================== */}

        <div className="applications-toolbar">

          <div className="applications-title">

            <h2>
              Your Applications
            </h2>

            <p>
              {filteredApplications.length}{" "}
              {filteredApplications.length === 1
                ? "application"
                : "applications"}{" "}
              found
            </p>

          </div>


          {/* FILTERS */}

          <div className="application-filters">

            <button
              className={
                filter === "ALL"
                  ? "active"
                  : ""
              }
              onClick={() => setFilter("ALL")}
            >
              All
            </button>

            <button
              className={
                filter === "APPLIED"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("APPLIED")
              }
            >
              Applied
            </button>

            <button
              className={
                filter === "SHORTLISTED"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("SHORTLISTED")
              }
            >
              Shortlisted
            </button>

            <button
              className={
                filter === "INTERVIEW"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("INTERVIEW")
              }
            >
              Interview
            </button>

            <button
              className={
                filter === "OFFERED"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("OFFERED")
              }
            >
              Offers
            </button>

            <button
              className={
                filter === "REJECTED"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setFilter("REJECTED")
              }
            >
              Rejected
            </button>

          </div>

        </div>


        {/* ===================================================
            APPLICATION LIST
        =================================================== */}

        <div className="applications-list">

          {filteredApplications.length > 0 ? (

            filteredApplications.map(
              (application) => (

                <div
                  className="application-card"
                  key={application.id}
                >

                  {/* COMPANY LOGO */}

                  <div className="application-company-logo">

                    {application.company
                      ? application.company
                          .charAt(0)
                          .toUpperCase()
                      : "C"}

                  </div>


                  {/* MAIN DETAILS */}

                  <div className="application-main">

                    <div className="application-card-header">

                      <div>

                        <span className="application-type">
                          {application.type}
                        </span>

                        <h3>
                          {application.jobTitle}
                        </h3>

                        <h4>
                          {application.company}
                        </h4>

                      </div>


                      {/* STATUS */}

                      <span
                        className={`application-status status-${(
                          application.status ||
                          "APPLIED"
                        ).toLowerCase()}`}
                      >

                        <span className="status-dot"></span>

                        {getStatusLabel(
                          application.status
                        )}

                      </span>

                    </div>


                    {/* META */}

                    <div className="application-meta">

                      <span>
                        📍 {application.location}
                      </span>

                      <span>
                        💰 {application.salary}
                      </span>

                      <span>
                        📅 Applied{" "}
                        {application.appliedDate}
                      </span>

                    </div>


                    {/* SKILLS */}

                    {application.skills.length > 0 && (

                      <div className="application-skills">

                        {application.skills.map(
                          (skill, index) => (

                            <span
                              key={`${skill}-${index}`}
                            >
                              {skill}
                            </span>

                          )
                        )}

                      </div>

                    )}

                  </div>


                  {/* ACTION */}

                  <div className="application-action">

                    <button
                      onClick={() =>
                        navigate(
                          `/jobs/${application.jobId}`
                        )
                      }
                    >
                      View Job →
                    </button>

                  </div>

                </div>

              )
            )

          ) : (

            /* =================================================
               NO APPLICATIONS
            ================================================= */

            <div className="no-applications">

              <div className="no-applications-icon">
                📋
              </div>

              <h2>
                No applications found
              </h2>

              <p>
                {filter === "ALL"
                  ? "You haven't applied to any jobs yet."
                  : "You haven't applied to any jobs in this category yet."}
              </p>

              <button
                onClick={() =>
                  navigate("/jobs")
                }
              >
                Explore Jobs →
              </button>

            </div>

          )}

        </div>

      </main>

    </div>
  );
}

export default Applications;