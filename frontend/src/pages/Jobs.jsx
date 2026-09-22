import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import JobCard from "../components/JobCard";
import "./Jobs.css";

function Jobs() {
  // =========================================================
  // FILTER STATES
  // =========================================================

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("All");
  const [workMode, setWorkMode] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  // =========================================================
  // JOB DATA
  // =========================================================

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =========================================================
  // LOAD JOBS FROM SPRING BOOT
  // =========================================================

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        "http://localhost:8081/api/jobs"
      );

      console.log("Jobs from backend:", response.data);

      const backendJobs = response.data || [];

      // Convert backend format to JobCard format
      const formattedJobs = backendJobs.map((job) => ({
        id: job.id,

        company:
          job.companyName || "Company",

        title:
          job.title || "Untitled Job",

        location:
          job.location || "Not specified",

        // Your current backend Job entity doesn't
        // have a work-mode field.
        // Keep this as "All" compatible.
        mode:
          job.workMode || "Not specified",

        type:
          formatJobType(job.jobType),

        duration:
          job.duration || "Not specified",

        salary:
          job.salary || "Not specified",

        posted:
          formatPostedDate(job.createdAt),

        skills:
          Array.isArray(job.skills)
            ? job.skills
            : [],

        description:
          job.description || "No description available.",

        deadline:
          job.deadline,

        openings:
          job.openings,
      }));

      setJobs(formattedJobs);

    } catch (error) {
      console.error(
        "Error loading jobs:",
        error
      );

      setError(
        "Unable to load jobs. Please make sure the backend is running."
      );

      setJobs([]);

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
  // FILTER + SORT
  // =========================================================

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // =======================================================
    // SEARCH
    // =======================================================

    if (search.trim()) {
      const searchText =
        search.toLowerCase().trim();

      result = result.filter((job) => {

        const title =
          job.title?.toLowerCase() || "";

        const company =
          job.company?.toLowerCase() || "";

        const location =
          job.location?.toLowerCase() || "";

        const description =
          job.description?.toLowerCase() || "";

        const skills =
          Array.isArray(job.skills)
            ? job.skills.join(" ").toLowerCase()
            : "";

        return (
          title.includes(searchText) ||
          company.includes(searchText) ||
          location.includes(searchText) ||
          description.includes(searchText) ||
          skills.includes(searchText)
        );
      });
    }

    // =======================================================
    // LOCATION
    // =======================================================

    if (location.trim()) {
      const locationText =
        location.toLowerCase().trim();

      result = result.filter((job) =>
        job.location
          ?.toLowerCase()
          .includes(locationText)
      );
    }

    // =======================================================
    // JOB TYPE
    // =======================================================

    if (jobType !== "All") {
      result = result.filter(
        (job) => job.type === jobType
      );
    }

    // =======================================================
    // WORK MODE
    // =======================================================

    if (workMode !== "All") {
      result = result.filter(
        (job) => job.mode === workMode
      );
    }

    // =======================================================
    // SORT
    // =======================================================

    if (sortBy === "Newest") {
      result.sort(
        (a, b) => Number(b.id) - Number(a.id)
      );
    }

    if (sortBy === "Oldest") {
      result.sort(
        (a, b) => Number(a.id) - Number(b.id)
      );
    }

    return result;

  }, [
    jobs,
    search,
    location,
    jobType,
    workMode,
    sortBy,
  ]);

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setJobType("All");
    setWorkMode("All");
    setSortBy("Newest");
  };

  // =========================================================
  // SEARCH BUTTON
  // =========================================================

  const handleSearch = () => {
    // Filtering happens automatically.
  };

  // =========================================================
  // LOADING SCREEN
  // =========================================================

  if (loading) {
    return (
      <div className="jobs-page">

        <section className="jobs-content">

          <div className="no-jobs">

            <div className="no-jobs-icon">
              ⏳
            </div>

            <h3>
              Loading jobs...
            </h3>

            <p>
              Finding the latest opportunities for you.
            </p>

          </div>

        </section>

      </div>
    );
  }

  // =========================================================
  // JSX
  // =========================================================

  return (
    <div className="jobs-page">

      {/* =====================================================
          HERO SECTION
      ===================================================== */}

      <section className="jobs-hero">

        <div className="jobs-hero-content">

          <span className="jobs-hero-badge">
            🚀 Find your next opportunity
          </span>

          <h1>
            Find jobs that
            <span> move you forward.</span>
          </h1>

          <p>
            Discover internships and job opportunities
            from companies looking for talented students
            and fresh graduates.
          </p>

        </div>

        {/* ===================================================
            SEARCH BOX
        =================================================== */}

        <div className="jobs-search-container">

          {/* JOB SEARCH */}

          <div className="jobs-search-item">

            <span className="search-icon">
              🔍
            </span>

            <input
              type="text"
              placeholder="Job title, skills or company"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          {/* DIVIDER */}

          <div className="jobs-search-divider"></div>

          {/* LOCATION */}

          <div className="jobs-search-item">

            <span className="search-icon">
              📍
            </span>

            <input
              type="text"
              placeholder="Location"
              value={location}
              onChange={(e) =>
                setLocation(e.target.value)
              }
            />

          </div>

          {/* SEARCH BUTTON */}

          <button
            className="jobs-search-button"
            onClick={handleSearch}
          >
            Search
          </button>

        </div>

      </section>

      {/* =====================================================
          MAIN CONTENT
      ===================================================== */}

      <section className="jobs-content">

        {/* HEADER */}

        <div className="jobs-header">

          <div>

            <h2>
              Recommended opportunities
            </h2>

            <p>
              {filteredJobs.length}{" "}
              {filteredJobs.length === 1
                ? "job"
                : "jobs"}{" "}
              found
            </p>

          </div>

          {/* SORT */}

          <div className="jobs-sort">

            <label>
              Sort by
            </label>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value)
              }
            >

              <option value="Newest">
                Newest
              </option>

              <option value="Oldest">
                Oldest
              </option>

            </select>

          </div>

        </div>

        {/* ===================================================
            FILTERS
        =================================================== */}

        <div className="jobs-filters">

          {/* JOB TYPE */}

          <select
            value={jobType}
            onChange={(e) =>
              setJobType(e.target.value)
            }
          >

            <option value="All">
              All Job Types
            </option>

            <option value="Internship">
              Internship
            </option>

            <option value="Full-time">
              Full-time
            </option>

            <option value="Part-time">
              Part-time
            </option>

          </select>

          {/* WORK MODE */}

          <select
            value={workMode}
            onChange={(e) =>
              setWorkMode(e.target.value)
            }
          >

            <option value="All">
              All Work Modes
            </option>

            <option value="Remote">
              Remote
            </option>

            <option value="Hybrid">
              Hybrid
            </option>

            <option value="On-site">
              On-site
            </option>

          </select>

          {/* CLEAR */}

          <button
            className="clear-filters-button"
            onClick={clearFilters}
          >
            Clear filters
          </button>

        </div>

        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (

          <div className="no-jobs">

            <div className="no-jobs-icon">
              ⚠️
            </div>

            <h3>
              Unable to load jobs
            </h3>

            <p>
              {error}
            </p>

            <button
              onClick={fetchJobs}
            >
              Try again
            </button>

          </div>

        )}

        {/* ===================================================
            JOB LIST
        =================================================== */}

        {!error && (

          <div className="jobs-list">

            {filteredJobs.length === 0 ? (

              <div className="no-jobs">

                <div className="no-jobs-icon">
                  🔍
                </div>

                <h3>
                  No jobs found
                </h3>

                <p>
                  Try changing your search or filters.
                </p>

                <button
                  onClick={clearFilters}
                >
                  Clear filters
                </button>

              </div>

            ) : (

              filteredJobs.map((job) => (

                <JobCard
                  key={job.id}
                  job={job}
                />

              ))

            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default Jobs;