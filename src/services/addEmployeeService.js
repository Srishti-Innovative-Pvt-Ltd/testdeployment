import axios from "axios";

const BASE_URL = import.meta.env.VITE_BACKEND_HRMS;

//auto fetch th eemployee id on itial load of add employee
export const fetchGeneratedEmployeeId = async (companyId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}v1/employees/generateId/${companyId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },

    });
    return {
      success: true,
      message: response.data.message,
      employeeId: response.data.data.employeeId,
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

// Add Employee submit (post)
export const addEmployee = async (formData) => {

  try {
    const token = localStorage.getItem("token");
    const payload = new FormData();

    payload.append("firstName", formData.firstName);
    payload.append("middleName", formData.middleName);
    payload.append("lastName", formData.lastName);
    payload.append("officialEmailId", formData.officialEmail);
    payload.append("employeeId", formData.employeeId);
    payload.append("password", formData.password);
    payload.append("status", formData.status);
    payload.append("role", formData.role);

    if (formData.profilePic) {
      payload.append("profileImage", formData.profilePic);
    }

    const companyId = formData.companies;

    const response = await axios.post(
      `${BASE_URL}v1/employees/createEmployeeCredentials/${companyId}`,
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

export const addEmployeePersonalDetails = async (user_id, formData) => {
  try {
    const token = localStorage.getItem("token");

    const payload = new FormData();

    // Append all basic fields
    payload.append("employeeId", formData.employeeId);
    payload.append("firstName", formData.firstName);
    payload.append("middleName", formData.middleName);
    payload.append("lastName", formData.lastName);
    payload.append("dateOfBirth", formData.dateOfBirth);
    payload.append("gender", formData.gender);
    payload.append("age", formData.age);
    payload.append("primaryAddress", formData.primaryAddress);
    payload.append("permanentAddress", formData.permanentAddress);
    payload.append("nationality", formData.nationality);
    payload.append("state", formData.state);
    payload.append("city", formData.city);
    payload.append("place", formData.place);
    payload.append("personalEmail", formData.personalEmail);
    payload.append("officialEmail", formData.officialEmail);
    payload.append("primaryContactNo", formData.primaryContactNo);
    payload.append("secondaryContactNo", formData.secondaryContactNo);
    payload.append("emergencyContactNo", formData.emergencyContactNo);
    payload.append("dateOfJoining", formData.dateOfJoining);
    payload.append("previousExperience", formData.previousExperience);
    payload.append("sameAsPrimary", formData.sameAsPrimary);

    // Handle qualification array
    if (formData.qualification?.length) {
      formData.qualification.forEach((q, index) => {
        payload.append(`qualifications[${index}]`, q);  // Fixed template literal syntax
      });
    }

    // Handle expertise array
    if (formData.expertise?.length) {
      formData.expertise.forEach((exp, index) => {
        payload.append(`technicalExpertise[${index}]`, exp);
      });
    }

    // Handle profile image
    if (formData.profileImage) {
      payload.append("profileImage", formData.profileImage);
    }

    const response = await axios.put(
      `${BASE_URL}v1/employees/onboardInitialEmployeeInfo/${user_id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,

        }
      }
    );

    return {
      success: true,
      message: response.data.message,
      data: response.data.data,
    };
  } catch (error) {
    console.error('Error submitting employee details:', error);  // Added error logging
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Something went wrong",
    };
  }
};
export const addEmployeeIDandDocDetails = async (user_id, formData) => {

  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(
      `${BASE_URL}v1/employees/onboardIDAndDocuments/${user_id}`,
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

export const addEmployeeHealthInfo = async (user_id, healthInfo) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${BASE_URL}v1/employees/onboardHealthInfo/${user_id}`,
      healthInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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

export const addEmployeeDependents = async (user_id, dependentInfo) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${BASE_URL}v1/employees/onboardDependents/${user_id}`,
      dependentInfo,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
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
//employees full data
export const viewEmployeeData = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${BASE_URL}v1/employees/getAllProfile`, {
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
        error.response?.data?.message || error.message || "Unable to fetch employee data",
    };
  }
};

//employees names for dropdown
export const getEmployeesByCompany = async (companyId = "") => {
  try {
    const token = localStorage.getItem("token");

    const url = companyId
      ? `${BASE_URL}v1/employees/basic-info?companyId=${companyId}`
      : `${BASE_URL}v1/employees/basic-info`;

    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return {
      success: true,
      data: response.data?.data || [],
      message: response.data?.message || "Fetched employees successfully",
    };
  } catch (error) {
    console.error("Error fetching employees:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Unable to fetch employee data",
    };
  }
};

//get employee probation end date
export const getEmployeeProbationDate = async (user_id) => {

  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${BASE_URL}v1/employeeJobAndSchedule/${user_id}/probationEndDate`, {
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
        error.response?.data?.message || error.message || "Unable to fetch employee data",
    };
  }
};


export const viewEmployeeByEmpId = async (empId) => {

  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(`${BASE_URL}v1/employees/getProfile/${empId}`, {
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
        error.response?.data?.message || error.message || "Unable to fetch employee data",
    };
  }
};



// Get Employee ID and Document Details
export const getEmployeeIDandDocDetails = async (user_id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}v1/employees/employee-profile/${user_id}?idDocumentsInfo=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.data);

    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    console.error('Error fetching ID document details:', error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch ID document details",
    };
  }
};

// get employee health info 
export const getEmployeeHealthInfo = async (user_id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}v1/employees/employee-profile/${user_id}?healthInfo=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('health', response);
    return {
      success: true,
      data: response.data.data.healthInfo,

    };
  } catch (error) {
    console.error('Error fetching health info:', error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch health info",
    };
  }
};
// get employe Dependance info 
export const getEmployeeDependanceInfo = async (user_id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}v1/employees/employee-profile/${user_id}?dependentInfo=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log('dependance', response);

    return {
      success: true,
      data: response.data.data.dependentInfo,
    };
  } catch (error) {
    console.error('Error fetching health info:', error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch health info",
    };
  }
};

//employee get personal information
export const getEmployeePersonalAndProfessionalInfo = async (user_id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}v1/employees/employee-profile/${user_id}?personal=true&professional=true&user=true&contactInfo=true`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log(response.data.data);

    return {
      success: true,
      data: response.data.data,
    };
  } catch (error) {
    console.error("Error fetching personal & professional info:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || error.message || "Failed to fetch info",
    };
  }
};

export const toggleEmployeeStatus = async (employeeId, status) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${BASE_URL}v1/employees/${employeeId}/toggle-status`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || error.message,
    };
  }
};




// verify dependance section
export const verifyEmployeeDependents = async (user_id, payload) => {

  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${BASE_URL}v1/employees/verify/dependents/${user_id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      success: true,
      data: response?.data?.data?.dependentInfo || [],
    };
  } catch (error) {
    console.error("Error fetching dependent Info:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch dependent Info",
    };
  }
};

// verify Health Info section
export const verifyEmployeeHealthInfo = async (user_id, payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${BASE_URL}v1/employees/verify/healthInfo/${user_id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      success: true,
      data: response?.data?.data?.dependentInfo || [],
    };
  } catch (error) {
    console.error("Error fetching dependent Info:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch dependent Info",
    };
  }
};

// verify  Personal section
export const verifyEmployeePersonalInfo = async (user_id, payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${BASE_URL}v1/employees/verify/initialEmployeeInfo/${user_id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      success: true,
      data: response?.data?.data?.dependentInfo || [],
    };
  } catch (error) {
    console.error("Error fetching dependent Info:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch dependent Info",
    };
  }
};

// verify Id & Document section
export const verifyEmployeeIdAndDocuments = async (user_id, payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.patch(
      `${BASE_URL}v1/employees/verify/IDAndDocuments/${user_id}`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      success: true,
      data: response?.data?.data?.dependentInfo || [],
    };
  } catch (error) {
    console.error("Error fetching dependent Info:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to fetch dependent Info",
    };
  }
};

// get all verifiedEmployees
export const getVerifiedEmployees = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}v1/employees/getVerifiedEmployees`,
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
        "Unable to fetch verified employees",
    };
  }
};

// Submit Employee Job Schedule
export const submitEmployeeJobSchedule = async (user_id, payload) => {
  
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}v1/employeeJobAndSchedule/${user_id}`,
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
      message: "Job Schedule saved successfully!"
    };
  } catch (error) {
    console.error("Error saving Job Schedule:", error);
    return { 
      success: false, 
      message: error.response?.data?.message || error.message || "Failed to save Job Schedule"
    };
  }
};

// Get employee job ands schedule
export const getEmployeeJoBAndSchedule = async (user_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}v1/employeeJobAndSchedule/${user_id}`,
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
        error.response?.data?.message || error.message || "Something went wrong",
    };
  }
};

