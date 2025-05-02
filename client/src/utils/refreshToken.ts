import api from "../api";
import { logoutUser } from "./logoutUser";

export const refreshToken = async () => {
    try {
      await api.post('/refresh-token');
    } catch (error) {
      console.error('Refresh token error:', error);
      await logoutUser();
    }
  };