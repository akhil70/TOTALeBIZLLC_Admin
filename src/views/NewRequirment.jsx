import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MainCard from "components/MainCard";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { createJobDetail } from "../utils/ApiService";
import { getDepartments } from "../utils/ApiService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


export default function NewRequirment() {
    const [formData, setFormData] = useState({
        jobTitle: "",
        departmentId: "",
        vacancies: "",
        experience: "",
        jobType: "",
        location: "",
        salary: "",
        skills: "",
        description: "",
        expiryDate: "",
        publishSite: false,
    });

    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const res = await getDepartments();
                setDepartments(res?.payLoad || []);
            } catch (err) {
                console.error("Failed to load departments", err);
            }
        };

        fetchDepartments();
    }, []);

   const handleSubmit = async (e) => {
    e.preventDefault();

    const payLoad = {
        jobTitle: formData.jobTitle,
        location: formData.location,
        departmentId: parseInt(formData.departmentId, 10) || 0,
        salaryRange: formData.salary,
        vacancyCount: parseInt(formData.vacancies, 10) || 0,
        skills: formData.skills,
        experienceRequired: formData.experience,
        jobDescription: formData.description,
        jobType: formData.jobType.toUpperCase(),
        publishSite: formData.publishSite,
        expiryDate: formData.expiryDate
            ? new Date(formData.expiryDate).toISOString()
            : null,
    };

    try {
        await createJobDetail({ payLoad });
        toast.success("Job posted successfully!");
        navigate("/Requirment");
    } catch (error) {
        toast.error("Failed to post job. Please try again.");
    }
};


    return (
        <Row>
            <Col xl={12}>
                <MainCard title="Add New Job Requirement">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Job Title</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="jobTitle"
                                        value={formData.jobTitle}
                                        onChange={handleChange}
                                        placeholder="Enter Job Title"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Department</Form.Label>
                                    <Form.Select
                                        name="departmentId"
                                        value={formData.departmentId}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept.id} value={dept.id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>


                                <Form.Group className="mb-3">
                                    <Form.Label>Number of Vacancies</Form.Label>
                                    <Form.Control
                                        type="number"
                                        name="vacancies"
                                        value={formData.vacancies}
                                        onChange={handleChange}
                                        placeholder="Enter number of positions"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Experience Required</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="experience"
                                        value={formData.experience}
                                        onChange={handleChange}
                                        placeholder="e.g., 2-4 Years"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Job Type</Form.Label>
                                    <Form.Select
                                        name="jobType"
                                        value={formData.jobType}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select Type</option>
                                        <option value="FULL_TIME">Full-Time</option>
                                        <option value="PART_TIME">Part-Time</option>
                                        <option value="CONTRACT">Contract</option>
                                    </Form.Select>
                                </Form.Group>

                                <div className="mb-2">
                                    <Form.Check
                                        type="checkbox"
                                        name="publishSite"
                                        checked={formData.publishSite}
                                        onChange={handleChange}
                                        label="Publish in site"
                                    />
                                </div>
                            </Col>

                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        placeholder="Enter Location"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Salary Range</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        placeholder="e.g., ₹6-10 LPA"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Skills Required</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={2}
                                        name="skills"
                                        value={formData.skills}
                                        onChange={handleChange}
                                        placeholder="e.g., React, Node.js, SQL"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Job Description</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Enter Job Description"
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Expiry Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        required
                                        min={new Date().toISOString().split("T")[0]}
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12} className="text-end">
                                <Button
                                    onClick={() => navigate("/Requirment")}
                                    variant="secondary"
                                    className="me-2"
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary">
                                    Post Job
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Col>
        </Row>
    );
}
