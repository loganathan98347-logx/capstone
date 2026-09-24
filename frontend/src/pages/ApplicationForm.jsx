import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./ApplicationForm.css";

function ApplicationForm() {
  const navigate = useNavigate();
  const { jobId } = useParams();

  // =========================================================
  // STATE
  // =========================================================

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [resumeFile, setResumeFile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",

    candidateType: "FRESHER",
    experienceYears: "",

    projects: "",

    degree: "",
    department: "",

    address: "",
    country: "India",
    state: "",
    district: "",
    town: "",
  });

  // =========================================================
  // LOAD JOB + USER
  // =========================================================

  useEffect(() => {
    loadData();
  }, [jobId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      // -----------------------------------------------------
      // GET LOGGED-IN USER
      // -----------------------------------------------------

      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        navigate("/login");
        return;
      }

      let user;

      try {
        user = JSON.parse(storedUser);
      } catch (err) {
        console.error("Invalid user data:", err);

        localStorage.removeItem("user");
        navigate("/login");
        return;
      }

      if (!user?.id) {
        setError("User ID not found. Please login again.");
        return;
      }

      // -----------------------------------------------------
      // GET JOB
      // -----------------------------------------------------

      const response = await axios.get(
        `http://localhost:8081/api/jobs/${jobId}`
      );

      console.log("Application Job:", response.data);

      setJob(response.data);

      // -----------------------------------------------------
      // PRE-FILL USER INFORMATION
      // -----------------------------------------------------

      setFormData((previous) => ({
        ...previous,

        fullName:
          user.name ||
          user.fullName ||
          "",

        email:
          user.email ||
          "",
      }));

    } catch (err) {
      console.error("Error loading application page:", err);

      console.error(
        "Backend response:",
        err.response?.data
      );

      if (err.response?.status === 404) {
        setError("Job not found.");
      } else {
        setError(
          "Unable to load application form. Please make sure the backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // =========================================================
  // HANDLE CANDIDATE TYPE
  // =========================================================

  const handleCandidateTypeChange = (type) => {
    setFormData((previous) => ({
      ...previous,

      candidateType: type,

      experienceYears:
        type === "FRESHER"
          ? ""
          : previous.experienceYears,

      projects:
        type === "EXPERIENCED"
          ? ""
          : previous.projects,
    }));

    setError("");
  };

  // =========================================================
  // HANDLE RESUME
  // =========================================================

  const handleResumeChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      setResumeFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    const allowedExtensions = [
      ".pdf",
      ".doc",
      ".docx",
    ];

    const fileName = file.name.toLowerCase();

    const validExtension = allowedExtensions.some(
      (extension) => fileName.endsWith(extension)
    );

    const validMimeType =
      allowedTypes.includes(file.type);

    if (!validExtension && !validMimeType) {
      setResumeFile(null);

      event.target.value = "";

      setError(
        "Please upload a PDF, DOC, or DOCX resume."
      );

      return;
    }

    // Maximum 5 MB
    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setResumeFile(null);

      event.target.value = "";

      setError(
        "Resume size must be less than 5 MB."
      );

      return;
    }

    setResumeFile(file);
    setError("");
  };

  // =========================================================
  // VALIDATE FORM
  // =========================================================

  const validateForm = () => {
    if (!resumeFile) {
      return "Please upload your resume.";
    }

    if (!formData.fullName.trim()) {
      return "Please enter your full name.";
    }

    if (!formData.phoneNumber.trim()) {
      return "Please enter your phone number.";
    }

    const phone = formData.phoneNumber.trim();

    if (!/^[0-9]{10}$/.test(phone)) {
      return "Please enter a valid 10-digit phone number.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email ID.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (formData.candidateType === "EXPERIENCED") {
      if (!formData.experienceYears) {
        return "Please enter your years of experience.";
      }

      if (Number(formData.experienceYears) < 0) {
        return "Experience cannot be negative.";
      }
    }

    if (formData.candidateType === "FRESHER") {
      if (!formData.projects.trim()) {
        return "Please mention at least one project.";
      }
    }

    if (!formData.degree.trim()) {
      return "Please enter your degree.";
    }

    if (!formData.department.trim()) {
      return "Please enter your department.";
    }

    if (!formData.address.trim()) {
      return "Please enter your address.";
    }

    if (!formData.country.trim()) {
      return "Please enter your country.";
    }

    if (!formData.state.trim()) {
      return "Please enter your state.";
    }

    if (!formData.district.trim()) {
      return "Please enter your district.";
    }

    if (!formData.town.trim()) {
      return "Please enter your town / city.";
    }

    return "";
  };

  // =========================================================
  // SUBMIT APPLICATION
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    // -------------------------------------------------------
    // VALIDATE
    // -------------------------------------------------------

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    // -------------------------------------------------------
    // GET USER
    // -------------------------------------------------------

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    let user;

    try {
      user = JSON.parse(storedUser);
    } catch (err) {
      console.error("Invalid user:", err);

      localStorage.removeItem("user");

      alert("Your login session is invalid. Please login again.");

      navigate("/login");
      return;
    }

    if (!user?.id) {
      setError(
        "User ID not found. Please login again."
      );
      return;
    }

    // -------------------------------------------------------
    // CREATE MULTIPART FORM DATA
    // -------------------------------------------------------

    const applicationData = new FormData();

    // Resume
    applicationData.append(
      "resume",
      resumeFile
    );

    // User + Job
    applicationData.append(
      "userId",
      String(user.id)
    );

    applicationData.append(
      "jobId",
      String(jobId)
    );

    // Personal information
    applicationData.append(
      "fullName",
      formData.fullName.trim()
    );

    applicationData.append(
      "phoneNumber",
      formData.phoneNumber.trim()
    );

    applicationData.append(
      "email",
      formData.email.trim()
    );

    // Candidate type
    applicationData.append(
      "candidateType",
      formData.candidateType
    );

    // Experience / Projects
    if (
      formData.candidateType ===
      "EXPERIENCED"
    ) {
      applicationData.append(
        "experienceYears",
        formData.experienceYears
      );

      // Send empty projects so backend receives the field
      applicationData.append(
        "projects",
        ""
      );
    } else {
      applicationData.append(
        "experienceYears",
        ""
      );

      applicationData.append(
        "projects",
        formData.projects.trim()
      );
    }

    // Education
    applicationData.append(
      "degree",
      formData.degree.trim()
    );

    applicationData.append(
      "department",
      formData.department.trim()
    );

    // Address
    applicationData.append(
      "address",
      formData.address.trim()
    );

    applicationData.append(
      "country",
      formData.country.trim()
    );

    applicationData.append(
      "state",
      formData.state.trim()
    );

    applicationData.append(
      "district",
      formData.district.trim()
    );

    applicationData.append(
      "town",
      formData.town.trim()
    );

    // -------------------------------------------------------
    // DEBUG FORM DATA
    // -------------------------------------------------------

    console.log(
      "Submitting application..."
    );

    for (const [key, value] of applicationData.entries()) {
      if (value instanceof File) {
        console.log(
          key,
          "=>",
          value.name,
          value.type,
          value.size
        );
      } else {
        console.log(
          key,
          "=>",
          value
        );
      }
    }

    // -------------------------------------------------------
    // SEND TO BACKEND
    // -------------------------------------------------------

    try {
      setSubmitting(true);

      const response = await axios.post(
        "http://localhost:8081/api/applications/submit",
        applicationData
      );

      console.log(
        "Application submitted:",
        response.data
      );

      setSuccess(
        "Application submitted successfully!"
      );

      // -----------------------------------------------------
      // REDIRECT
      // -----------------------------------------------------

      setTimeout(() => {
        navigate("/applications");
      }, 1500);

    } catch (err) {
      console.error(
        "Application submission error:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Backend response:",
        err.response?.data
      );

      let errorMessage =
        "Unable to submit application.";

      if (err.response?.data?.error) {
        errorMessage =
          err.response.data.error;
      } else if (
        typeof err.response?.data ===
        "string"
      ) {
        errorMessage =
          err.response.data;
      } else if (
        err.response?.status === 400
      ) {
        errorMessage =
          "Invalid application data. Please check all fields and your resume.";
      } else if (
        err.response?.status === 404
      ) {
        errorMessage =
          "Student or job was not found.";
      } else if (
        err.response?.status === 500
      ) {
        errorMessage =
          "Server error. Please check the Spring Boot terminal.";
      }

      setError(errorMessage);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

    } finally {
      setSubmitting(false);
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="application-page">
        <div className="application-loading">
          <div className="application-spinner"></div>

          <p>
            Loading application form...
          </p>
        </div>
      </div>
    );
  }

  // =========================================================
  // ERROR WITHOUT JOB
  // =========================================================

  if (!job) {
    return (
      <div className="application-page">
        <div className="application-error-page">

          <h2>
            {error || "Job not found"}
          </h2>

          <button
            onClick={() => navigate("/jobs")}
          >
            ← Back to Jobs
          </button>

        </div>
      </div>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <div className="application-page">

      <div className="application-container">

        {/* =================================================
            BACK BUTTON
        ================================================= */}

        <button
          type="button"
          className="application-back-button"
          onClick={() =>
            navigate(`/jobs/${jobId}`)
          }
        >
          ← Back to Job
        </button>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="application-header">

          <div className="application-header-logo">
            {(
              job.companyName ||
              job.company?.name ||
              "C"
            )
              .charAt(0)
              .toUpperCase()}
          </div>

          <div>

            <p className="application-company">
              {job.companyName ||
                job.company?.name ||
                "Company"}
            </p>

            <h1>
              Apply for {job.title}
            </h1>

            <p className="application-location">
              📍{" "}
              {job.location ||
                "Location not specified"}
            </p>

          </div>

        </div>

        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {success && (
          <div className="application-success">
            ✓ {success}
          </div>
        )}

        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (
          <div className="application-error">
            ⚠ {error}
          </div>
        )}

        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="application-form"
          onSubmit={handleSubmit}
          noValidate
        >

          {/* =================================================
              RESUME
          ================================================= */}

          <section className="application-section">

            <div className="section-heading">
              <span>01</span>

              <div>
                <h2>
                  Resume
                </h2>

                <p>
                  Upload your latest resume.
                </p>
              </div>
            </div>

            <div className="form-group">

              <label>
                Resume <span>*</span>
              </label>

              <div className="resume-upload">

                <input
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                />

                <label
                  htmlFor="resume"
                  className="resume-upload-label"
                >

                  <div className="upload-icon">
                    📄
                  </div>

                  <div className="upload-text">

                    {resumeFile ? (
                      <>
                        <strong>
                          {resumeFile.name}
                        </strong>

                        <small>
                          Click to change resume
                        </small>
                      </>
                    ) : (
                      <>
                        <strong>
                          Choose Resume
                        </strong>

                        <small>
                          PDF, DOC or DOCX • Max 5 MB
                        </small>
                      </>
                    )}

                  </div>

                </label>

              </div>

            </div>

          </section>

          {/* =================================================
              PERSONAL DETAILS
          ================================================= */}

          <section className="application-section">

            <div className="section-heading">
              <span>02</span>

              <div>
                <h2>
                  Personal Information
                </h2>

                <p>
                  Tell the company about yourself.
                </p>
              </div>
            </div>

            <div className="form-grid">

              {/* FULL NAME */}

              <div className="form-group">

                <label htmlFor="fullName">
                  Full Name <span>*</span>
                </label>

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                />

              </div>

              {/* PHONE */}

              <div className="form-group">

                <label htmlFor="phoneNumber">
                  Phone Number <span>*</span>
                </label>

                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  inputMode="numeric"
                  maxLength="10"
                  placeholder="Enter 10-digit phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />

              </div>

              {/* EMAIL */}

              <div className="form-group full-width">

                <label htmlFor="email">
                  Email ID <span>*</span>
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={formData.email}
                  onChange={handleChange}
                />

              </div>

            </div>

          </section>

          {/* =================================================
              EXPERIENCE
          ================================================= */}

          <section className="application-section">

            <div className="section-heading">
              <span>03</span>

              <div>
                <h2>
                  Experience
                </h2>

                <p>
                  Tell us about your career experience.
                </p>
              </div>
            </div>

            <div className="candidate-type">

              <label className="candidate-option">

                <input
                  type="radio"
                  name="candidateType"
                  checked={
                    formData.candidateType ===
                    "FRESHER"
                  }
                  onChange={() =>
                    handleCandidateTypeChange(
                      "FRESHER"
                    )
                  }
                />

                <div>
                  <strong>
                    Fresher
                  </strong>

                  <small>
                    I don't have professional work experience
                  </small>
                </div>

              </label>

              <label className="candidate-option">

                <input
                  type="radio"
                  name="candidateType"
                  checked={
                    formData.candidateType ===
                    "EXPERIENCED"
                  }
                  onChange={() =>
                    handleCandidateTypeChange(
                      "EXPERIENCED"
                    )
                  }
                />

                <div>
                  <strong>
                    Experienced
                  </strong>

                  <small>
                    I have professional work experience
                  </small>
                </div>

              </label>

            </div>

            {/* =================================================
                EXPERIENCE YEARS
            ================================================= */}

            {formData.candidateType ===
              "EXPERIENCED" && (
              <div className="form-group dynamic-field">

                <label htmlFor="experienceYears">
                  Years of Experience <span>*</span>
                </label>

                <input
                  id="experienceYears"
                  name="experienceYears"
                  type="number"
                  min="0"
                  step="0.1"
                  placeholder="Example: 2"
                  value={
                    formData.experienceYears
                  }
                  onChange={handleChange}
                />

              </div>
            )}

            {/* =================================================
                PROJECTS
            ================================================= */}

            {formData.candidateType ===
              "FRESHER" && (
              <div className="form-group dynamic-field">

                <label htmlFor="projects">
                  Projects <span>*</span>
                </label>

                <textarea
                  id="projects"
                  name="projects"
                  rows="5"
                  placeholder="Mention your academic, personal or internship projects..."
                  value={formData.projects}
                  onChange={handleChange}
                />

              </div>
            )}

          </section>

          {/* =================================================
              EDUCATION
          ================================================= */}

          <section className="application-section">

            <div className="section-heading">
              <span>04</span>

              <div>
                <h2>
                  Education
                </h2>

                <p>
                  Enter your educational information.
                </p>
              </div>
            </div>

            <div className="form-grid">

              {/* DEGREE */}

              <div className="form-group">

                <label htmlFor="degree">
                  Degree <span>*</span>
                </label>

                <input
                  id="degree"
                  name="degree"
                  type="text"
                  placeholder="Example: B.E"
                  value={formData.degree}
                  onChange={handleChange}
                />

              </div>

              {/* DEPARTMENT */}

              <div className="form-group">

                <label htmlFor="department">
                  Department <span>*</span>
                </label>

                <input
                  id="department"
                  name="department"
                  type="text"
                  placeholder="Example: Computer Science and Engineering"
                  value={
                    formData.department
                  }
                  onChange={handleChange}
                />

              </div>

            </div>

          </section>

          {/* =================================================
              ADDRESS
          ================================================= */}

          <section className="application-section">

            <div className="section-heading">
              <span>05</span>

              <div>
                <h2>
                  Address
                </h2>

                <p>
                  Provide your current location details.
                </p>
              </div>
            </div>

            <div className="form-grid">

              {/* ADDRESS */}

              <div className="form-group full-width">

                <label htmlFor="address">
                  Address <span>*</span>
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows="4"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={handleChange}
                />

              </div>

              {/* COUNTRY */}

              <div className="form-group">

                <label htmlFor="country">
                  Country <span>*</span>
                </label>

                <input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleChange}
                />

              </div>

              {/* STATE */}

              <div className="form-group">

                <label htmlFor="state">
                  State <span>*</span>
                </label>

                <input
                  id="state"
                  name="state"
                  type="text"
                  placeholder="Example: Tamil Nadu"
                  value={formData.state}
                  onChange={handleChange}
                />

              </div>

              {/* DISTRICT */}

              <div className="form-group">

                <label htmlFor="district">
                  District <span>*</span>
                </label>

                <input
                  id="district"
                  name="district"
                  type="text"
                  placeholder="Example: Tiruchirappalli"
                  value={formData.district}
                  onChange={handleChange}
                />

              </div>

              {/* TOWN */}

              <div className="form-group">

                <label htmlFor="town">
                  Town / City <span>*</span>
                </label>

                <input
                  id="town"
                  name="town"
                  type="text"
                  placeholder="Example: Manapparai"
                  value={formData.town}
                  onChange={handleChange}
                />

              </div>

            </div>

          </section>

          {/* =================================================
              SUBMIT
          ================================================= */}

          <div className="application-submit-area">

            <p>
              Please check all your details before
              submitting your application.
            </p>

            <button
              type="submit"
              className="submit-application-button"
              disabled={submitting}
            >

              {submitting ? (
                <>
                  <span className="button-spinner"></span>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Application →
                </>
              )}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default ApplicationForm;