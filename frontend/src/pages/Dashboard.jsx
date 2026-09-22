import { Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const opportunities = [
    {
      title: "Software Development Intern",
      company: "Google",
      location: "Bangalore",
      type: "Internship",
      skills: ["Java", "SQL", "React"],
    },
    {
      title: "Java Developer",
      company: "TCS",
      location: "Chennai",
      type: "Full Time",
      skills: ["Java", "Spring Boot", "SQL"],
    },
    {
      title: "Frontend Developer Intern",
      company: "Zoho",
      location: "Chennai",
      type: "Internship",
      skills: ["React", "HTML", "CSS"],
    },
  ];

  return (
    <div className="dashboard-page">

      {/* Hero */}
      <section className="dashboard-hero">
        <div className="hero-content">
          <p className="hero-label">CAMPUSCONNECT</p>

          <h1>
            Find your next
            <span> opportunity.</span>
          </h1>

          <p className="hero-description">
            Discover internships, jobs and opportunities that help
            you build your career.
          </p>

          <div className="dashboard-search">
            <input
              type="text"
              placeholder="Search jobs, internships, skills..."
            />

            <input
              type="text"
              placeholder="Location"
            />

            <button>Search</button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="dashboard-section">
        <div className="section-heading">
          <div>
            <p className="section-label">EXPLORE</p>
            <h2>Explore opportunities</h2>
          </div>
        </div>

        <div className="category-grid">

          <Link to="/jobs" className="category-card">
            <div className="category-icon">↗</div>
            <h3>Internships</h3>
            <p>Find internships and gain real-world experience.</p>
          </Link>

          <Link to="/jobs" className="category-card">
            <div className="category-icon">◆</div>
            <h3>Jobs</h3>
            <p>Explore career opportunities from companies.</p>
          </Link>

          <div className="category-card">
            <div className="category-icon">★</div>
            <h3>Hackathons</h3>
            <p>Participate in challenges and showcase your skills.</p>
          </div>

          <div className="category-card">
            <div className="category-icon">+</div>
            <h3>Courses</h3>
            <p>Learn new technologies and improve your skills.</p>
          </div>

        </div>
      </section>

      {/* Opportunities */}
      <section className="dashboard-section opportunities-section">

        <div className="section-heading">
          <div>
            <p className="section-label">RECOMMENDED</p>
            <h2>Latest opportunities</h2>
          </div>

          <Link to="/jobs" className="view-all">
            View all →
          </Link>
        </div>

        <div className="opportunity-grid">

          {opportunities.map((job, index) => (
            <div className="opportunity-card" key={index}>

              <div className="company-logo">
                {job.company.charAt(0)}
              </div>

              <div className="job-type">
                {job.type}
              </div>

              <h3>{job.title}</h3>

              <p className="company-name">
                {job.company}
              </p>

              <p className="job-location">
                📍 {job.location}
              </p>

              <div className="skill-list">
                {job.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>

              <Link to="/jobs" className="job-link">
                View opportunity →
              </Link>

            </div>
          ))}

        </div>

      </section>

      {/* CTA */}
      <section className="dashboard-cta">

        <div>
          <p className="section-label">START YOUR JOURNEY</p>

          <h2>
            Your next opportunity
            <br />
            could be one click away.
          </h2>

          <p>
            Create your profile and start discovering
            opportunities built for your career.
          </p>
        </div>

        <Link to="/register" className="cta-button">
          Create profile →
        </Link>

      </section>

    </div>
  );
}

export default Dashboard;