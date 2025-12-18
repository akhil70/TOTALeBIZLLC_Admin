import React, { useEffect, useState } from "react";
import JobApplicationModel from "./JobApplicationModel";
import "./UserJobs.css";
import { getJobDetails } from "../utils/ApiService";

function UserJobs() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewJob, setViewJob] = useState(null); // for eye icon view

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getJobDetails({ page: 0, size: 100, search: "" });
        setJobs(res?.data || []);
        setFilteredJobs(res?.data || []);
      } catch (err) {
        console.log(err, "erer");
        alert("Error fetching job details. Please try again.");
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredJobs(jobs);
      return;
    }
    const lower = searchTerm.toLowerCase();
    setFilteredJobs(
      jobs.filter(
        (job) =>
          job.jobTitle.toLowerCase().includes(lower) ||
          job.departmentName.toLowerCase().includes(lower) ||
          job.skills.toLowerCase().includes(lower) ||
          job.location.toLowerCase().includes(lower)
      )
    );
  };

  return (
    <div className="jobs-container">
      <h2>Job Opportunities</h2>

      {/* Search bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search job..."
          className="form-control"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        />
        <button className="btn btn-secondary" onClick={handleSearch}>
          Search
        </button>
      </div>

      {/* Job list */}
      <div className="jobs-grid">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div className="job-card" key={job.id}>
              <h3>{job.jobTitle}</h3>
              <p><b>Department:</b> {job.departmentName}</p>
              <p><b>Location:</b> {job.location}</p>
              <p><b>Experience:</b> {job.experienceRequired}</p>
              <p>
                <b>Skills:</b>{" "}
                {job?.skills.split(",").map((skill, idx) => (
                  <span key={idx} className="badge">{skill.trim()}</span>
                ))}
              </p>
              <br></br>
              <div className="d-flex justify-content-between">
                <button
                  className="apply-btn"
                  onClick={() => setSelectedJob(job)}
                >
                  🚀 Apply Now
                </button>

                <button
                  className="view-btn"
                  onClick={() => setViewJob(job)}
                >
                  👁 View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No jobs found.</p>
        )}
      </div>

      {/* Apply Modal */}
      {selectedJob && (
        <JobApplicationModel
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}

      {/* View Job Details Modal */}
      {viewJob && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ background: "rgba(0, 0, 0, 0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{viewJob.jobTitle}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setViewJob(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p><b>Department:</b> {viewJob.departmentName}</p>
                <p><b>Location:</b> {viewJob.location}</p>
                <p><b>Experience Required:</b> {viewJob.experienceRequired}</p>
                <p><b>Skills:</b> {viewJob.skills}</p>
                <p><b>Vacancies:</b> {viewJob.vacancyCount}</p>
                <p><b>Salary Range:</b> {viewJob.salaryRange}</p>
                <p><b>Job Type:</b> {viewJob.jobType}</p>
                <p><b>Posted Date:</b> {new Date(viewJob.postedDate).toLocaleDateString()}</p>
                <p><b>Expiry Date:</b> {new Date(viewJob.expiryDate).toLocaleDateString()}</p>
                <hr />
                <p><b>Description:</b></p>
                <p>{viewJob.jobDescription}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setViewJob(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default UserJobs;
