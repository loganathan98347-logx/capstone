import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function PostJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    jobType: "INTERNSHIP",
    salary: "",
    deadline: "",
    openings: 1,
    skills: "",
  });

  const [loading, setLoading] = useState(false);

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================================================
  // SUBMIT JOB
  // =========================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Get logged-in user
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        alert("User session not found. Please login again.");
        navigate("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      console.log("Logged-in user:", user);

      // IMPORTANT:
      // Backend now expects USER ID
      const userId = user?.id;

      if (!userId) {
        alert(
          "User ID not found. Please logout and login again."
        );
        return;
      }

      // =====================================================
      // PREPARE JOB DATA
      // =====================================================

      const requestData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        jobType: formData.jobType,
        salary: formData.salary.trim(),
        deadline: formData.deadline || null,
        openings: Number(formData.openings),

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      console.log("User ID:", userId);
      console.log("Job data:", requestData);

      // =====================================================
      // SEND TO BACKEND
      // =====================================================

      const response = await axios.post(
        `http://localhost:8081/api/jobs?userId=${userId}`,
        requestData
      );

      console.log("Job created:", response.data);

      alert("Job posted successfully!");

      // Go to company jobs
      navigate("/company/jobs");

    } catch (error) {
      console.error("Error posting job:", error);

      console.error(
        "Backend response:",
        error.response?.data
      );

      const message =
        error.response?.data?.error ||
        error.response?.data?.message ||
        "Failed to post job.";

      alert(message);

    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="post-job-page">

      <div className="post-job-container">

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="post-job-header">

          <div>
            <p className="post-job-label">
              CAMPUSCONNECT
            </p>

            <h1>
              Post a Job
            </h1>

            <p>
              Find talented students and fresh graduates
              for your company.
            </p>
          </div>

          <button
            type="button"
            className="back-btn"
            onClick={() =>
              navigate("/company/dashboard")
            }
          >
            ← Dashboard
          </button>

        </div>

        {/* =================================================
            FORM
        ================================================= */}

        <form
          className="post-job-form"
          onSubmit={handleSubmit}
        >

          {/* JOB TITLE */}

          <div className="form-group">

            <label>
              Job Title
            </label>

            <input
              type="text"
              name="title"
              placeholder="Example: Java Backend Developer"
              value={formData.title}
              onChange={handleChange}
              required
            />

          </div>

          {/* JOB TYPE + OPENINGS */}

          <div className="form-row">

            <div className="form-group">

              <label>
                Job Type
              </label>

              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
              >

                <option value="INTERNSHIP">
                  Internship
                </option>

                <option value="FULL_TIME">
                  Full Time
                </option>

                <option value="PART_TIME">
                  Part Time
                </option>

              </select>

            </div>

            <div className="form-group">

              <label>
                Openings
              </label>

              <input
                type="number"
                name="openings"
                min="1"
                value={formData.openings}
                onChange={handleChange}
                required
              />

            </div>

          </div>

          {/* LOCATION */}

          <div className="form-group">

            <label>
              Location
            </label>

            <input
              type="text"
              name="location"
              placeholder="Example: Chennai / Remote"
              value={formData.location}
              onChange={handleChange}
              required
            />

          </div>

          {/* SALARY */}

          <div className="form-group">

            <label>
              Salary / Stipend
            </label>

            <input
              type="text"
              name="salary"
              placeholder="Example: ₹25,000/month"
              value={formData.salary}
              onChange={handleChange}
            />

          </div>

          {/* DEADLINE */}

          <div className="form-group">

            <label>
              Application Deadline
            </label>

            <input
              type="date"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              required
            />

          </div>

          {/* SKILLS */}

          <div className="form-group">

            <label>
              Required Skills
            </label>

            <input
              type="text"
              name="skills"
              placeholder="Java, Spring Boot, PostgreSQL, Git"
              value={formData.skills}
              onChange={handleChange}
            />

            <small>
              Separate skills using commas.
            </small>

          </div>

          {/* DESCRIPTION */}

          <div className="form-group">

            <label>
              Job Description
            </label>

            <textarea
              name="description"
              rows="7"
              placeholder="Describe the role, responsibilities, requirements and benefits..."
              value={formData.description}
              onChange={handleChange}
              required
            />

          </div>

          {/* BUTTONS */}

          <div className="form-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={() =>
                navigate("/company/dashboard")
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="post-btn"
              disabled={loading}
            >
              {loading
                ? "Posting..."
                : "Post Job"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default PostJob;