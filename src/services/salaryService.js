import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_HRMS;


//Create a new salary structure
export const createSalaryStructure = async (payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}v1/settings/salary-structures`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Salary Structure created successfully",
    };
  } catch (error) {
    console.error("Error creating salary structure:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to create salary structure",
    };
  }
};


//Get all salary structures OR by company ID
export const getSalaryStructures = async (companyId = "") => {
  try {
    const token = localStorage.getItem("token");

    const url = companyId
      ? `${BASE_URL}v1/settings/salary-structures/${companyId}`
      : `${BASE_URL}v1/settings/salary-structures`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

     const data =
      response.data?.data?.salaryStructures || // case when all are fetched
      response.data?.data?.salaryStructure || // case when single-company or API returns singular
      [];

    return {
      success: true,
      data,
      message: response.data.message || "Salary structure(s) fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching salary structures:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch salary structures",
    };
  }
};

// Update Salary Component
export const updateSalaryComponent = async (companyId, componentId, data) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.patch(
      `${BASE_URL}v1/settings/salary-structures/${companyId}/components/${componentId}`,
      data,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return {
      success: response.data.status === "success",
      data: response.data.data,
      message: response.data.message || "Salary component updated successfully",
    };
  } catch (error) {
    console.error("Error updating salary component:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update salary component",
    };
  }
};


// Delete Salary Component
export const deleteSalaryComponent = async (companyId, componentId) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(
      `${BASE_URL}v1/settings/salary-structures/${companyId}/components/${componentId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    // If no error thrown, deletion succeeded
    return { success: true, message: "Salary component deleted successfully" };
  } catch (error) {
    console.error("Error deleting salary component:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || "Failed to delete salary component" 
    };
  }
};


// Allocate payrolls for categories
export const allocatePayrollsforCategory = async (companyId, categoryIds, allocatedComponents) => {
  try {
    const token = localStorage.getItem("token");
    const body = {
      companyId,
      allocations: {
        categoryIds,
        allocatedComponents,
      },
    };

    const res = await axios.post(`${BASE_URL}v1/payroll-allocations`, body, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return { success: true, data: res.data };
  } catch (error) {
    console.error("Error allocating payrolls:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || "Failed to allocate payrolls" 
    };
  }
};

export const getPayrollAllocations = async (companyId = "", categoryId = "") => {
  try {
    const token = localStorage.getItem("token");
    let url = `${BASE_URL}v1/payroll-allocations`;

    if (companyId && categoryId) {
      url += `/company/${companyId}?categoryId=${categoryId}`;
    }
    else if (companyId) {
      url += `/company/${companyId}`;
    }

    const res = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const allocations = res.data?.data?.allocations || [];

    return { success: true, data: allocations };
  } catch (err) {
    console.error("Error fetching payroll allocations:", err);
    return {
      success: false,
      message: err.response?.data?.message || err.message || "Failed to fetch payroll allocations",
    };
  }
};


// Update allocated payrolls by category
export const updatePayrollAllocations = async (categoryId, allocatedComponents) => {
  try {
    const token = localStorage.getItem("token");

    const body = { allocatedComponents };

    const res = await axios.patch(
      `${BASE_URL}v1/payroll-allocations/${categoryId}`,
      body,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return { success: true, data: res.data.data.allocation };
  } catch (error) {
    console.error("Error updating payroll allocation:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to update payroll allocation",
    };
  }
};



// Get Employee Payroll Allocations
export const getEmployeePayrollAllocations = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}v1/employee-payroll-allocations`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data?.data?.employees || [];

    return {
      success: true,
      data,
      message: response.data.message || "Employee payroll allocations fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching employee payroll allocations:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch employee payroll allocations",
    };
  }
};


export const saveEmployeePayrollAllocations = async (employeeId, allocatedComponents) => {
  console.log("Saving allocations for employee:", employeeId, allocatedComponents);
  
  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${BASE_URL}v1/employee-payroll-allocations/${employeeId}`,
      { allocatedComponents },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: res.data?.data || res.data };
  } catch (error) {
    console.error("Error saving employee payroll allocation:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to save allocation",
    };
  }
};


