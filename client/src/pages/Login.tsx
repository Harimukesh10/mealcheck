import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { login } from "../redux/authSlice";
import Form from "../components/Form";
import { useToast } from "../hooks/useToast";
import axios from "axios";
import Loader from "../components/Loader";

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const fields: {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "dropdown";
    placeholder?: string;
    validation: (value: string) => string | null;
    options?: string[];
    value: string;
  }[] = [
      {
        name: "username",
        label: "Username",
        type: "text",
        value: '',
        placeholder: "Enter your username",
        validation: (value: string) =>
          value.trim().length === 0 ? "Username is required." : null,
      },
      {
        name: "password",
        label: "Password",
        type: "password",
        value: '',
        placeholder: "Enter your password",
        validation: (value: string) =>
          value.trim() === ""
            ? "Password is required."
            : value.length < 6
              ? "Password must be at least 6 characters long."
              : null,
      },
    ];

  useEffect(() => {
    document.title = "Recipe Explorer";
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, [setLoading]);

  const handleSubmit = async (formData: Record<string, string>) => {
    setLoading(true);
    try {
      const response = await api.post("/login", formData);
      localStorage.setItem("user", JSON.stringify(response.data));
      dispatch(login(response.data));
      if (response.data.role == "member") {
        navigate("/meallist");
      } else {
        navigate("/add-drugs");
      }

    }
    // catch (error: unknown) {
    //   if (error instanceof AxiosError) {
    //     showToast("error", error?.response?.data.message, {
    //       position: "top-center",
    //     });
    //   } else {
    //     console.log("Error Logging In:", error);
    //   }
    // } 
    catch (error) {
      console.error("Error during registration:", error);


      // Type assertion to check if error is an AxiosError
      if (axios.isAxiosError(error)) {
        // Check if the error response status is 429 (Too Many Requests)

        if (!error.response) {
          // Network error
          showToast("error", "Network error. Please check your internet connection and try again.", {
            position: "top-center",
          });
        }

        else if (error.response && error.response.status === 429) {
          showToast("error", "Too many requests, please try again later.", {
            position: "top-right",
          });
        } else {
          showToast("error", "Registration failed. Please try again.", {
            position: "top-right",
          });
        }
      } else {
        showToast("error", "An unexpected error occurred. Please try again.", {
          position: "top-right",
        });
      }

    }
    finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />
  }
  return (
    <div className="flex flex-col justify-center h-[100dvh]">
      <div className="w-full md:w-[500px] mx-auto bg-gray-100 rounded">
        <Form
          formLabel="Login"
          fields={fields}
          onSubmit={handleSubmit}
          submitButtonLabel="Login"
          formWidth="400px"
        />
      </div>
    </div>
  );
};

export default LoginForm;