import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCompanies,
  searchCompanies,
} from "../services/companyService";
import "./Companies.css";

function Companies() {
  const navigate = useNavigate();

  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Load all companies
  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getCompanies();

      setCompanies(data);
    } catch (err) {
      console.error("Error loading companies:", err);
      setError(
        "Unable to load companies. Please check whether the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  // Search companies
  const handleSearch = async (e) => {
    const value = e.target.value;

    setSearch(value);

    if (!value.trim()) {
      loadCompanies();
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await searchCompanies(value);

      setCompanies(data);
    } catch (err) {
      console.error("Error searching companies:", err);
      setError("Unable to search companies.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="companies-page">

      {/* HERO */}
      <section className="companies-hero">

        <div className="companies-hero-content">

          <span className="companies-hero-badge">
            🏢 Explore companies
          </span>

          <h1>
            Discover companies
            <span> building the future.</span>
          </h1>

          <p>
            Explore companies, discover their opportunities,
            and find the right place to start your career.
          </p>

          {/* SEARCH */}
          <div className="companies-search">

            <div className="companies-search-box">

              <span className="search-icon">
                🔍
              </span>

              <input
                type="text"
                value={search}
                onChange={handleSearch}
                placeholder="Search company name..."
              />

              {search && (
                <button
                  type="button"
                  className="clear-search"
                  onClick={() => {
                    setSearch("");
                    loadCompanies();
                  }}
                >
                  ×
                </button>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* CONTENT */}
      <section className="companies-content">

        <div className="companies-header">

          <div>
            <span className="section-label">
              COMPANIES
            </span>

            <h2>
              {search
                ? `Search results for "${search}"`
                : "Explore companies"}
            </h2>

            <p>
              {loading
                ? "Loading companies..."
                : `${companies.length} ${
                    companies.length === 1
                      ? "company"
                      : "companies"
                  } found`}
            </p>
          </div>

        </div>

        {/* ERROR */}
        {error && (
          <div className="companies-error">
            <span>⚠️</span>
            <p>{error}</p>

            <button
              type="button"
              onClick={loadCompanies}
            >
              Try Again
            </button>
          </div>
        )}

        {/* LOADING */}
        {loading && !error && (
          <div className="companies-loading">
            <div className="loading-spinner"></div>
            <p>Loading companies...</p>
          </div>
        )}

        {/* COMPANY GRID */}
        {!loading &&
          !error &&
          companies.length > 0 && (

            <div className="companies-grid">

              {companies.map((company) => (

                <article
                  className="company-card"
                  key={company.id}
                >

                  {/* LOGO */}
                  <div className="company-card-top">

                    <div className="company-logo">
                      {(
                        company.name || "C"
                      )
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <span className="company-jobs">
                      {company.jobsCount ??
                        company.jobs ??
                        0}{" "}
                      Jobs
                    </span>

                  </div>

                  {/* INFO */}
                  <div className="company-card-info">

                    <h3>
                      {company.name}
                    </h3>

                    <p className="company-industry">
                      {company.industry ||
                        "Technology"}
                    </p>

                    <p className="company-description">
                      {company.description ||
                        "Explore career opportunities and internships from this company."}
                    </p>

                    <div className="company-location">
                      <span>📍</span>

                      {company.location ||
                        "Location not available"}
                    </div>

                  </div>

                  {/* BUTTON */}
                  <div className="company-card-action">

                    <button
                      type="button"
                      className="company-button"
                      onClick={() =>
                        navigate(
                          `/companies/${company.id}`
                        )
                      }
                    >
                      View Company →
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        {/* NO RESULTS */}
        {!loading &&
          !error &&
          companies.length === 0 && (

            <div className="no-companies">

              <div className="no-companies-icon">
                🔍
              </div>

              <h3>
                No companies found
              </h3>

              <p>
                Try searching with another
                company name.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  loadCompanies();
                }}
              >
                Show All Companies
              </button>

            </div>

          )}

      </section>

    </div>
  );
}

export default Companies;