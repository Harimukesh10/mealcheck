import api from "../api";

export const logoutUser = async (): Promise<void> => {
    try {
      await api.post('/logout');
      localStorage.removeItem("user");
      window.location.href = "/";
    } catch (error) {
      console.error('Logout error:', error);
    }
  };