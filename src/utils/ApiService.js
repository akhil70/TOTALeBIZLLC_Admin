// src/utils/api.js
import axios from "axios";

// Base API URL (your ngrok or deployed server)
// const API_BASE_URL = "http://192.168.29.233:8081/api";
const API_BASE_URL = "https://arbitration-conversations-colony-photography.trycloudflare.com/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Example: Get Users API
export const getUsers = async ({ emailId = "", page = 0, size = 20 }) => {
  try {
    const token = localStorage.getItem("token"); // get token from storage

    const response = await api.get("/users", {
      params: { emailId, page, size },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data; // return the actual API response data
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

//GET DASHBOARD DATA
export const getDashboardData = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/dashboard/status-card", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

// GET RESUME FILE
export const getViewResume = async (fileName) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(`/files/view/${fileName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // 👈 IMPORTANT
    });

    return response.data; // this will be a Blob
  } catch (error) {
    console.error("Error fetching resume:", error);
    throw error;
  }
};
//CHANGE PASSWORD
export const changePassword = async (currentPassword, newPassword, confirmNewPassword) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      "/users/change-password",
      {
        sourceType: "WEB",
        payLoad: {
          currentPassword,
          newPassword,
          conformNewPassword: confirmNewPassword, // spelling as backend expects
        },
        valid: true
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error changing password:", error.response?.data || error.message);
    throw error;
  }
};





// ✅ Login API
export const login = async (emailId, password) => {
  try {
    const response = await api.post("/no-auth/login", {
      payLoad: {
        emailId,
        password
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
};
// Register new user
export const registerUser = async (userData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.post(
      "/users/register",
      userData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error registering user:", error.response?.data || error.message);
    throw error;
  }
};

export const verifyRegisterOtp = async (emailId, otp) => {
  try {
    const response = await api.post(
      "/no-auth/user-register/otp-verify",
      {
        payLoad: {
          emailId,
          otp: Number(otp)
        }
      },

    );
    return response.data;
  } catch (error) {
    console.error("Error verifying OTP:", error.response?.data || error.message);
    throw error;
  }
};

export const completeUserRegistration = async (userData) => {
  try {
    const response = await api.post(
      "/no-auth/user-register",
      { payLoad: userData },
    );
    return response.data;
  } catch (error) {
    console.error("Error completing user registration:", error.response?.data || error.message);
    throw error;
  }
};
export const getDepartments = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/departments", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching departments:", error.response?.data || error.message);
    throw error;
  }
};

export const sendRegisterOtp = async (emailId) => {
  try {
    const response = await api.post(
      "/no-auth/user-register/otp",
      { payLoad: { emailId } },

    );
    return response.data;
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    throw error;
  }
};

// Fetch job details
export const getJobDetails = async ({ page = 0, size = 20, search = "" }) => {
  console.log("nmidn");

  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/job-details", {
      params: { page, size, search },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    return response.data.payLoad;
  } catch (error) {
    console.error("Error fetching job details:", error);
    throw error;
  }
};

export const fetchApplicants = async (status, page = 0, size = 30) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/jobs/view", {
      params: {

        applicationStatus: status,
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data?.payLoad?.data || [];
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return [];
  }
};




export const fetchApplicantsadmin = async (jobId, status, page = 0, size = 30) => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/jobs/view", {
      params: {
        jobId,
        applicationStatus: status,
        page,
        size,
      },
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data?.payLoad?.data || [];
  } catch (error) {
    console.error("Error fetching applicants:", error);
    return [];
  }
};









export const deleteJob = async (jobId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/job-details/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error deleting job:", error);
    throw error;
  }
};

export const updateApplicantStatus = async (id, status) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      "/jobs/change-status",
      {
        payLoad: {
          id,
          status,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating applicant status:", error);
    throw error;
  }
};


export const applyForJob = async (payload) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      "/jobs/apply",
      { payLoad: payload },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error applying for job:", error);
    throw error;
  }
};


export const createJobDetail = async (jobData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post("/job-details", jobData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    throw error;
  }
};




export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/users/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user profile:", error.response?.data || error.message);
    throw error;
  }
};




export const addDepartment = async (department) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post("/departments", department, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to add department", error);
    throw error;
  }
};





export const uploadProfilePicture = async (file) => {
  try {
    const token = localStorage.getItem("token");

    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(",")[1]); 
        reader.onerror = (error) => reject(error);
      });

    const base64Data = await toBase64(file);

   const payload = {
  sourceType: "WEB",
  payLoad: {
    fileName: file.name,
    fileSize: file.size,
    fileType: file.name.split(".").pop().toUpperCase(), // "JPG" | "JPEG" | "PNG"
    data: base64Data,
  },
  valid: true,
};

    const response = await api.post("/users/upload/profile-picture", payload, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading profile picture:", error.response?.data || error.message);
    throw error;
  }
};



export const fetchProfilePicture = async (fileName) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/users/profile-picture/view/${fileName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", 
    });

    return URL.createObjectURL(response.data); 
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    return null;
  }
};




export default api;
