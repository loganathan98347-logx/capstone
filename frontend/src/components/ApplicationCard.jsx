function ApplicationCard({ application }) {
  const data = application || {
    jobTitle: "Software Developer Intern",
    company: "Tech Solutions",
    location: "Chennai",
    appliedDate: "12 Sep 2026",
    status: "Under Review",
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Applied":
        return "status-applied";

      case "Under Review":
        return "status-review";

      case "Shortlisted":
        return "status-shortlisted";

      case "Rejected":
        return "status-rejected";

      default:
        return "";
    }
  };

  return (
    <div className="application-card">

      <div className="application-left">

        <div className="application-logo">
          {data.company.charAt(0)}
        </div>

        <div>
          <h2>{data.jobTitle}</h2>

          <p className="application-company">
            {data.company}
          </p>

          <p className="application-location">
            📍 {data.location}
          </p>
        </div>

      </div>

      <div className="application-right">

        <span
          className={`application-status ${getStatusClass(
            data.status
          )}`}
        >
          {data.status}
        </span>

        <p className="application-date">
          Applied on {data.appliedDate}
        </p>

        <button className="application-view-button">
          View Application
        </button>

      </div>

    </div>
  );
}

export default ApplicationCard;