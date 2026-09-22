function CompanyCard({ company }) {
  const data = company || {
    id: 1,
    name: "Tech Solutions",
    industry: "Software & Technology",
    location: "Chennai",
    jobs: 8,
  };

  return (
    <div className="company-card">

      <div className="company-card-header">

        <div className="company-logo">
          {data.name.charAt(0)}
        </div>

        <div>
          <h2>{data.name}</h2>

          <p className="company-industry">
            {data.industry}
          </p>
        </div>

      </div>

      <div className="company-info">

        <p>
          📍 {data.location}
        </p>

        <p>
          💼 {data.jobs} open jobs
        </p>

      </div>

      <button className="view-company-button">
        View Company
      </button>

    </div>
  );
}

export default CompanyCard;