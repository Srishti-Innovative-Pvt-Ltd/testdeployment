import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_HRMS;
// add companies
export const addCompany = async (formValues) => {
  try {
    const token = localStorage.getItem("token");

    const formData = new FormData();

    formData.append("companyName", formValues.companyName);
    formData.append("address", formValues.address);
    if (formValues.logo) formData.append("logo", formValues.logo);
    if (formValues.header) formData.append("letterHead", formValues.header);
    if (formValues.footer) formData.append("letterFooter", formValues.footer);
    formData.append("parentCompany", formValues.parentCompany || "");
     formData.append("probationPeriod", formValues.probationPeriod || "");
    const response = await axios.post(`${BASE_URL}v1/companies`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      message: response.data.message,
      data: response,
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

// get all companies
export const getCompanies = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${BASE_URL}v1/companies`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data.data.companies,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// get all companies by name

export const getCompaniesByName = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}v1/companies/getCompanyNames`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data.company,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

// to get a single company by id
export const getCompanyById = async (companyId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}v1/companies/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data.data;
  } catch (error) {
    console.error("Error fetching company:", error);
    throw error;
  }
};

// edit company
export const updateCompany = async (companyId, formData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${BASE_URL}v1/companies/${companyId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data.message,
      data: response.data.data.company,
    };
  } catch (error) {
    console.error("Error updating company:", error);
    return {
      success: false,
      message: error?.response?.data?.message || error.message,
    };
  }
};


// Get Companies With Salary Structures
export const getCompaniesWithStructures = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}v1/settings/salary-structures/companies-with-structures`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: response.data.status === "success",
      data: response.data.data || [],
      message: response.data.message || "Companies with salary structures fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching companies with salary structures:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch companies with salary structures",
    };
  }
};
