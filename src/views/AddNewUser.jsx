import { useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import MainCard from "components/MainCard";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../utils/ApiService";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function AddNewUser() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    phone: "",
    role: "",
    password: "",
    gender: "",
    dob: "",
    address: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  const payLoad = {
    firstName: formData.firstName,
    lastName: formData.lastName,
    emailId: formData.email,
    password: formData.password,
    userName: formData.userName,
    role: formData.role,
    address: formData.address,
    gender: formData.gender || "NA",
    dob: formData.dob,
    phoneNumber: formData.phone,
    countryCode: "",
    otp: 0
  };

  try {
    const res = await registerUser({ payLoad }); // 👈 wrap payload
    toast.success("User registered successfully!");
    navigate("/users");
  } catch (error) {
    toast.error("Failed to register user. Please try again.");
  }
};


  return (
    <Row>
      <Col xl={12}>
        <MainCard title="Add New User">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                {/* First Name */}
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="firstName"
                    placeholder="Enter First Name"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Last Name */}
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="lastName"
                    placeholder="Enter Last Name"
                    value={formData.lastName}
                    onChange={handleChange}

                  />
                </Form.Group>

                {/* User Name */}
                <Form.Group className="mb-3">
                  <Form.Label>User Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="userName"
                    placeholder="Enter User Name"
                    value={formData.userName}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Email */}
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Phone */}
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Enter Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                {/* Role */}
                <Form.Group className="mb-3">
                  <Form.Label>Portal Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Role</option>
                    <option value="USER">User</option>
                    <option value="ADMIN">Admin</option>
                    <option value="HR">HR</option>
                  </Form.Select>
                </Form.Group>

                {/* Gender */}
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>

                {/* DOB */}
                <Form.Group className="mb-3">
                  <Form.Label>Date of Birth</Form.Label>
                  <Form.Control
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3">
                  <Form.Label>Set Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                {/* Address */}
                <Form.Group className="mb-3">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    placeholder="Enter Address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </Col>

              <Col md={12} className="text-end">
                <Button
                  variant="secondary"
                  className="me-2"
                  onClick={() => navigate("/users")}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Register User
                </Button>
              </Col>
            </Row>
          </Form>
        </MainCard>
      </Col>
    </Row>
  );
}
