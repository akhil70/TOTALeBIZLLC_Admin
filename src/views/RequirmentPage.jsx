import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MainCard from "components/MainCard";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { getJobDetails,deleteJob } from "../utils/ApiService";
import "./RequirmentPage.css"

export default function RequirementPage() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(20);
  const [totalPages, setTotalPages] = useState(0);

  // For popup modal
  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const res = await getJobDetails({ page, size, search });
      setJobs(res?.data || []);
      setTotalPages(res?.totalPages || 0);
    } catch (err) {
      console.error("Failed to load jobs", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPage(0);
    fetchJobs();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 0 && newPage < totalPages) {
      setPage(newPage);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };
  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      await deleteJob(jobId);
      // Refresh jobs after delete
      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (error) {
      alert("Failed to delete job. Please try again.");
    }
  };

  return (
    <Row>
      <Col xl={12}>
        <MainCard title="Job Requirements">
          {/* Search and Add */}
          <div className="d-flex justify-content-end align-items-center mb-3 gap-2">
            <input
              type="text"
              placeholder="Search job..."
              className="form-control"
              style={{ width: "250px" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <Button variant="secondary" onClick={handleSearch}>
              Search
            </Button>
            <Button
              variant="primary"
              onClick={() => navigate("/Requirment/add")}
            >
              Add New Job +
            </Button>
          </div>

          {/* Jobs Table */}
          <Table responsive bordered hover>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Job Title</th>
                <th>Department</th>
                <th>Location</th>
                <th>Experience</th>
                <th>Expired On</th>
                <th>Applicants</th>
                <th>Actions</th>
                {/* <th>Delete</th> */}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center">
                    Loading jobs...
                  </td>
                </tr>
              ) : jobs.length > 0 ? (
                jobs.map((job, index) => (
                  <tr key={job.id}>
                    <td>{page * size + index + 1}</td>
                    <td>{job.jobTitle}</td>
                    <td>{job.departmentName}</td>
                    <td>{job.location}</td>
                    <td>{job.experienceRequired}</td>
                    <td>
                      {new Date(job.expiryDate).toLocaleDateString("en-GB")}
                    </td>
                    <td
                      style={{ textAlign: "center", cursor: "pointer" }}
                      onClick={() => navigate("/Requirment/Applicants", { state: { jobId: job.id } })}
                    >
                      <i
                        className="ph ph-users"
                        style={{
                          fontSize: "18px",
                          marginRight: "5px",
                          color: "#4CAF50",
                        }}
                      ></i>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <i
                        className="ph ph-eye"
                        style={{
                          fontSize: "18px",
                          cursor: "pointer",
                          color: "#007bff",
                        }}
                        onClick={() => handleViewDetails(job)}
                      ></i>
                    </td>
                    {/* <td> <i
                      className="ph ph-trash"
                      style={{
                        fontSize: "18px",
                        cursor: "pointer",
                        color: "#dc3545",
                      }}
                      onClick={() => handleDelete(job.id)}
                    ></i></td> */}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="text-center">
                    No jobs found
                  </td>
                </tr>
              )}
            </tbody>
          </Table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <Pagination>
                <Pagination.First
                  onClick={() => handlePageChange(0)}
                  disabled={page === 0}
                />
                <Pagination.Prev
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 0}
                />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item
                    key={i}
                    active={i === page}
                    onClick={() => handlePageChange(i)}
                  >
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages - 1}
                />
                <Pagination.Last
                  onClick={() => handlePageChange(totalPages - 1)}
                  disabled={page === totalPages - 1}
                />
              </Pagination>
            </div>
          )}
        </MainCard>
      </Col>

      {/* Modal for Job Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-primary text-white">
          <Modal.Title>{selectedJob?.jobTitle || "Job Details"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          {selectedJob ? (
            <div className="job-details-popup">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <span className="badge bg-info text-dark">{selectedJob.jobType}</span>
                <span className={`badge ${selectedJob.publishSite ? "bg-success" : "bg-secondary"}`}>
                  {selectedJob.publishSite ? "Published" : "Not Published"}
                </span>
              </div>

              <div className="row mb-3">
                <div className="col-md-6 mb-2">
                  <strong>Department:</strong> {selectedJob.departmentName}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Location:</strong> {selectedJob.location}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Experience:</strong> {selectedJob.experienceRequired} Years
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Vacancies:</strong> {selectedJob.vacancyCount}
                </div>
                <div className="col-md-6 mb-2">
                  <strong>Salary Range:</strong> {selectedJob.salaryRange}
                </div>
              </div>

              <div className="mb-3">
                <strong>Skills Required:</strong>
                <div className="mt-1 d-flex flex-wrap gap-1">
                  {selectedJob.skills.split(",").map((skill, index) => (
                    <span key={index} className="badge bg-warning text-dark">
                      {skill.trim()}
                    </span>
                  ))}
                </div>
              </div>


              <div className="mb-3">
                <strong>Job Description:</strong>
                <div className="p-3 border rounded bg-light shadow-sm">
                  {selectedJob.jobDescription}
                </div>
              </div>

              <div className="d-flex justify-content-between mt-3 text-muted small">
                <div>
                  <strong>Posted On:</strong>{" "}
                  {new Date(selectedJob.postedDate).toLocaleDateString("en-GB")}
                </div>
                <div>
                  <strong>Expires On:</strong>{" "}
                  {new Date(selectedJob.expiryDate).toLocaleDateString("en-GB")}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-muted">No details available</p>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>

        </Modal.Footer>
      </Modal>

    </Row>
  );
}
