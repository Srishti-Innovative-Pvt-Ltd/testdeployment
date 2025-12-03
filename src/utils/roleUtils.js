// src/utils/roleUtils.js
export const getUserRole = () => {
  return localStorage.getItem("role");
};

export const getUserId = () => {
  return localStorage.getItem("user_id");
};

export const getVerificationStatus = () => {
  return localStorage.getItem("verificationStatus");
};

export const getCompanyId = () => {
  return localStorage.getItem("company_id");
};         