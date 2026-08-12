import { useState } from "react";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Navbar */}
      <nav className="bg-blue-700 text-white px-8 py-4 flex justify-between items-center">

        <h1 className="text-2xl font-bold">
          CampusConnect
        </h1>

        <div className="flex gap-6">
          <button onClick={() => setPage("home")}>
            Home
          </button>

          <button onClick={() => setPage("jobs")}>
            Jobs
          </button>

          <button onClick={() => setPage("login")}>
            Login
          </button>
        </div>

      </nav>

      {/* Home */}
      {page === "home" && (
        <div className="text-center py-24">

          <h1 className="text-5xl font-bold text-gray-800">
            Welcome to CampusConnect
          </h1>

          <p className="text-xl text-gray-600 mt-5">
            Internship & Campus Hiring Platform
          </p>

          <p className="text-gray-500 mt-3">
            Find internships, apply for jobs and build your career.
          </p>

          <button
            onClick={() => setPage("jobs")}
            className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-800"
          >
            Find Internships
          </button>

        </div>
      )}

      {/* Jobs */}
      {page === "jobs" && (
        <div className="p-10">

          <h1 className="text-3xl font-bold mb-8">
            Available Internships
          </h1>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            <JobCard
              title="Java Developer Intern"
              company="ABC Technologies"
              location="Chennai"
            />

            <JobCard
              title="Frontend Developer Intern"
              company="XYZ Solutions"
              location="Bangalore"
            />

            <JobCard
              title="Python Developer Intern"
              company="Tech Solutions"
              location="Coimbatore"
            />

          </div>

        </div>
      )}

      {/* Login */}
      {page === "login" && <Login />}

    </div>
  );
}


/* Job Card */

function JobCard({ title, company, location }) {

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-xl font-bold text-gray-800">
        {title}
      </h2>

      <p className="text-gray-600 mt-3">
        Company: {company}
      </p>

      <p className="text-gray-600">
        Location: {location}
      </p>

      <button className="mt-5 bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700">
        Apply Now
      </button>

    </div>
  );
}


/* Login */

function Login() {

  const handleLogin = (event) => {
    event.preventDefault();

    alert("Login functionality will be connected to Spring Boot soon.");
  };

  return (
    <div className="flex justify-center py-20">

      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >

        <h2 className="text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full border p-3 rounded-lg mb-4"
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
        >
          Login
        </button>

      </form>

    </div>
  );
}

export default App;