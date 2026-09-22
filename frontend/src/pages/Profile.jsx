import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

function Profile() {
  const navigate = useNavigate();

  /* =========================================================
     GET LOGGED-IN USER
  ========================================================= */

  const storedUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const storedEmail =
    localStorage.getItem("userEmail") || "";

  /* =========================================================
     REAL ACCOUNT ROLE
     IMPORTANT:
     Authenticated user role has priority over saved profile.
  ========================================================= */

  const accountRole =
    storedUser?.role || "STUDENT";

  const displayRole =
    accountRole === "COMPANY"
      ? "Company"
      : accountRole === "STUDENT"
        ? "Student"
        : accountRole;


  /* =========================================================
     SAVED PROFILE
  ========================================================= */

  const savedProfile = JSON.parse(
    localStorage.getItem("profile") || "null"
  );


  /* =========================================================
     PROFILE DATA
  ========================================================= */

  const [profile, setProfile] = useState(() => ({
    name:
      storedUser?.name ||
      savedProfile?.name ||
      "User",

    email:
      storedUser?.email ||
      savedProfile?.email ||
      storedEmail ||
      "",

    location:
      savedProfile?.location ||
      "Tamil Nadu, India",

    /*
      NEVER take role from old profile first.
      The login account role is the source of truth.
    */
    role: accountRole,

    college:
      savedProfile?.college ||
      "JJ College of Engineering Technology",

    degree:
      savedProfile?.degree ||
      "BE",

    branch:
      savedProfile?.branch ||
      "Computer Science Engineering",

    graduationYear:
      savedProfile?.graduationYear ||
      "2028",

    cgpa:
      savedProfile?.cgpa ||
      "",

    bio:
      savedProfile?.bio ||
      "",

    skills:
      savedProfile?.skills ||
      [],

    languages:
      savedProfile?.languages ||
      ["Tamil", "English"],

    projects:
      savedProfile?.projects ||
      [],

    certifications:
      savedProfile?.certifications ||
      [],

    experience:
      savedProfile?.experience ||
      [],

    internshipType:
      savedProfile?.internshipType ||
      "Internship",

    workMode:
      savedProfile?.workMode ||
      "Any",

    preferredLocation:
      savedProfile?.preferredLocation ||
      "Chennai",

    /* Company fields */
    companyName:
      savedProfile?.companyName ||
      storedUser?.name ||
      "",

    industry:
      savedProfile?.industry ||
      "",

    website:
      savedProfile?.website ||
      "",

    companyDescription:
      savedProfile?.companyDescription ||
      "",

    companyAddress:
      savedProfile?.companyAddress ||
      "",
  }));


  /* =========================================================
     EDITING STATES
  ========================================================= */

  const [editing, setEditing] = useState(false);

  const [skillInput, setSkillInput] =
    useState("");

  const [projectInput, setProjectInput] =
    useState("");

  const [certificationInput, setCertificationInput] =
    useState("");


  /* =========================================================
     AVAILABLE LANGUAGES
  ========================================================= */

  const availableLanguages = [
    "Tamil",
    "English",
    "Hindi",
    "Telugu",
    "Malayalam",
    "Kannada",
    "French",
    "German",
    "Japanese",
  ];


  /* =========================================================
     HANDLE INPUT
  ========================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((previous) => ({
      ...previous,
      [name]: value,
    }));
  };


  /* =========================================================
     LANGUAGE TOGGLE
  ========================================================= */

  const toggleLanguage = (language) => {
    setProfile((previous) => {
      const exists =
        previous.languages.includes(language);

      return {
        ...previous,

        languages: exists
          ? previous.languages.filter(
              (item) => item !== language
            )
          : [
              ...previous.languages,
              language,
            ],
      };
    });
  };


  /* =========================================================
     ADD SKILL
  ========================================================= */

  const addSkill = () => {
    const skill = skillInput.trim();

    if (!skill) return;

    if (
      profile.skills.some(
        (item) =>
          item.toLowerCase() ===
          skill.toLowerCase()
      )
    ) {
      setSkillInput("");
      return;
    }

    setProfile((previous) => ({
      ...previous,

      skills: [
        ...previous.skills,
        skill,
      ],
    }));

    setSkillInput("");
  };


  /* =========================================================
     REMOVE SKILL
  ========================================================= */

  const removeSkill = (skillToRemove) => {
    setProfile((previous) => ({
      ...previous,

      skills:
        previous.skills.filter(
          (skill) =>
            skill !== skillToRemove
        ),
    }));
  };


  /* =========================================================
     ADD PROJECT
  ========================================================= */

  const addProject = () => {
    const project =
      projectInput.trim();

    if (!project) return;

    setProfile((previous) => ({
      ...previous,

      projects: [
        ...previous.projects,
        project,
      ],
    }));

    setProjectInput("");
  };


  /* =========================================================
     REMOVE PROJECT
  ========================================================= */

  const removeProject = (projectToRemove) => {
    setProfile((previous) => ({
      ...previous,

      projects:
        previous.projects.filter(
          (project) =>
            project !== projectToRemove
        ),
    }));
  };


  /* =========================================================
     ADD CERTIFICATION
  ========================================================= */

  const addCertification = () => {
    const certification =
      certificationInput.trim();

    if (!certification) return;

    setProfile((previous) => ({
      ...previous,

      certifications: [
        ...previous.certifications,
        certification,
      ],
    }));

    setCertificationInput("");
  };


  /* =========================================================
     REMOVE CERTIFICATION
  ========================================================= */

  const removeCertification =
    (certificationToRemove) => {
      setProfile((previous) => ({
        ...previous,

        certifications:
          previous.certifications.filter(
            (certification) =>
              certification !==
              certificationToRemove
          ),
      }));
    };


  /* =========================================================
     SAVE PROFILE
  ========================================================= */

  const handleSave = () => {
    /*
      Keep the real authenticated role.
      User cannot accidentally change COMPANY to STUDENT.
    */

    const updatedProfile = {
      ...profile,
      role: accountRole,
    };

    localStorage.setItem(
      "profile",
      JSON.stringify(updatedProfile)
    );


    /* =========================================
       UPDATE USER
       Preserve original account role
    ========================================= */

    const currentUser = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    const updatedUser = {
      ...(currentUser || {}),

      name:
        updatedProfile.name,

      email:
        updatedProfile.email,

      role:
        currentUser?.role ||
        accountRole,
    };


    localStorage.setItem(
      "user",
      JSON.stringify(updatedUser)
    );


    localStorage.setItem(
      "userEmail",
      updatedProfile.email
    );


    setProfile(updatedProfile);

    setEditing(false);
  };


  /* =========================================================
     CANCEL
  ========================================================= */

  const handleCancel = () => {
    const saved =
      JSON.parse(
        localStorage.getItem("profile") ||
          "null"
      );

    setProfile({
      ...(saved || profile),

      /*
        Always restore real account role
      */
      role: accountRole,

      /*
        Always restore real account email
      */
      email:
        storedUser?.email ||
        saved?.email ||
        storedEmail ||
        "",
    });

    setEditing(false);
  };


  /* =========================================================
     PROFILE COMPLETION
  ========================================================= */

  const completionFields =
    accountRole === "COMPANY"
      ? [
          profile.name,
          profile.email,
          profile.location,
          profile.companyName,
          profile.industry,
          profile.website,
          profile.companyDescription,
          profile.companyAddress,
        ]
      : [
          profile.name,
          profile.email,
          profile.location,
          profile.college,
          profile.degree,
          profile.branch,
          profile.graduationYear,
          profile.cgpa,
          profile.bio,
          profile.skills.length > 0,
          profile.languages.length > 0,
          profile.projects.length > 0,
          profile.certifications.length > 0,
          profile.preferredLocation,
        ];

  const completedFields =
    completionFields.filter(Boolean).length;

  const completion = Math.round(
    (completedFields /
      completionFields.length) *
      100
  );


  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <div className="profile-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="profile-hero">

        <div className="profile-hero-content">

          <span className="profile-badge">
            CAMPUSCONNECT
          </span>

          <h1>
            My Profile
          </h1>

          <p>
            {accountRole === "COMPANY"
              ? "Build your company profile and connect with talented students."
              : "Build your profile and increase your chances of getting internships and jobs."}
          </p>

        </div>

      </section>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <main className="profile-content">

        {/* ===================================================
            PROFILE HEADER
        =================================================== */}

        <section className="profile-header-card">

          <div className="profile-avatar">
            {profile.name
              ? profile.name
                  .charAt(0)
                  .toUpperCase()
              : "U"}
          </div>


          <div className="profile-header-info">

            <span className="profile-role">
              {displayRole}
            </span>

            <h2>
              {profile.name}
            </h2>

            <p>
              {profile.email}
            </p>

          </div>


          <div className="profile-header-action">

            {!editing ? (

              <button
                className="edit-profile-button"
                onClick={() =>
                  setEditing(true)
                }
              >
                ✎ Edit Profile
              </button>

            ) : (

              <div className="edit-actions">

                <button
                  className="cancel-profile-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>

                <button
                  className="save-profile-button"
                  onClick={handleSave}
                >
                  Save Changes
                </button>

              </div>

            )}

          </div>

        </section>


        {/* ===================================================
            COMPANY PROFILE
        =================================================== */}

        {accountRole === "COMPANY" ? (

          <div className="profile-grid">

            <div className="profile-main">

              {/* COMPANY INFORMATION */}

              <section className="profile-card">

                <div className="profile-card-title">

                  <div>

                    <span className="section-label">
                      COMPANY DETAILS
                    </span>

                    <h2>
                      Company Information
                    </h2>

                  </div>

                </div>


                <div className="profile-form-grid">

                  {/* COMPANY NAME */}

                  <div className="profile-field full-width">

                    <label>
                      Company Name *
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="companyName"
                        value={
                          profile.companyName
                        }
                        onChange={handleChange}
                        placeholder="Company name"
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.companyName ||
                          "Not added"}
                      </div>

                    )}

                  </div>


                  {/* EMAIL */}

                  <div className="profile-field">

                    <label>
                      Email Address *
                    </label>

                    <div className="profile-value">
                      {profile.email}
                    </div>

                  </div>


                  {/* INDUSTRY */}

                  <div className="profile-field">

                    <label>
                      Industry
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="industry"
                        value={
                          profile.industry
                        }
                        onChange={handleChange}
                        placeholder="Software & Technology"
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.industry ||
                          "Not added"}
                      </div>

                    )}

                  </div>


                  {/* LOCATION */}

                  <div className="profile-field">

                    <label>
                      Location
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="location"
                        value={
                          profile.location
                        }
                        onChange={handleChange}
                        placeholder="Chennai, Tamil Nadu"
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.location}
                      </div>

                    )}

                  </div>


                  {/* WEBSITE */}

                  <div className="profile-field">

                    <label>
                      Website
                    </label>

                    {editing ? (

                      <input
                        type="url"
                        name="website"
                        value={
                          profile.website
                        }
                        onChange={handleChange}
                        placeholder="https://company.com"
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.website ||
                          "Not added"}
                      </div>

                    )}

                  </div>


                  {/* ADDRESS */}

                  <div className="profile-field full-width">

                    <label>
                      Company Address
                    </label>

                    {editing ? (

                      <textarea
                        name="companyAddress"
                        value={
                          profile.companyAddress
                        }
                        onChange={handleChange}
                        rows="4"
                        placeholder="Enter company address"
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.companyAddress ||
                          "Not added"}
                      </div>

                    )}

                  </div>

                </div>

              </section>


              {/* COMPANY DESCRIPTION */}

              <section className="profile-card">

                <div className="profile-card-title">

                  <div>

                    <span className="section-label">
                      ABOUT COMPANY
                    </span>

                    <h2>
                      Company Description
                    </h2>

                  </div>

                </div>


                {editing ? (

                  <textarea
                    name="companyDescription"
                    value={
                      profile.companyDescription
                    }
                    onChange={handleChange}
                    rows="6"
                    placeholder="Tell students about your company..."
                  />

                ) : (

                  <p className="profile-bio">

                    {profile.companyDescription ||
                      "Add a description about your company."}

                  </p>

                )}

              </section>


              {/* COMPANY ACTION */}

              <section className="profile-job-card">

                <span>
                  HIRING TALENT?
                </span>

                <h3>
                  Post your next internship or job.
                </h3>

                <button
                  onClick={() =>
                    navigate("/jobs")
                  }
                >
                  Manage Opportunities →
                </button>

              </section>

            </div>


            {/* COMPANY SIDEBAR */}

            <aside className="profile-sidebar">

              {/* COMPLETION */}

              <section className="profile-completion-card">

                <div className="completion-header">

                  <div>

                    <span>
                      PROFILE COMPLETION
                    </span>

                    <h3>
                      {completion}%
                    </h3>

                  </div>

                  <div className="completion-circle">
                    {completion}%
                  </div>

                </div>


                <div className="completion-bar">

                  <div
                    className="completion-progress"
                    style={{
                      width:
                        `${completion}%`,
                    }}
                  />

                </div>


                <p>
                  Complete your company profile
                  to attract talented students.
                </p>

              </section>


              {/* COMPANY CHECKLIST */}

              <section className="profile-card">

                <div className="profile-card-title">

                  <div>

                    <span className="section-label">
                      COMPANY CHECKLIST
                    </span>

                    <h2>
                      Complete your profile
                    </h2>

                  </div>

                </div>


                <div className="profile-checklist">

                  <div>
                    <span>
                      {profile.companyName
                        ? "✓"
                        : "○"}
                    </span>
                    Company name
                  </div>

                  <div>
                    <span>
                      {profile.industry
                        ? "✓"
                        : "○"}
                    </span>
                    Industry
                  </div>

                  <div>
                    <span>
                      {profile.location
                        ? "✓"
                        : "○"}
                    </span>
                    Location
                  </div>

                  <div>
                    <span>
                      {profile.website
                        ? "✓"
                        : "○"}
                    </span>
                    Website
                  </div>

                  <div>
                    <span>
                      {profile.companyDescription
                        ? "✓"
                        : "○"}
                    </span>
                    Description
                  </div>

                  <div>
                    <span>
                      {profile.companyAddress
                        ? "✓"
                        : "○"}
                    </span>
                    Address
                  </div>

                </div>

              </section>

            </aside>

          </div>

        ) : (

          /* ===================================================
             STUDENT PROFILE
          =================================================== */

          <div className="profile-grid">

            <div className="profile-main">

              {/* BASIC DETAILS */}

              <section className="profile-card">

                <div className="profile-card-title">

                  <div>

                    <span className="section-label">
                      BASIC DETAILS
                    </span>

                    <h2>
                      Personal Information
                    </h2>

                  </div>

                </div>


                <div className="profile-form-grid">

                  {/* NAME */}

                  <div className="profile-field">

                    <label>
                      Full Name *
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="name"
                        value={profile.name}
                        onChange={handleChange}
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.name}
                      </div>

                    )}

                  </div>


                  {/* EMAIL */}

                  <div className="profile-field">

                    <label>
                      Email Address *
                    </label>

                    <div className="profile-value">
                      {profile.email}
                    </div>

                  </div>


                  {/* LOCATION */}

                  <div className="profile-field">

                    <label>
                      Current Location *
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="location"
                        value={
                          profile.location
                        }
                        onChange={handleChange}
                        placeholder="Chennai, Tamil Nadu"
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.location}
                      </div>

                    )}

                  </div>

                </div>

              </section>


              {/* ABOUT */}

              <section className="profile-card">

                <div className="profile-card-title">

                  <div>

                    <span className="section-label">
                      ABOUT
                    </span>

                    <h2>
                      About Me
                    </h2>

                  </div>

                </div>


                {editing ? (

                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    rows="5"
                    placeholder="Tell recruiters about yourself..."
                  />

                ) : (

                  <p className="profile-bio">

                    {profile.bio ||
                      "Add a short introduction about yourself."}

                  </p>

                )}

              </section>


              {/* EDUCATION */}

              <section className="profile-card">

                <div className="profile-card-title">

                  <div>

                    <span className="section-label">
                      EDUCATION
                    </span>

                    <h2>
                      Education
                    </h2>

                  </div>

                </div>


                <div className="profile-form-grid">

                  {/* COLLEGE */}

                  <div className="profile-field full-width">

                    <label>
                      College / University *
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="college"
                        value={
                          profile.college
                        }
                        onChange={handleChange}
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.college}
                      </div>

                    )}

                  </div>


                  {/* DEGREE */}

                  <div className="profile-field">

                    <label>
                      Degree *
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="degree"
                        value={
                          profile.degree
                        }
                        onChange={handleChange}
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.degree}
                      </div>

                    )}

                  </div>


                  {/* BRANCH */}

                  <div className="profile-field">

                    <label>
                      Branch / Specialization *
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="branch"
                        value={
                          profile.branch
                        }
                        onChange={handleChange}
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.branch}
                      </div>

                    )}

                  </div>


                  {/* GRADUATION */}

                  <div className="profile-field">

                    <label>
                      Graduation Year *
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="graduationYear"
                        value={
                          profile.graduationYear
                        }
                        onChange={handleChange}
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.graduationYear}
                      </div>

                    )}

                  </div>


                  {/* CGPA */}

                  <div className="profile-field">

                    <label>
                      CGPA / Percentage
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="cgpa"
                        value={profile.cgpa}
                        onChange={handleChange}
                        placeholder="Example: 8.2"
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.cgpa ||
                          "Not added"}
                      </div>

                    )}

                  </div>

                </div>

              </section>


              {/* SKILLS */}

              <section className="profile-card">

                <div className="profile-card-title">

                  <div>

                    <span className="section-label">
                      SKILLS
                    </span>

                    <h2>
                      Technical Skills
                    </h2>

                  </div>

                </div>


                <div className="profile-tags">

                  {profile.skills.map(
                    (skill) => (

                      <span key={skill}>

                        {skill}

                        {editing && (

                          <button
                            type="button"
                            onClick={() =>
                              removeSkill(skill)
                            }
                            className="tag-remove"
                          >
                            ×
                          </button>

                        )}

                      </span>

                    )
                  )}

                </div>


                {editing && (

                  <div className="add-item-row">

                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) =>
                        setSkillInput(
                          e.target.value
                        )
                      }
                      placeholder="Add skill e.g. Java"
                      onKeyDown={(e) => {

                        if (
                          e.key === "Enter"
                        ) {
                          e.preventDefault();
                          addSkill();
                        }

                      }}
                    />

                    <button
                      type="button"
                      onClick={addSkill}
                    >
                      + Add
                    </button>

                  </div>

                )}

              </section>


              {/* LANGUAGES */}

              <section className="profile-card">

                <div className="profile-card-title">

                  <div>

                    <span className="section-label">
                      COMMUNICATION
                    </span>

                    <h2>
                      Languages
                    </h2>

                  </div>

                </div>


                {!editing ? (

                  <div className="profile-tags">

                    {profile.languages.map(
                      (language) => (

                        <span key={language}>
                          {language}
                        </span>

                      )
                    )}

                  </div>

                ) : (

                  <div className="language-options">

                    {availableLanguages.map(
                      (language) => (

                        <label
                          key={language}
                          className={
                            profile.languages.includes(
                              language
                            )
                              ? "language-option selected"
                              : "language-option"
                          }
                        >

                          <input
                            type="checkbox"
                            checked={profile.languages.includes(
                              language
                            )}
                            onChange={() =>
                              toggleLanguage(
                                language
                              )
                            }
                          />

                          <span>
                            {language}
                          </span>

                        </label>

                      )
                    )}

                  </div>

                )}

              </section>


              {/* PROJECTS */}

              <section className="profile-card">

                <div className="profile-card-title">

                  <div>

                    <span className="section-label">
                      PROJECTS
                    </span>

                    <h2>
                      Projects
                    </h2>

                  </div>

                </div>


                {profile.projects.length > 0 && (

                  <div className="item-list">

                    {profile.projects.map(
                      (project) => (

                        <div
                          className="item-row"
                          key={project}
                        >

                          <span>
                            {project}
                          </span>

                          {editing && (

                            <button
                              type="button"
                              onClick={() =>
                                removeProject(
                                  project
                                )
                              }
                            >
                              Remove
                            </button>

                          )}

                        </div>

                      )
                    )}

                  </div>

                )}


                {editing && (

                  <div className="add-item-row">

                    <input
                      type="text"
                      value={projectInput}
                      onChange={(e) =>
                        setProjectInput(
                          e.target.value
                        )
                      }
                      placeholder="Example: CampusConnect"
                    />

                    <button
                      type="button"
                      onClick={addProject}
                    >
                      + Add
                    </button>

                  </div>

                )}

              </section>


              {/* CERTIFICATIONS */}

              <section className="profile-card">

                <div className="profile-card-title">

                  <div>

                    <span className="section-label">
                      CERTIFICATIONS
                    </span>

                    <h2>
                      Certifications
                    </h2>

                  </div>

                </div>


                {profile.certifications.length > 0 && (

                  <div className="item-list">

                    {profile.certifications.map(
                      (certification) => (

                        <div
                          className="item-row"
                          key={certification}
                        >

                          <span>
                            {certification}
                          </span>

                          {editing && (

                            <button
                              type="button"
                              onClick={() =>
                                removeCertification(
                                  certification
                                )
                              }
                            >
                              Remove
                            </button>

                          )}

                        </div>

                      )
                    )}

                  </div>

                )}


                {editing && (

                  <div className="add-item-row">

                    <input
                      type="text"
                      value={
                        certificationInput
                      }
                      onChange={(e) =>
                        setCertificationInput(
                          e.target.value
                        )
                      }
                      placeholder="Example: AWS Cloud Practitioner"
                    />

                    <button
                      type="button"
                      onClick={
                        addCertification
                      }
                    >
                      + Add
                    </button>

                  </div>

                )}

              </section>


              {/* PREFERENCES */}

              <section className="profile-card">

                <div className="profile-card-title">

                  <div>

                    <span className="section-label">
                      PREFERENCES
                    </span>

                    <h2>
                      Internship Preferences
                    </h2>

                  </div>

                </div>


                <div className="profile-form-grid">

                  <div className="profile-field">

                    <label>
                      Opportunity Type
                    </label>

                    {editing ? (

                      <select
                        name="internshipType"
                        value={
                          profile.internshipType
                        }
                        onChange={handleChange}
                      >

                        <option>
                          Internship
                        </option>

                        <option>
                          Full Time
                        </option>

                        <option>
                          Internship + Full Time
                        </option>

                      </select>

                    ) : (

                      <div className="profile-value">
                        {profile.internshipType}
                      </div>

                    )}

                  </div>


                  <div className="profile-field">

                    <label>
                      Work Mode
                    </label>

                    {editing ? (

                      <select
                        name="workMode"
                        value={
                          profile.workMode
                        }
                        onChange={handleChange}
                      >

                        <option>
                          Any
                        </option>

                        <option>
                          On-site
                        </option>

                        <option>
                          Remote
                        </option>

                        <option>
                          Hybrid
                        </option>

                      </select>

                    ) : (

                      <div className="profile-value">
                        {profile.workMode}
                      </div>

                    )}

                  </div>


                  <div className="profile-field full-width">

                    <label>
                      Preferred Location
                    </label>

                    {editing ? (

                      <input
                        type="text"
                        name="preferredLocation"
                        value={
                          profile.preferredLocation
                        }
                        onChange={handleChange}
                        placeholder="Chennai / Bangalore / Remote"
                      />

                    ) : (

                      <div className="profile-value">
                        {profile.preferredLocation}
                      </div>

                    )}

                  </div>

                </div>

              </section>

            </div>


            {/* =================================================
                STUDENT SIDEBAR
            ================================================= */}

            <aside className="profile-sidebar">

              {/* COMPLETION */}

              <section className="profile-completion-card">

                <div className="completion-header">

                  <div>

                    <span>
                      PROFILE COMPLETION
                    </span>

                    <h3>
                      {completion}%
                    </h3>

                  </div>

                  <div className="completion-circle">
                    {completion}%
                  </div>

                </div>


                <div className="completion-bar">

                  <div
                    className="completion-progress"
                    style={{
                      width:
                        `${completion}%`,
                    }}
                  />

                </div>


                <p>
                  Complete your profile to improve
                  your internship opportunities.
                </p>

              </section>


              {/* RESUME */}

              <section className="resume-card">

                <div className="resume-icon">
                  📄
                </div>

                <div>

                  <span>
                    RESUME
                  </span>

                  <h3>
                    Upload your resume
                  </h3>

                  <p>
                    PDF, DOC or DOCX
                  </p>

                </div>

                <button type="button">
                  Upload
                </button>

              </section>


              {/* CHECKLIST */}

              <section className="profile-card">

                <div className="profile-card-title">

                  <div>

                    <span className="section-label">
                      PROFILE CHECKLIST
                    </span>

                    <h2>
                      Complete your profile
                    </h2>

                  </div>

                </div>


                <div className="profile-checklist">

                  <div>
                    <span>
                      {profile.location
                        ? "✓"
                        : "○"}
                    </span>

                    Location
                  </div>

                  <div>
                    <span>
                      {profile.bio
                        ? "✓"
                        : "○"}
                    </span>

                    About me
                  </div>

                  <div>
                    <span>
                      {profile.skills.length
                        ? "✓"
                        : "○"}
                    </span>

                    Skills
                  </div>

                  <div>
                    <span>
                      {profile.projects.length
                        ? "✓"
                        : "○"}
                    </span>

                    Projects
                  </div>

                  <div>
                    <span>
                      {profile.certifications.length
                        ? "✓"
                        : "○"}
                    </span>

                    Certifications
                  </div>

                  <div>
                    <span>
                      {profile.languages.length
                        ? "✓"
                        : "○"}
                    </span>

                    Languages
                  </div>

                </div>

              </section>


              {/* EXPLORE JOBS */}

              <section className="profile-job-card">

                <span>
                  LOOKING FOR OPPORTUNITIES?
                </span>

                <h3>
                  Find your next internship.
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    navigate("/jobs")
                  }
                >
                  Explore Jobs →
                </button>

              </section>

            </aside>

          </div>

        )}

      </main>

    </div>
  );
}

export default Profile;