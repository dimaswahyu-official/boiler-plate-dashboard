// src/components/CustomToast.tsx
import React from "react";
import { ToastContainer, toast, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CustomToast: React.FC = () => {
  return (
    <>
      <ToastContainer style={{ zIndex: 10000 }} />
    </>
  );
};

export const showToast = (message: string) => {
  toast(message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};

export const showErrorToast = (errorMessage: string) => {
    toast.error(errorMessage, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
        transition: Bounce,
        style: { zIndex: 9999 }, // Ensure the toast appears on top
    });
};

export const showSuccessToast = (successMessage: string) => {
  toast.success(successMessage, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Bounce,
  });
};

export default CustomToast;
