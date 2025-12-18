import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

// project-imports
import MainCard from "components/MainCard";
import { fetchApplicants } from "../utils/ApiService";
import "./userapplicationstatus.css";

function UserApplicationStatus() {
  const [activeTab, setActiveTab] = useState("PENDING");
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);

  const statuses = ["PENDING", "SHORTLISTED", "HIRED", "REJECTED"];

  useEffect(() => {
    setLoading(true);
    fetchApplicants(activeTab)
      .then((data) => {
        setApplicants(data);
      })
      .catch(() => setApplicants([]))
      .finally(() => setLoading(false));
  }, [activeTab]);

  const handleViewJob = (job) => {
    setSelectedJob(job?.jobId || null);
    setShowModal(true);
  };

  return (
    <MainCard>
      <h5 className="mb-3">Jobs</h5>
      <Tab.Container
        id="left-tabs-example"
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
      >
        <Row>
          <Col sm={12}>
            <Nav variant="pills" className="mb-3">
              {statuses.map((status) => (
                <Nav.Item key={status}>
                  <Nav.Link eventKey={status}>{status}</Nav.Link>
                </Nav.Item>
              ))}
            </Nav>
          </Col>

          <Col sm={12}>
            <Tab.Content>
              <Tab.Pane eventKey={activeTab}>
                {loading ? (
                  <p>Loading {activeTab} applicants...</p>
                ) : applicants.length > 0 ? (
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Job Title</th>
                        <th>Department</th>
                        <th>Location</th>
                        <th>Experience Required</th>
                        <th>Applied On</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {applicants.map((applicant, idx) => (
                        <tr key={applicant.id || idx}>
                          <td>{idx + 1}</td>
                          <td>{applicant.jobId?.jobTitle}</td>
                          <td>{applicant.jobId?.department?.name}</td>
                          <td>{applicant.jobId?.location}</td>
                          <td>{applicant.jobId?.experienceRequired}</td>
                          <td>
                            {applicant.appliedDate
                              ? new Date(applicant.appliedDate).toLocaleDateString()
                              : "N/A"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <i
                              className="ph ph-eye"
                              style={{
                                fontSize: "18px",
                                cursor: "pointer",
                                color: "#007bff",
                              }}
                              onClick={() => handleViewJob(applicant)}
                            ></i>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No {activeTab.toLowerCase()} applicants found.</p>
                )}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>

      {/* Job Details Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
        className="job-details-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Job Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedJob ? (
            <div className="job-details">
              <h4>{selectedJob.jobTitle}</h4>
              <p>
                <strong>Department:</strong> {selectedJob.department?.name}
              </p>
              <p>
                <strong>Location:</strong> {selectedJob.location}
              </p>
              <p>
                <strong>Salary Range:</strong> {selectedJob.salaryRange}
              </p>
              <p>
                <strong>Vacancies:</strong> {selectedJob.vacancyCount}
              </p>
              <p>
                <strong>Experience Required:</strong>{" "}
                {selectedJob.experienceRequired}
              </p>
              <p>
                <strong>Skills:</strong> {selectedJob.skills}
              </p>
              <p>
                <strong>Job Type:</strong> {selectedJob.jobType}
              </p>
              <p>
                <strong>Posted On:</strong>{" "}
                {new Date(selectedJob.postedDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Expiry Date:</strong>{" "}
                {new Date(selectedJob.expiryDate).toLocaleDateString()}
              </p>
              <p>
                <strong>Description:</strong>
              </p>
              <div className="job-description">
                {selectedJob.jobDescription}
              </div>
            </div>
          ) : (
            <p>No job details available.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </MainCard>
  );
}

export default UserApplicationStatus;
