import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_HRMS;

///Admin login api

export const login = async ({ email, password }) => {
  try {
    const response = await axios.post(`${BASE_URL}v1/auth/login`, {
      email,
      password,
    });

    const { token, data, message } = response.data;

    return {
      success: true,
      token,
      admin: data,
      message,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};
