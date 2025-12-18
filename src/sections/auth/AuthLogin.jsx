import PropTypes from 'prop-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../utils/ApiService';

// react-bootstrap
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';
import DarkLogo from 'assets/images/cropped-Bitimg.png';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
// third-party
import { useForm } from 'react-hook-form';

// project-imports
import MainCard from 'components/MainCard';
import { sendRegisterOtp } from '../../utils/ApiService';
import { verifyRegisterOtp } from '../../utils/ApiService';
import { completeUserRegistration } from '../../utils/ApiService';
import { toast } from 'react-toastify';
import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaUser,
  FaPhone,
  FaHome,
} from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import {
  emailSchema,
  passwordSchema,
  firstNameSchema,
  lastNameSchema,
  confirmPasswordSchema
} from 'utils/validationSchema';

// ==============================|| AUTH LOGIN FORM ||============================== //

export default function AuthLoginForm({ className }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSignup, setIsSignup] = useState(false);
  const [otpStep, setOtpStep] = useState(0); // 0=email, 1=otp, 2=full form
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { errors }
  } = useForm();

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  const onSubmit = async (data) => {
    if (!isSignup) {
      // Login flow remains same...
      const { email, password } = data;
      try {
        const response = await login(email, password);
        if (response?.resultCode === "COMM_OPERATION_SUCCESS") {
          const { token, role } = response.payLoad;
          localStorage.setItem("token", token);
          localStorage.setItem("signupEmail", email);
          localStorage.setItem("role", role);
          navigate("/dashboard");
          window.location.reload();
        } else {
          toast.error(response?.resultString || "Login failed");

        }
      } catch (error) {
        toast.error("Invalid email or password. Please try again.");

      }
    } else if (otpStep === 2) {
      // ✅ Signup final submit
      try {
        const emailId = localStorage.getItem("signupEmail");
        const otp = localStorage.getItem("OTP");

        const payload = {
          firstName: data.firstName,
          lastName: data.lastName,
          emailId,
          password: data.password,
          role: "USER",
          address: data.address,
          gender: data.gender,
          dob: data.dob,
          phoneNumber: data.phoneNumber,
          countryCode: "+91",
          otp: otp ? parseInt(otp, 10) : 0
        };

        const res = await completeUserRegistration(payload);

        if (res?.resultCode === "COMM_OPERATION_SUCCESS") {
          toast.success("Account created successfully!")

          localStorage.removeItem("OTP");

          setIsSignup(false);
          setOtpStep(0);
          reset();
        } else {
          toast.error(res?.resultString || "Failed to create account");

        }
      } catch (err) {
        toast.error("Error creating account. Please try again.");

      }
    }
  };


  const onGetOtp = async () => {
    const emailValue = getValues("email");
    if (!emailValue) {
      toast.error("Please enter an email first.");
      return;
    }

    localStorage.setItem("signupEmail", emailValue);

    try {
      const res = await sendRegisterOtp(emailValue);
      if (res?.resultCode === "COMM_OPERATION_SUCCESS") {
        toast.success("OTP sent successfully!")
        setOtpStep(1);
      } else {
        toast.error(res?.resultString || "Failed to send OTP");

      }
    } catch (err) {
      toast.error("Error sending OTP. Please try again.");

    }
  };

  const onValidateOtp = async () => {
    const email = localStorage.getItem("signupEmail");
    const otpValue = getValues("otp");

    if (!otpValue) {
      toast.error("Please enter the OTP.");
      return;
    }

    try {
      const res = await verifyRegisterOtp(email, otpValue);

      if (res?.resultCode === "COMM_OPERATION_SUCCESS") {
        toast.success("OTP verified successfully!")

        localStorage.setItem("OTP", otpValue);

        setOtpStep(2);
      } else {
        toast.error(res?.resultString || "Invalid OTP");

      }
    } catch (err) {
      toast.error("Error verifying OTP. Please try again.");

    }
  };


  return (
    
    <MainCard className="mb-0" >
      <div className="text-center">
        <Image src={DarkLogo} alt="img" />
      </div>

      <Form onSubmit={handleSubmit(onSubmit)}>
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>
          {isSignup ? 'Sign up' : 'Login'}
        </h4>

        {/* ================= LOGIN FLOW ================= */}
        {!isSignup && (
          <>
            <div className="mb-3 position-relative">
              <FaEnvelope className="position-absolute top-50 translate-middle-y ms-2 text-muted" />
              <input
                type="email"
                placeholder="Email Address"
                className="form-control ps-5 rounded-pill"
                {...register("email", emailSchema)}
              />
              {errors.email && (
                <div className="text-danger small">
                  {errors.email.message}
                </div>
              )}
            </div>

            <div className="mb-3 position-relative">
              <FaLock className="position-absolute top-50 translate-middle-y ms-2 text-muted" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="form-control ps-5 rounded-pill"
                {...register("password", passwordSchema)}
              />
              <button
                type="button"
                className="btn position-absolute end-0 top-50 translate-middle-y me-2"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <div className="text-danger small">
                  {errors.password.message}
                </div>
              )}
            </div>

            <Stack direction="horizontal" className="mt-1 justify-content-between align-items-center">
              <Form.Group controlId="customCheckc1">
                <Form.Check type="checkbox" label="Remember me?" defaultChecked />
              </Form.Group>
              <a
                href="#!"
                className="link-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignup(true);
                  setOtpStep(0);
                }}
              >
                User Registration
              </a>
            </Stack>

            <div className="text-center mt-4">
              <button
                type="submit"
                className="btn btn-info w-100 py-2 rounded-pill fw-bold shadow"
              >
                Login
              </button>
            </div>
          </>
        )}

        {/* ================= SIGNUP FLOW ================= */}


        {isSignup && (
          <>
            {otpStep === 0 && (
              <>
                {/* Step 1: Email + Get OTP */}
                <div className="mb-3 position-relative">
                  <FaEnvelope className="position-absolute top-50 translate-middle-y ms-2 text-muted" />
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="form-control ps-5 rounded-pill"
                    {...register("email", emailSchema)}
                  />
                </div>
                <div className="text-center mt-4">
                  <button
                    type="button"
                    className="btn btn-info w-100 py-2 rounded-pill fw-bold shadow"
                    onClick={onGetOtp}
                  >
                    Get OTP
                  </button>                </div>
              </>
            )}

            {otpStep === 1 && (
              <>
                {/* Step 2: OTP + Validate */}
                <Form.Group className="mb-3" controlId="otpField">
                  <Form.Control
                    type="number"
                    placeholder="Enter OTP"
                    {...register('otp')}
                  />
                </Form.Group>
                <div className="text-center mt-4">
                  <Button type="button" onClick={onValidateOtp}>
                    Validate OTP
                  </Button>
                </div>
              </>
            )}


            {otpStep === 2 && (
              <>
                {/* Step 3: Full Registration Form */}
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" placeholder="First Name" {...register('firstName', firstNameSchema)} />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" placeholder="Last Name" {...register('lastName', lastNameSchema)} />
                    </Form.Group>
                  </Col>
                </Row>


                <Form.Group className="mb-3">
                  <Form.Control type="text" placeholder="Phone Number" {...register('phoneNumber')} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control type="date" placeholder="Date of Birth" {...register('dob')} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Select {...register('gender')}>
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control type="text" placeholder="Address" {...register('address')} />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    {...register('password', passwordSchema)}
                  />
                </Form.Group>
                <div className="text-center mt-4">
                  <Button type="submit" className="shadow px-sm-4">
                    Submit
                  </Button>
                </div>
              </>
            )}

            <Stack direction="horizontal" className="justify-content-between align-items-end mt-4">
              <h6 className={`f-w-500 mb-0 ${className}`}>Already have an Account?</h6>
              <a
                href="#!"
                className="link-primary"
                onClick={(e) => {
                  e.preventDefault();
                  setIsSignup(false);
                  setOtpStep(0);
                }}
              >
                Login
              </a>
            </Stack>
          </>
        )}
      </Form>
    </MainCard>
  );
}

AuthLoginForm.propT