// Update employee job schedule
export const updateEmployeeJobSchedule = async (user_id, payload) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.put(
      `${BASE_URL}v1/employeeJobAndSchedule/${user_id}`,
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
      message: response.data.message || "Job Schedule updated successfully!"
    };
  } catch (error) {
    console.error("Error updating Job Schedule:", error);
    return {
      success: false,
      message: error.response?.data?.message || error.message || "Failed to update Job Schedule"
    };
  }
};



// Get health info rejection reasons
export const getHealthInfoRejectionReasons = async (user_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}v1/employees/rejection-reasons/healthInfo/${user_id}`,
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
        error.response?.data?.message || error.message || "Something went wrong",
    };
  }
};


// Get dependents rejection reasons
export const getDependentsRejectionReasons = async (user_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}v1/employees/rejection-reasons/dependents/${user_id}`,
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
        error.response?.data?.message || error.message || "Something went wrong",
    };
  }
};

// Get ID documents rejection reasons
export const getIdDocumentsRejectionReasons = async (user_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}v1/employees/rejection-reasons/idAndDocuments/${user_id}`,
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
        error.response?.data?.message || error.message || "Something went wrong",
    };
  }
};

//getverify onboarding rejection reasons
export const getOnboardingRejectionReasons = async (user_id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}v1/employees/rejection-reasons/onboarding/${user_id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log("Rejection reasons response:", response.data);
    
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



// Fetch profile image URL
export const fetchProfileImage = async (userId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}v1/employees/profile-image/${userId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    if (response.data?.data?.profileImage?.value) {
      return response.data.data.profileImage.value; // just return file path
    }
    return null;
  } catch (error) {
    // console.error("Error fetching profile image:", error);
    return null;
  }
};

// Check if employee has reporting person
export const checkReportingPerson = async (employeeId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}v1/employeeJobAndSchedule/hasreportingperson/${employeeId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; 
  } catch (error) {
    console.error("Error checking reporting person:", error);
    return { hasReportingPerson: false };
  }
};

// Get Employee Salary Structure
export const getEmployeeSalaryStructure = async (user_id) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(
      `${BASE_URL}v1/employee-payroll-allocations/${user_id}/salary-structure`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data?.data || {};
    return {
      success: true,
      data,
      message: response.data.message || "Salary structure fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching salary structure:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch salary structure",
    };
  }
};

//  POST — Create or Update Employee Salary
export const saveEmployeeSalary = async (payload) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${BASE_URL}v1/employee-salaries`,
      payload,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return {
      success: true,
      data: response.data.data.salary,
      message: "Salary saved successfully",
    };
  } catch (error) {
    console.error("Error saving salary:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to save salary",
    };
  }
};

// Get Employee Salary History
export const getEmployeeSalaryHistory = async (user_id) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.get(
      `${BASE_URL}v1/employee-salaries/${user_id}/history`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const data = response.data?.data || {};
    return {
      success: true,
      data,
      message: response.data.message || "Salary history fetched successfully",
    };
  } catch (error) {
    console.error("Error fetching salary history:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Failed to fetch salary history",
    };
  }
};


