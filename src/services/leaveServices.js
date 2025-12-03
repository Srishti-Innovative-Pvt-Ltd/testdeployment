import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_HRMS;

// Get Employee Leaves by ID + Current Year
export const getEmployeeLeaves = async (employeeId) => {
  try {
    const token = localStorage.getItem("token");
    const currentYear = new Date().getFullYear();  // added current year
    let url = `${BASE_URL}v1/leaves/${employeeId}/${currentYear}`; 

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
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


// Apply leave API
export const applyLeave = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}v1/leaves/apply`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error("Error applying leave:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Failed to apply leave",
    };
  }
};


// Get own leave applications
export const getMyLeaveApplications = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${BASE_URL}v1/leaves/my-applications`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data.data, // array of leave applications
      message: response.data.message || "Fetched leave applications successfully",
    };
  } catch (error) {
    console.error("Error fetching my leave applications:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Failed to fetch leave applications",
    };
  }
};

// get leave requests
export const getLeaveApplications = async (status = "all", employeeId = null) => {
  try {
    const token = localStorage.getItem("token");

    let url = `${BASE_URL}v1/leaves/`;

    // status part
    switch (status.toLowerCase()) {
      case "approved":
        url += "approved";
        break;
      case "rejected":
        url += "rejected";
        break;
      case "pending":
        url += "pending";
        break;
      default:
        break;
    }

    // employeeId param if provided
    if (employeeId) {
      const connector = url.includes("?") ? "&" : "?";
      url += `${connector}reportingPersonId=${employeeId}`;
    }

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      data: response.data.data,
      message:
        response.data.message || "Leave applications fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching leave applications:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch leave applications",
    };
  }
};


// Approve Leave
export const approveLeave = async (leaveId, options) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${BASE_URL}v1/leaves/${leaveId}/approve`,
      {
        saturday: options.saturday || false,
        sunday: options.sunday || false,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
      message: response.data.message || "Leave approved successfully",
    };
  } catch (error) {
    console.error("Error approving leave:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Failed to approve leave",
    };
  }
};

// Reject Leave
export const rejectLeave = async (leaveId, payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${BASE_URL}v1/leaves/${leaveId}/reject`,
      payload, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
      message: response.data.message || "Leave rejected successfully",
    };
  } catch (error) {
    console.error("Error rejecting leave:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to reject leave",
    };
  }
};

// Get Leave Details by Leave ID and From Date
export const getLeaveDetailsByLeaveId = async (leaveId, fromDate) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      
      `${BASE_URL}v1/leaves/LeaveDetailsByLeaveId/${leaveId}/${fromDate}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data, 
      message: response.data.message || "Leave details fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching leave details:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch leave details",
    };
  }
};

// Get Monthly Employees by Year and Month
export const getMonthlyEmployees = async (year, month, employeeId = null) => {  
  try {
    const token = localStorage.getItem("token");

    let url = `${BASE_URL}v1/leaves/monthly-employees/${year}/${month}`;

    if (employeeId) {
      const connector = url.includes("?") ? "&" : "?";
      url += `${connector}reportingPersonId=${employeeId}`;
    }

    const response = await axios.get(url,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
      message:
        response.data.message || "Monthly employees fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching monthly employees:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch monthly employees",
    };
  }
};

// Get Leave Details by Employee ID, Year, and Month
export const getLeaveDetailsByEmployeeId = async (employeeId, year, month) => {  
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}v1/leaves/LeaveDetailsByEmployeeId/${employeeId}/${year}/${month}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Leave details for employee fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching leave details by employee ID:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch leave details by employee ID",
    };
  }
};

// Get employees reporting to a given employee
export const getReportingEmployees = async (employeeId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}v1/employeeJobAndSchedule/reporting/employees/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data?.data || [],
      message: response.data?.message || "Employees retrieved successfully",
    };
  } catch (error) {
    console.error("Error fetching reporting employees:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch reporting employees",
    };
  }
};


export const getAllEmployeeLeaveBalances = async (year) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${BASE_URL}v1/leaves/all/${year}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data?.data || [],
      message:
        response.data?.message ||
        "All employees leave balances retrieved successfully.",
    };
  } catch (error) {
    console.error("Error fetching all employee leave balances:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch leave balances",
    };
  }
};