import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_HRMS;

//Create Employee iD pattern
export const createEmployeeIdPattern = async (payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}v1/employeeId-settings`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
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
// get employee id pattern
export const getEmployeeIdPattern = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${BASE_URL}v1/employeeId-settings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return {
      success: true,
      data: response.data.data,
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
//Update Employee id pattern
export const updateEmployeeIdPattern = async (id, payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${BASE_URL}v1/employeeId-settings/${id}`,
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

// Add Department API
export const createDepartment = async (payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}v1/settings/createDepartment`,
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

//get  all departments  and filtered companies department
export const getDepartments = async (companyId = "") => {
  try {
    const token = localStorage.getItem("token");

    // If companyId given, fetch filtered departments, else all
    const url = companyId
      ? `${BASE_URL}v1/settings/getAllDepartments/${companyId}`
      : `${BASE_URL}v1/settings/getAllDepartments`;

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

// // Update Department API
export const updateDepartment = async (id, payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${BASE_URL}v1/settings/updateDepartment/${id}`,
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

// Create Shift
export const createShift = async (payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}v1/settings/createShift`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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

// Get Shifts by Company ID
export const getShifts = async (companyId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}v1/settings/getAllShifts/${companyId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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

// Update Shift
export const updateShift = async (id, payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${BASE_URL}v1/settings/updateShift/${id}`,
      payload,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
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

