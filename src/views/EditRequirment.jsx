import { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MainCard from "components/MainCard";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate, useLocation } from "react-router-dom";
import { getDepartments, updateJobDetail } from "../utils/ApiService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function EditRequirment() {
    const navigate = useNavigate();
    const location = useLocation();
    const jobData = location.state?.job;

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

    const [departments, setDepartments] = useState([]);
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {
        if (!jobData) {
            toast.error("No job data found");
            navigate("/Requirment");
            return;
        }

        const fetchDepartments = async () => {
            try {
                const res = await getDepartments();
                const depts = res?.payLoad || [];
                setDepartments(depts);

                setFormData({
                    jobTitle: jobData.jobTitle || "",
                    departmentId: jobData.departmentId || "",
                    vacancies: jobData.vacancyCount || "",
                    experience: jobData.experienceRequired || "",
                    jobType: jobData.jobType?.toLowerCase() || "",
                    location: jobData.location || "",
                    salary: jobData.salaryRange || "",
                    skills: jobData.skills || "",
                    description: jobData.jobDescription || "",
                    expiryDate: jobData.expiryDate ? jobData.expiryDate.split("T")[0] : "",
                    publishSite: jobData.publishSite || false,
                });
            } catch (err) {
                console.error("Failed to load departments", err);
            }
        };

        fetchDepartments();
    }, [jobData, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

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

        setIsUpdating(true);
        try {
            await updateJobDetail(jobData.id, { payLoad });
            toast.success("Job updated successfully!");
            navigate("/Requirment");
        } catch (error) {
            toast.error("Failed to update job. Please try again.");
            setIsUpdating(false);
        }
    };

    return (
        <Row>
            <Col xl={12}>
                <MainCard title="Edit Job Requirement">
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col md={6} xs={12}>
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
                                        <option value="full_time">Full-Time</option>
                                        <option value="part_time">Part-Time</option>
                                        <option value="contract">Contract</option>
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

                            <Col md={6} xs={12}>
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
                                        isInvalid={formData.salary.length > 250}
                                    />
                                    <Form.Text className={formData.salary.length > 250 ? "text-danger" : "text-muted"}>
                                        {formData.salary.length}/250 characters
                                        {formData.salary.length > 250 && " ⚠️ Maximum 250 characters exceeded"}
                                    </Form.Text>
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
                                        isInvalid={formData.skills.length > 250}
                                    />
                                    <Form.Text className={formData.skills.length > 250 ? "text-danger" : "text-muted"}>
                                        {formData.skills.length}/250 characters
                                        {formData.skills.length > 250 && " ⚠️ Maximum 250 characters exceeded"}
                                    </Form.Text>
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
                                        isInvalid={formData.description.length > 250}
                                    />
                                    <Form.Text className={formData.description.length > 250 ? "text-danger" : "text-muted"}>
                                        {formData.description.length}/250 characters
                                        {formData.description.length > 250 && " ⚠️ Maximum 250 characters exceeded"}
                                    </Form.Text>
                                </Form.Group>

                                <Form.Group className="mb-3">
                                    <Form.Label>Expiry Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="expiryDate"
                                        value={formData.expiryDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </Form.Group>
                            </Col>

                            <Col md={12} xs={12} className="text-md-end text-center mt-3">
                                <Button
                                    onClick={() => navigate("/Requirment")}
                                    variant="secondary"
                                    className="me-2 mb-2 mb-md-0"
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" variant="primary" disabled={isUpdating}>
                                    {isUpdating ? "Updating..." : "Update Job"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </MainCard>
            </Col>
        </Row>
    );
}
