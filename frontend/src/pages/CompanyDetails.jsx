import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCompanyById } from "../services/companyService";
import "./CompanyDetails.css";

function CompanyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadCompany();
  }, [id]);

  const loadCompany = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCompanyById(id);

      setCompany(data);
    } catch (err) {
      console.error("Error loading company:", err);
      setError("Unable to load company details.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="company-details-page">
        <div className="company-details-loading">
          <div className="loading-spinner"></div>
          <p>Loading company...</p>
        </div>
      </div>
    );
  }

  if (error || !company) {
    return (
      <div className="company-details-page">
        <div className="company-details-error">
          <div>⚠️</div>
          <h2>Company not found</h2>
          <p>{error || "This company does not exist."}</p>

          <button onClick={() => navigate("/companies")}>
            ← Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="company-details-page">

      {/* BACK */}
      <div className="company-details-container">

        <button
          className="back-companies-button"
          onClick={() => navigate("/companies")}
        >
          ← Back to Companies
        </button>

        {/* COMPANY HEADER */}
        <section className="company-details-header glass">

          <div className="company-details-logo">
            {company.name
              ?.charAt(0)
              .toUpperCase()}
          </div>

          <div className="company-details-header-info">

            <span className="company-details-label">
              COMPANY
            </span>

            <h1>{company.name}</h1>

            <p>
              {company.industry ||
                "Technology & Services"}
            </p>

            <div className="company-details-meta">

              <span>
                📍{" "}
                {company.location ||
                  "Location not available"}
              </span>

              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  🌐 Website
                </a>
              )}

            </div>

          </div>

        </section>

        {/* CONTENT */}
        <div className="company-details-grid">

          <main>

            {/* ABOUT */}
            <section className="company-details-card glass">

              <span className="section-label">
                ABOUT COMPANY
              </span>

              <h2>
                About {company.name}
              </h2>

              <p className="company-about-text">
                {company.description ||
                  "This company has not added a description yet."}
              </p>

            </section>

            {/* CONTACT */}
            <section className="company-details-card glass">

              <span className="section-label">
                COMPANY INFORMATION
              </span>

              <h2>
                Contact Information
              </h2>

              <div className="company-info-list">

                <div className="company-info-item">
                  <span>📧</span>
                  <div>
                    <small>Email</small>
                    <p>
                      {company.email ||
                        "Not available"}
                    </p>
                  </div>
                </div>

                <div className="company-info-item">
                  <span>📍</span>
                  <div>
                    <small>Location</small>
                    <p>
                      {company.location ||
                        "Not available"}
                    </p>
                  </div>
                </div>

                <div className="company-info-item">
                  <span>🏭</span>
                  <div>
                    <small>Industry</small>
                    <p>
                      {company.industry ||
                        "Not specified"}
                    </p>
                  </div>
                </div>

              </div>

            </section>

          </main>

          {/* SIDEBAR */}
          <aside>

            <section className="company-details-sidebar glass">

              <span className="section-label">
                OPPORTUNITIES
              </span>

              <h2>
                Jobs & Internships
              </h2>

              <p>
                Explore internships and job
                opportunities posted by{" "}
                {company.name}.
              </p>

              <button
                className="company-jobs-button"
                onClick={() =>
                  navigate(
                    `/jobs?company=${company.id}`
                  )
                }
              >
                View Opportunities →
              </button>

            </section>

            <section className="company-details-sidebar glass">

              <span className="section-label">
                COMPANY
              </span>

              <h3>
                {company.name}
              </h3>

              <p>
                Connect with this company and
                explore opportunities available
                for students.
              </p>

            </section>

          </aside>

        </div>

      </div>

    </div>
  );
}

export default CompanyDetails;