import React, { useEffect, useState } from "react";
import Form from "../components/Form";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/useToast";
import Loader from "../components/Loader";
import { fields } from "../constants/constants";
import axios from "axios";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: Record<string, string>) => {
    setLoading(true);
    try {
      const res = await api.post("/register", formData);

      // If the first call is successful, proceed with the second call
      if (res.status === 201) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error during registration:", error);


      // Type assertion to check if error is an AxiosError
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          // Network error
          showToast("error", "Network error. Please check your internet connection and try again.", {
            position: "top-center",
          });
        }
        // Check if the error response status is 429 (Too Many Requests)
        else if (error.response && error.response.status === 429) {
          showToast("error", "Too many requests, please try again later.", {
            position: "top-center",
          });
        } else {
          showToast("error", "Registration failed. Please try again.", {
            position: "top-center",
          });
        }
      } else {
        showToast("error", "An unexpected error occurred. Please try again.", {
          position: "top-center",
        });
      }

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = `Register`;
  }, []);

  return (
    <div className="flex flex-col justify-center h-[100dvh]">
      <div className="bg-gray-100 mx-auto w-full md:w-[500px] rounded">
        {loading ? (
          <Loader />
        ) : (
          <>
            <Form
              formLabel="Create Account"
              fields={fields}
              onSubmit={handleSubmit}
              submitButtonLabel={"Register"}
              formWidth="500px"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Register;