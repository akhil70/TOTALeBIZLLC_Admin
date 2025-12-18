import React, { useState } from "react";
import { applyForJob } from "../utils/ApiService";
import "./JobApplicationModal.css";
import { toast } from "react-toastify";   
import "react-toastify/dist/ReactToastify.css";

const JobApplicationModel = ({ job, onClose }) => {
  const [formData, setFormData] = useState({
    // fullName: "",
    // email: "",
    // phone: "",
    // address: "",
    // dob: "",
    // gender: "",
    experience: "",
    ctc: "",
    expectedCTC: "",
    location: "",
    relocate: "",
    noticePeriod: "",
    referralId: "",
    resume: null,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]);
      reader.onerror = (error) => reject(error);
    });
  };

 
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);

  try {
    
    const requiredFields = [
       "experience", "ctc", "expectedCTC", "location",
      "relocate", "noticePeriod"
    ];

    for (let field of requiredFields) {
      if (!formData[field] || formData[field].trim() === "") {
        toast.error(`Please fill the ${field} .`);
        setLoading(false);
        return;
      }
    }

    
    if (!formData.resume) {
      toast.error("Please upload your resume.");
      setLoading(false);
      return;
    }

    let resumePayload = null;
    if (formData.resume) {
      resumePayload = {
        fileName: formData.resume.name,
        fileSize: formData.resume.size,
        fileType: formData.resume.type,
        data: await fileToBase64(formData.resume),
      };
    }

    // const [firstName, ...rest] = formData.fullName.trim().split(" ");
    // const lastName = rest.join(" ") || "";

    const payload = {
      jobId: job.id,
     
      totalExperience: Number(formData.experience),
      currentCtc: Number(formData.ctc),
      expectedCtc: Number(formData.expectedCTC),
      currentLoc: formData.location,
      willingToRelocate: formData.relocate === "Yes",
      noticePeriod: formData.noticePeriod,
      resume: resumePayload,
      coverLetter: "",
    };

    const res = await applyForJob(payload);

    if (res?.resultCode === "COMM_OPERATION_SUCCESS") {
      toast.success("Application submitted successfully!");
      onClose();
    } else {
      toast.error(res?.resultString || "Failed to apply.");
    }
  } catch (err) {
    console.error("Error submitting application:", err);
    toast.error("Something went wrong while applying. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal-overlay">

      <div className="modal-content">

        <button className="modal-close" onClick={onClose}>×</button>
        <h3>Apply for {job.jobTitle}</h3>
        <form className="job-form">
          <div className="upload-box">
            <label htmlFor="resume">
              <div className="upload-placeholder">
                <span>📤 Upload your resume here</span>
                <small>browse file from device</small>
              </div>
            </label>
            <input type="file" id="resume" name="resume" onChange={handleChange} hidden />
            {formData.resume && (
              <p className="mt-2 text-sm text-success">
                ✅ {formData.resume.name} ({(formData.resume.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </div>

          <div className="form-grid">
            {/* <input name="fullName" placeholder="Full Name *" onChange={handleChange} required />
            <input name="address" placeholder="Address *" onChange={handleChange} required />
            <input name="email" type="email" placeholder="Email *" onChange={handleChange} required />
            <input name="phone" placeholder="Phone No *" onChange={handleChange} required />
            <select name="gender" onChange={handleChange} required>
              <option value="">Gender *</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <input name="dob" type="date" placeholder="DOB *" onChange={handleChange} required /> */}
            <input name="experience" placeholder="Total Experience (Years) *" onChange={handleChange} required />
            <input name="ctc" placeholder="Current CTC *" onChange={handleChange} required />
            <input name="expectedCTC" placeholder="Expected CTC *" onChange={handleChange} required />
            <input name="location" placeholder="Location *" onChange={handleChange} required />
            <select name="relocate" onChange={handleChange} required>
              <option value="">Willing to Relocate? *</option>
              <option>Yes</option>
              <option>No</option>
            </select>
            <select name="noticePeriod" onChange={handleChange} required>
              <option value="">Notice Period *</option>
              <option>1 Month</option>
              <option>2 Months</option>
              <option>3 Months</option>
              <option>4 Months</option>
            </select>
            <input name="referralId" placeholder="Employee Referral Id" onChange={handleChange} />
          </div>

          <button onClick={handleSubmit} className="submit-btn" type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default JobApplicationModel;
