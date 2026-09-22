import { useNavigate } from "react-router-dom";
import "./JobCard.css";

function JobCard({ job }) {
  const navigate = useNavigate();

  const companyName =
    job.company || job.companyName || "Company";

  const skills = Array.isArray(job.skills)
    ? job.skills
    : [];

  return (
    <article className="job-card">

      {/* =====================================================
          COMPANY LOGO
      ===================================================== */}

      <div className="job-company-logo">
        {companyName.charAt(0).toUpperCase()}
      </div>

      {/* =====================================================
          JOB INFORMATION
      ===================================================== */}

      <div className="job-main-info">

        <div className="job-card-top">

          <div>

            <h3>
              {job.title || "Untitled Job"}
            </h3>

            <p className="job-company">
              {companyName}
            </p>

          </div>

          <span className="job-posted">
            {job.posted || "Recently posted"}
          </span>

        </div>

        {/* =================================================
            JOB META
        ================================================= */}

        <div className="job-meta">

          <span>
            📍 {job.location || "Location not specified"}
          </span>

          <span>
            💼 {job.type || "Job"}
          </span>

          <span>
            🏢 {job.mode || "Not specified"}
          </span>

          <span>
            ⏱️ {job.duration || "Not specified"}
          </span>

        </div>

        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <p className="job-description">
          {job.description ||
            "No job description available."}
        </p>

        {/* =================================================
            SKILLS
        ================================================= */}

        {skills.length > 0 && (

          <div className="job-skills">

            {skills.map((skill, index) => (

              <span
                key={`${skill}-${index}`}
                className="job-skill"
              >
                {skill}
              </span>

            ))}

          </div>

        )}

      </div>

      {/* =====================================================
          SALARY + BUTTON
      ===================================================== */}

      <div className="job-card-action">

        <div className="job-salary">
          {job.salary || "Salary not specified"}
        </div>

        <button
          type="button"
          className="apply-job-button"
          onClick={() =>
            navigate(`/jobs/${job.id}`)
          }
        >
          View & Apply →
        </button>

      </div>

    </article>
  );
}

export default JobCard;