// Get All Shifts
export const getAllShifts = async (companyId = "") => {
  try {
    const token = localStorage.getItem("token");

    const url = companyId
      ? `${BASE_URL}v1/settings/getAllShifts/${companyId}`
      : `${BASE_URL}v1/settings/getAllShifts`;

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

// Add Designation API
export const createDesignation = async (payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}v1/settings/createDesignation`,
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
// Get Designations API
export const getDesignations = async (companyId = "") => {
  try {
    const token = localStorage.getItem("token");

    const url = companyId
      ? `${BASE_URL}v1/settings/getAllDesignations/${companyId}`
      : `${BASE_URL}v1/settings/getAllDesignations`;

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

// Update Designation API
export const updateDesignation = async (id, payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${BASE_URL}v1/settings/updateDesignation/${id}`,
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

// Create Employee Category
export const createEmployeeCategory = async (payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}v1/settings/createEmployeeCategory`,
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

// Get all Employee Categories for a company
export const getEmployeeCategories = async (companyId = "") => {
  try {
    const token = localStorage.getItem("token");

    const url = companyId
      ? `${BASE_URL}v1/settings/getAllEmployeeCategories/${companyId}`
      : `${BASE_URL}v1/settings/getAllEmployeeCategories`;

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

// Update Employee Category
export const updateEmployeeCategory = async (id, payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${BASE_URL}v1/settings/updateEmployeeCategory/${id}`,
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

// Create Leave Type
export const createLeave = async (payload) => {
  try {
    const token = localStorage.getItem("token"); // if token auth is required

    const response = await axios.post(
      `${BASE_URL}v1/leaves/createLeaveType`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data.leaveType,
      message: response.data.message || "Leave created successfully",
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

// Get all leaves
export const getAllLeaves = async (id = "") => {
  try {
    const token = localStorage.getItem("token");

    const url = id
      ? `${BASE_URL}v1/leaves/getAllLeaveType/${id}`
      : `${BASE_URL}v1/leaves/getAllLeaveType`;

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

// Update leave
export const updateLeave = async (id, payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${BASE_URL}v1/leaves/updateLeaveType/${id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data.leaveType,
      message: response.data.message || "Leave updated successfully",
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

// Delete leave
export const deleteLeave = async (leave_id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${BASE_URL}v1/leaves/deleteLeaveType/${leave_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data,
      message: response.data.message || "Leave deleted successfully",
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

// Create Assigned Leave
export const createAssignedLeave = async (payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}v1/leaves/assignLeave`,
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
      message: response.data.message || "Leave assigned successfully",
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

// Get Assigned Leaves with optional filters
export const getAssignedLeaves = async (
  companyId = "",
  employeeCategory = ""
) => {
  try {
    const token = localStorage.getItem("token");
    let url = `${BASE_URL}v1/leaves/getAssignleaves`;

    // If companyId 
    if (companyId) {
      url += `/${companyId}`;
    }
    if (employeeCategory) {
      url += `?employeeCategoryId=${employeeCategory}`;
    }
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


// Update Assigned Leave
export const updateAssignedLeave = async (assignLeaveId, payload) => {
  try {
    const token = localStorage.getItem("token");

    const url = `${BASE_URL}v1/leaves/updateAssignleaves/${assignLeaveId}`;

    const response = await axios.put(url, payload, {
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
        error.response?.data?.message || error.message || "Something went wrong",
    };
  }
};


// Create Reimbursement Category
export const createReimbursementCategory = async (payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}v1/settings/reimbursement-categories`,
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
      message:
        response.data.message ||
        "Reimbursement category created successfully",
    };
  } catch (error) {
    console.error("Error creating reimbursement category:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to create reimbursement category",
    };
  }
};

// Get Reimbursement Categories 
export const getReimbursementCategories = async () => {

  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}v1/settings/reimbursement-categories`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data.data, 
    };
  } catch (error) {
    console.error("Error fetching reimbursement categories:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch reimbursement categories",
    };
  }
};

// Update Reimbursement Category
export const updateReimbursementCategory = async (type, payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${BASE_URL}v1/settings/reimbursement-categories/${type}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: response.data.data };
  } catch (error) {
    console.error("Error updating reimbursement category:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to update reimbursement category",
    };
  }
};


// Delete Reimbursement Category by type
export const deleteReimbursementCategory = async (type) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${BASE_URL}v1/settings/reimbursement-categories/${type}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data.message || "Category deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting reimbursement category:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to delete category",
    };
  }
};


// Apply Reimbursement
export const applyReimbursement = async (formData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}v1/reimbursements`,
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
      message: response.data.message || "Reimbursement submitted successfully",
    };
  } catch (error) {
    console.error("Error applying reimbursement:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to submit reimbursement",
    };
  }
};

// Get reimbursements by employee and/or company
export const getReimbursements = async ({ employeeId, company } = {}) => {
  
  try {
    const token = localStorage.getItem("token");

    // Build query params dynamically
    const params = new URLSearchParams();
    if (employeeId) params.append("employeeId", employeeId);
    if (company) params.append("company", company);

    const response = await axios.get(
      `${BASE_URL}v1/reimbursements?${params.toString()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: response.data.data.applications };
  } catch (error) {
    console.error("Error fetching reimbursements:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch reimbursements",
    };
  }
};

// Delete reimbursement by applicationId
export const deleteReimbursement = async (applicationId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.delete(
      `${BASE_URL}v1/reimbursements/${applicationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data.message || "Reimbursement deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting reimbursement:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to delete reimbursement",
    };
  }
};


// get reimbursment with application id
export const getReimbursementByApplicationId = async (applicationId) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}v1/reimbursements/${applicationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return { success: true, data: response.data.data.application };
  } catch (error) {
    console.error("Error fetching reimbursement details:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch reimbursement details",
    };
  }
};

// Update reimbursement status
// export const updateReimbursementStatus = async (applicationId, status) => {
//   try {
//     const token = localStorage.getItem("token");

//     const response = await axios.patch(
//       `${BASE_URL}v1/reimbursements/${applicationId}/status`,
//       { status },
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//     return {
//       success: true,
//       message: response.data.message || `Status updated to ${status}`,
//       data: response.data.data.application,
//     };
//   } catch (error) {
//     console.error("Error updating reimbursement status:", error);
//     return {
//       success: false,
//       message:
//         error.response?.data?.message ||
//         error.message ||
//         `Failed to update status to ${status}`,
//     };
//   }
// };

export const updateReimbursementStatus = async (applicationId, status, rejectedReason = null) => {
  try {
    const token = localStorage.getItem("token");

    const payload = { status };
    if (status === "Rejected" && rejectedReason) {
      payload.rejectedReason = rejectedReason;
    }

    const response = await axios.patch(
      `${BASE_URL}v1/reimbursements/${applicationId}/status`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data.message || `Status updated to ${status}`,
      data: response.data.data.application,
    };
  } catch (error) {
    console.error("Error updating reimbursement status:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        `Failed to update status to ${status}`,
    };
  }
};



// Update reimbursement amount
export const updateReimbursementAmount = async (applicationId, reimbursementAmount) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${BASE_URL}v1/reimbursements/${applicationId}/amount`,
      { reimbursementAmount },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      message: response.data.message || "Reimbursement amount updated successfully",
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error updating reimbursement amount:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to update reimbursement amount",
    };
  }
};
