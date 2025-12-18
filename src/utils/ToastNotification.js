// ✅ Correct File Location: src/utils/ToastNotification.js

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Toast container (to be rendered once in the app)
export const ToastifyContainer = () => (
  <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
);

// Toast utilities
export const successToast = {
  show: (message) => toast.success(message),
};

export const errorToast = {
  show: (message) => toast.error(message),
};

export const infoToast = {
  show: (message) => toast.info(message),
};

export const warningToast = {
  show: (message) => toast.warning(message),
};
