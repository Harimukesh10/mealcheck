export const fields: {
    name: string;
    label: string;
    type: "text" | "email" | "password" | "dropdown" | "textarea";
    placeholder?: string;
    validation: (value: string) => string | null;
    options?: string[];
  }[] = [
    {
      name: "username",
      label: "Username",
      type: "text",
      placeholder: "Enter your username",
      validation: (value: string) =>
        value.trim().length === 0 ? "Username is required." : value.trim().length < 6 && value.trim().length > 10
      ? "Username must be 6-10 characters long."
      : null,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "Enter your email",
      validation: (value: string) => value.trim().length === 0 ? "Email is required." :
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? "Please enter a valid email address."
          : null,
    },
    {
      name: "phone",
      label: "Contact No",
      type: "text",
      placeholder: "Enter your contact no",
      validation: (value: string) =>
        value.trim().length === 0
          ? "Phone number is required"
          : !/^\d{10}$/.test(value)
          ? "Please enter a 10-digit number."
          : null,
    },

    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
      validation: (value: string) =>
        value.trim() === ""
          ? "Password is required."
          : value.trim().length < 6 && value.trim().length > 10
          ? "Password must be 6-10 characters long."
          : null,
    },
  ];
  