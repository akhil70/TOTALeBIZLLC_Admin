import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import MainCard from "components/MainCard";
import { fetchApplicantsadmin, getViewResume, updateApplicantStatus } from "../utils/ApiService";
import { useLocation } from "react-router-dom";

function ApplicantsForJob() {
    const [applied, setApplied] = useState([]);
    const [shortlisted, setShortlisted] = useState([]);
    const [recruited, setRecruited] = useState([]);
    const [rejected, setRejected] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [selectedApplicant, setSelectedApplicant] = useState(null);

    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusApplicant, setStatusApplicant] = useState(null);
    const [newStatus, setNewStatus] = useState("PENDING");
    const location = useLocation();
    const jobId = location.state?.jobId;
    const handleViewResume = async (fileName) => {
        try {
            const blob = await getViewResume(fileName);
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL); // opens in new tab
        } catch (error) {
            console.error("Error viewing resume:", error);
        }
    };

    useEffect(() => {
        if (!jobId) return;

        fetchApplicantsadmin(jobId, "PENDING").then(setApplied);
        fetchApplicantsadmin(jobId, "SHORTLISTED").then(setShortlisted);
        fetchApplicantsadmin(jobId, "HIRED").then(setRecruited);
        fetchApplicantsadmin(jobId, "REJECTED").then(setRejected);
    }, [jobId]);

    const handleShowDetails = (applicant) => {
        setSelectedApplicant(applicant);
        setShowModal(true);
    };

    const handleChangeStatus = (applicant) => {
        setStatusApplicant(applicant);
        setNewStatus(applicant.status || "PENDING");
        setShowStatusModal(true);
    };

    const handleSubmitStatus = async () => {
        try {
            await updateApplicantStatus(statusApplicant.id, newStatus);

            // Refresh lists after update
            fetchApplicantsadmin(jobId, "PENDING").then(setApplied);
            fetchApplicantsadmin(jobId, "SHORTLISTED").then(setShortlisted);
            fetchApplicantsadmin(jobId, "HIRED").then(setRecruited);
            fetchApplicantsadmin(jobId, "REJECTED").then(setRejected);

            setShowStatusModal(false);
        } catch (error) {
            console.error("Error updating status:", error);
        }
    };

    const renderTable = (data) => (
        <table className="table table-striped">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Experience</th>
                    <th>Actions</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((applicant, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                                {applicant.fn} {applicant.ln}
                            </td>
                            <td>{applicant.emailId}</td>
                            <td>{applicant.totalExperience} Years</td>
                            <td>
                                <i
                                    className="ph ph-eye me-3"
                                    style={{
                                        fontSize: "18px",
                                        cursor: "pointer",
                                        color: "#007bff",
                                    }}
                                    onClick={() => handleShowDetails(applicant)}
                                    title="View Details"
                                />
                            </td>
                            <td>
                                <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => handleChangeStatus(applicant)}
                                >
                                    Change Status
                                </Button>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="6" className="text-center">
                            No records found
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );

    return (
        <MainCard>
            <h5 className="mb-3">Candidates</h5>
            <Tab.Container id="left-tabs-example" defaultActiveKey="Applied">
                <Row>
                    <Col sm={12}>
                        <Nav variant="pills" className="mb-3">
                            <Nav.Item>
                                <Nav.Link eventKey="Applied">Applied</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Shortlisted">Shortlisted</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Recruited">Recruited</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="Rejected">Rejected</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>

                    <Col sm={12}>
                        <Tab.Content>
                            <Tab.Pane eventKey="Applied">{renderTable(applied)}</Tab.Pane>
                            <Tab.Pane eventKey="Shortlisted">{renderTable(shortlisted)}</Tab.Pane>
                            <Tab.Pane eventKey="Recruited">{renderTable(recruited)}</Tab.Pane>
                            <Tab.Pane eventKey="Rejected">{renderTable(rejected)}</Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>

            {/* Applicant Details Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
                <Modal.Header closeButton style={{ backgroundColor: "#f8f9fa" }}>
                    <Modal.Title className="fw-bold text-primary">
                        Applicant Details
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedApplicant ? (
                        <div className="p-3">
                            <Row className="mb-3">
                                <Col md={6}>
                                    <h5 className="mb-1">
                                        {selectedApplicant.fn} {selectedApplicant.ln}
                                    </h5>
                                    <span className="text-muted">{selectedApplicant.emailId}</span>
                                </Col>
                                <Col md={6} className="text-md-end">
                                    <span
                                        className={`badge ${selectedApplicant.status === "HIRED"
                                            ? "bg-success"
                                            : selectedApplicant.status === "REJECTED"
                                                ? "bg-danger"
                                                : selectedApplicant.status === "SHORTLISTED"
                                                    ? "bg-warning text-dark"
                                                    : "bg-secondary"
                                            }`}
                                    >
                                        {selectedApplicant.status}
                                    </span>
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col md={6}>
                                    <p>
                                        <strong>Phone:</strong> {selectedApplicant.phoneNumber || "-"}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p>
                                        <strong>Experience:</strong>{" "}
                                        {selectedApplicant.totalExperience} Years
                                    </p>
                                </Col>
                            </Row>

                            <Row className="mb-2">
                                <Col md={6}>
                                    <p>
                                        <strong>Current Location:</strong>{" "}
                                        {selectedApplicant.currentLoc || "-"}
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p>
                                        <strong>Notice Period:</strong>{" "}
                                        {selectedApplicant.noticePeriod || "-"}
                                    </p>
                                </Col>
                            </Row>

                            <Row className="mb-3">
                                <Col>
                                    <p>
                                        <strong>Applied Date:</strong>{" "}
                                        {new Date(selectedApplicant.appliedDate).toLocaleString()}
                                    </p>
                                </Col>
                            </Row>

                            <div className="d-flex align-items-center">
                                <strong className="me-2">Resume:</strong>
                                <span
                                    className="btn btn-outline-primary btn-sm"
                                    role="button"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleViewResume(selectedApplicant.resume)}
                                >
                                    View Resume
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p>No details available</p>
                    )}
                </Modal.Body>
                <Modal.Footer style={{ backgroundColor: "#f8f9fa" }}>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>


            {/* Change Status Modal */}
            <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Change Applicant Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group>
                            <Form.Label>Select Status</Form.Label>
                            <Form.Select
                                value={newStatus}
                                onChange={(e) => setNewStatus(e.target.value)}
                            >
                                <option value="PENDING">PENDING</option>
                                <option value="SHORTLISTED">SHORTLISTED</option>
                                <option value="HIRED">HIRED</option>
                                <option value="REJECTED">REJECTED</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmitStatus}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </MainCard>
    );
}

export default ApplicantsForJob;
