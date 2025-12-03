import * as Yup from "yup";

const rupeeValidation = Yup.number()
  .typeError("Amount must be a number")
  .positive("Amount must be greater than zero")
  .max(10000000, "Amount too large")
  .required("This field is required");

const SUPPORTED_IMAGE_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
];
const SUPPORTED_PDF_FORMATS = ["application/pdf"];
const FILE_SIZE = 1024 * 1024;
const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const MAX_PDF_FILE_SIZE = 5 * 1024 * 1024; // 5MB

///for both images and pdf
const ALLOWED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
];

// Helper to get today's date without time
const today = new Date();
today.setHours(0, 0, 0, 0);

export const pdfOrImageFileRule = Yup.mixed()
  .required("A file is required")
  .test("fileType", "Only PDF, JPG, PNG, or GIF files are allowed", (file) =>
    file ? ALLOWED_FILE_TYPES.includes(file.type) : false
  )
  .test("fileSize", "File is too large", (file) => {
    if (!file) return false;

    if (file.type === "application/pdf") {
      return file.size <= MAX_PDF_FILE_SIZE;
    }
    return file.size <= MAX_FILE_SIZE;
  });

//Attendance excel formating
const SUPPORTED_FILE_TYPES = [
  // "application/vnd.ms-excel",
  // "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
];
export const excelOrCsvFileRule = Yup.mixed()
  .required("File is required")
  .test(
    "fileSize",
    "File too large (>20MB)",
    (file) => file && file.size <= MAX_FILE_SIZE
  )
  .test(
    "fileType",
    "Unsupported file type. Only .csv allowed",
    (file) => file && SUPPORTED_FILE_TYPES.includes(file.type)
  );
export const attendanceExcelUploadSchema = Yup.object({
  location: Yup.string().required("Please select a location"),
  file: excelOrCsvFileRule, // ✅ reuse the rule you imported
});
export const pdfOnlyFileRule = Yup.mixed()
  .required("PDF file is required")
  .test(
    "fileSize",
    "File too large (max 5MB)",
    (file) => file && file.size <= MAX_PDF_FILE_SIZE
  )
  .test(
    "fileType",
    "Only PDF files are allowed",
    (file) => file && file.type === "application/pdf"
  );

const imageFileRule = Yup.mixed()
  .nullable()
  .test("fileSize", "Image too large (max 2MB)", (file) => {
    if (!file) return true;
    return file.size <= MAX_FILE_SIZE; //  2MB
  })
  .test("fileType", "Only JPG, PNG, or GIF files allowed", (file) => {
    if (!file) return true;
    return ["image/jpeg", "image/jpg", "image/png", "image/gif"].includes(
      file.type
    );
  });

export const pdfFileRule = Yup.mixed()
  .required("PDF file is required")
  .test(
    "fileSize",
    "File too large (max 1MB)",
    (file) => file && file.size <= FILE_SIZE
  )
  .test(
    "fileType",
    "Only PDF files are allowed",
    (file) => file && file.type === "application/pdf"
  );

const passwordRule = Yup.string()
  .required("Password is required")
  .matches(
    PASSWORD_RULE,
    "Password must include 8+ characters, uppercase, lowercase, number, symbol"
  );

//personaldetails old
export const personalDetailsSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  middleName: Yup.string().required("Middle Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  employeeId: Yup.string().required("Employee ID is required"),
  otherId: Yup.string().required("Other ID is required"),
  dob: Yup.date().required("Date of Birth is required"),
  age: Yup.string().required("Age is required"),
  doj: Yup.date().required("Date of Joining is required"),
  contactPrimary: Yup.string().required("Primary Contact is required"),
  contactSecondary: Yup.string().required("Secondary Contact is required"),
  contactEmergency: Yup.string().required("Emergency Contact is required"),
  emailOfficial: Yup.string()
    .email("Invalid email")
    .required("Official Email is required"),
  personalEmail: Yup.string()
    .email("Invalid email")
    .required("Personal Email is required"),
  addressPrimary: Yup.string().required("Primary Address is required"),
  addressPermanent: Yup.string().when("sameAsPrimary", {
    is: false,
    then: Yup.string().required("Permanent Address is required"),
    otherwise: Yup.string(),
  }),
  addressPermanent: Yup.string().required("Permanent Address is required"),
  nationality: Yup.string().required("Nationality is required"),
  maritalStatus: Yup.string().required("Marital Status is required"),
  experience: Yup.string().required("Experience is required"),
  qualification: Yup.string().required("Qualification is required"),
  expertise: Yup.string().required("Technical Expertise is required"),
  gender: Yup.string().required("Gender is required"),
  licenseNumber: Yup.string().required("Driver's License Number is required"),
  licenseExpiry: Yup.date().required("License Expiry Date is required"),
  files: Yup.array().min(1, "At least one file is required").of(pdfFileRule),
  comment: Yup.string().required("Comment is required"),
});

///Add employee page
export const addEmployeeSchema = Yup.object().shape({
  profilePic: imageFileRule,
  firstName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "First name must contain only letters")
    .required("First Name is required"),
  middleName: Yup.string()
    .nullable()
    .notRequired()
    .matches(/^[A-Za-z\s]+$/, {
      message: "Middle name must contain only letters",
      excludeEmptyString: true,
    }),

  lastName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Last name must contain only letters")
    .required("Last Name is required"),

  companies: Yup.string().required("Company is required"),

  officialEmail: Yup.string()
    .required("Official email is required")
    .email("Enter a valid email"),

  createLogin: Yup.boolean(),

  password: Yup.string().when("createLogin", {
    is: true,
    then: () => passwordRule,
  }),

  confirmPassword: Yup.string().when("createLogin", {
    is: true,
    then: (schema) =>
      schema
        .required("Confirm password is required")
        .oneOf([Yup.ref("password")], "Passwords must match"),
  }),

  status: Yup.boolean().required("Status is required"),
  role: Yup.string().required("Role is required"),
});

// contactdetails
export const contactDetailsSchema = Yup.object().shape({
  street1: Yup.string().required("Street 1 is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State/Province is required"),
  zipCode: Yup.string()
    .required("Zip/Postal Code is required")
    .matches(/^\d{5,6}$/, "Enter a valid ZIP/Postal code"),
  country: Yup.string().required("Country is required"),

  homePhone: Yup.string()
    .required("Home number is required")
    .matches(/^\d{10}$/, "Enter valid 10-digit number"),
  mobilePhone: Yup.string()
    .required("Mobile number is required")
    .matches(/^\d{10}$/, "Enter valid 10-digit number"),
  workPhone: Yup.string()
    .required("Work number is required")
    .matches(/^\d{10}$/, "Enter valid 10-digit number"),

  workEmail: Yup.string()
    .required("Work email is required")
    .email("Enter a valid email"),
  otherEmail: Yup.string()
    .required("Other email is required")
    .email("Enter a valid email"),
});

//personal details from in Add employee

export const personalDetailsValidationSchema = Yup.object({
  profileImage: Yup.mixed()
    .when("existingProfileImage", {
      is: (val) => !val, // If no existing image
      then: (schema) => schema.required("Profile image is required"),
      otherwise: (schema) => schema.notRequired(),
    })
    .test("fileType", "Only image files are allowed", (value) => {
      if (!value || typeof value === "string") return true; // Allow existing URL
      return value.type.startsWith("image/"); // Accept all image types
    })
    .test("fileSize", "File too large (max 2MB)", (value) => {
      if (!value || typeof value === "string") return true;
      return value.size <= MAX_FILE_SIZE;
    }),
  employeeId: Yup.string().required("Employee ID is required"),
  firstName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "First name must contain only letters")
    .required("First Name is required"),

  middleName: Yup.string()
    .nullable()
    .notRequired()
    .matches(/^[A-Za-z\s]+$/, {
      message: "Middle name must contain only letters",
      excludeEmptyString: true,
    }),

  lastName: Yup.string()
    .matches(/^[A-Za-z\s]+$/, "Last name must contain only letters")
    .required("Last Name is required"),

  dateOfBirth: Yup.date()
    .required("Date of Birth is required")
    .max(
      new Date(new Date().setFullYear(new Date().getFullYear() - 18)),
      "You must be at least 18 years old"
    ),
  gender: Yup.string().required("Gender is required"),
  age: Yup.string().required("Age is required"),
  primaryAddress: Yup.string().required("Primary Address is required"),
  permanentAddress: Yup.string().required("Permanent Address is required"),
  nationality: Yup.string().required("Nationality is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  place: Yup.string().required("Place is required"),
  personalEmail: Yup.string()
    .email("Invalid email")
    .required("Personal Email is required")
    .test(
      "not-same-as-official",
      "Personal Email and Official Email cannot be the same",
      function (value) {
        return value !== this.parent.officialEmail;
      }
    ),

  officialEmail: Yup.string()
    .email("Invalid email")
    .required("Official Email is required")
    .test(
      "not-same-as-personal",
      "Official Email and Personal Email cannot be the same",
      function (value) {
        return value !== this.parent.personalEmail;
      }
    ),
  primaryContactNo: Yup.string()
    .matches(/^[0-9]{10}$/, "Must be exactly 10 digits")
    .required("Primary Contact is required"),

  secondaryContactNo: Yup.string()
    .matches(/^[0-9]{10}$/, "Must be exactly 10 digits")
    .required("Secondary Contact is required"),

  emergencyContactNo: Yup.string()
    .matches(/^[0-9]{10}$/, "Must be exactly 10 digits")
    .required("Emergency Contact is required")
    .test(
      "not-same-as-primary",
      "Emergency contact must be different from primary contact",
      function (value) {
        return value !== this.parent.primaryContactNo;
      }
    )
    .test(
      "not-same-as-secondary",
      "Emergency contact must be different from secondary contact",
      function (value) {
        return value !== this.parent.secondaryContactNo;
      }
    ),
  qualification: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one qualification")
    .required("Qualification is required"),
  dateOfJoining: Yup.date().required("Date of Joining is required"),
  previousExperience: Yup.number()
    .typeError("Experience must be a number")
    .required("Experience is required")
    .min(0, "Experience cannot be negative"),
  expertise: Yup.array()
    .of(Yup.string())
    .min(1, "Please select at least one expertise")
    .required("Technical Expertise is required"),
});

export const idDocumentsSchema = Yup.object().shape({
  // Passport
  hasPassport: Yup.boolean()
    .required("Please select an option")
    .oneOf([true, false], "Please select an option"),

  passportNumber: Yup.string().when("hasPassport", {
    is: true,
    then: () =>
      Yup.string()
        .required("Passport number is required")
        .matches(
          /^[A-Z][0-9]{7}$/,
          "Invalid passport number format (e.g. A1234567)"
        ),
    otherwise: () => Yup.string().notRequired(),
  }),

  passportCopy: Yup.mixed().when(["hasPassport", "existingPassportCopy"], {
    is: (hasPassport, existingPassportCopy) =>
      hasPassport && !existingPassportCopy,
    then: (schema) =>
      schema
        .required("Passport file is required")
        .test(
          "fileType",
          "Only PDF, JPG, JPEG, PNG, and GIF files are supported",
          (value) => (value ? ALLOWED_FILE_TYPES.includes(value.type) : true)
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Aadhaar
  aadhaarNumber: Yup.string()
    .required("Aadhar number is required")
    .matches(
      /^\d{4}\s\d{4}\s\d{4}$/,
      "Invalid Aadhar format. Use: 1234 5678 9012"
    ),

  aadhaarCopy: Yup.mixed().when("existingAadhaarCopy", {
    is: (existing) => !existing,
    then: (schema) =>
      schema
        .required("Aadhar file is required")
        .test(
          "fileType",
          "Only PDF, JPG, JPEG, PNG, and GIF files are supported",
          (value) => (value ? ALLOWED_FILE_TYPES.includes(value.type) : true)
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  // PAN
  panNumber: Yup.string()
    .required("PAN number is required")
    .matches(
      /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
      "Invalid PAN number. Use: ABCDE1234F"
    ),

  panCopy: Yup.mixed().when("existingPanCopy", {
    is: (existing) => !existing,
    then: (schema) =>
      schema
        .required("PAN file is required")
        .test(
          "fileType",
          "Only PDF, JPG, JPEG, PNG, and GIF files are supported",
          (value) => (value ? ALLOWED_FILE_TYPES.includes(value.type) : true)
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  // Driving License
  hasDrivingLicense: Yup.boolean()
    .required("Please select an option")
    .oneOf([true, false], "Please select an option"),

  drivingLicenseNumber: Yup.string().when("hasDrivingLicense", {
    is: true,
    then: (schema) =>
      schema
        .required("Driving license number is required")
        .matches(
          /^[A-Z]{2}[0-9]{2} [0-9]{11}$/,
          "Invalid format. Use: MH14 20110012345"
        ),
    otherwise: (schema) => schema.notRequired(),
  }),

  drivingLicenseCopy: Yup.mixed().when(
    ["hasDrivingLicense", "existingDrivingLicenseCopy"],
    {
      is: (hasDrivingLicense, existingDrivingLicenseCopy) =>
        hasDrivingLicense && !existingDrivingLicenseCopy,
      then: (schema) =>
        schema
          .required("Driving license file is required")
          .test(
            "fileType",
            "Only PDF, JPG, JPEG, PNG, and GIF files are supported",
            (value) => (value ? ALLOWED_FILE_TYPES.includes(value.type) : true)
          ),
      otherwise: (schema) => schema.notRequired(),
    }
  ),

  // Certificates
  certificates: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Certificate name is required"),
      certificateCopies: Yup.mixed().when("existingCertificateCopies", {
        is: (existing) => !existing,
        then: (schema) =>
          schema
            .required("Certificate file is required")
            .test(
              "fileType",
              "Only PDF, JPG, JPEG, PNG, and GIF files are supported",
              (value) =>
                value ? ALLOWED_FILE_TYPES.includes(value.type) : true
            ),
        otherwise: (schema) => schema.notRequired(),
      }),
    })
  ),
});

export const healthInfoSchema = Yup.object().shape({
  bloodGroup: Yup.string().required("Blood Group is required"),
  heightInCm: Yup.number()
    .typeError("Height must be a number")
    .required("Height is required")
    .min(0, "Height cannot be negative"),

  weightInKg: Yup.number()
    .typeError("Weight must be a number")
    .required("Weight is required")
    .min(0, "Weight cannot be negative"),

  hasHealthIssue: Yup.string().required(
    "Please select if you have health issues"
  ),
  takesMedication: Yup.string().required(
    "Please select if you are taking medications"
  ),
  isAllergic: Yup.string().required("Please select if you have allergies"),

  healthIssueDetails: Yup.string().when("hasHealthIssue", {
    is: "true",
    then: (schema) => schema.required("Health issue details are required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  medicationDetails: Yup.string().when("takesMedication", {
    is: "true",
    then: (schema) => schema.required("Medication details are required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  allergyDetails: Yup.string().when("isAllergic", {
    is: "true",
    then: (schema) => schema.required("Allergy details are required"),
    otherwise: (schema) => schema.notRequired(),
  }),
});
export const dependentsSchema = Yup.object().shape({
fatherContactNumber: Yup.string()
    .required("Father Contact is required")
    .matches(/^[0-9]{10}$/, "Must be exactly 10 digits")
    .test(
      "not-same-as-mother",
      "Father and Mother Contact cannot be the same",
      function (value) {
        return value !== this.parent.motherContactNumber;
      }
    )
    .test(
      "not-same-as-spouse",
      "Father and Spouse Contact cannot be the same",
      function (value) {
        return value !== this.parent.spouseContactNumber;
      }
    ),
motherContactNumber: Yup.string()
    .required("Mother Contact is required")
    .matches(/^[0-9]{10}$/, "Must be exactly 10 digits")
    .test(
      "not-same-as-father",
      "Mother and Father Contact cannot be the same",
      function (value) {
        return value !== this.parent.fatherContactNumber;
      }
    )
    .test(
      "not-same-as-spouse",
      "Mother and Spouse Contact cannot be the same",
      function (value) {
        return value !== this.parent.spouseContactNumber;
      }
    ),

  fatherName: Yup.string()
    .required("Father Name is required")
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),

  fatherOccupation: Yup.string()
    .required("Father Occupation is required")
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),

  motherName: Yup.string()
    .required("Mother Name is required")
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),

  motherOccupation: Yup.string()
    .required("Mother Occupation is required")
    .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),

  isMarried: Yup.boolean().required("Marital status is required"),

  spouseName: Yup.string().when("isMarried", {
    is: true,
    then: () =>
      Yup.string()
        .required("Spouse Name is required")
        .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),
    otherwise: () => Yup.string(),
  }),

  spouseOccupation: Yup.string().when("isMarried", {
    is: true,
    then: () =>
      Yup.string()
        .required("Spouse Occupation is required")
        .matches(/^[A-Za-z\s]+$/, "Only letters are allowed"),
    otherwise: () => Yup.string(),
  }),

  spouseContactNumber: Yup.string().when("isMarried", {
    is: true,
    then: () =>
      Yup.string()
        .required("Spouse Contact is required")
        .matches(/^\d{10}$/, "Must be a 10-digit number")
        .test(
          "not-same-as-father",
          "Spouse and Father Contact cannot be the same",
          function (value) {
            return value !== this.parent.fatherContactNumber;
          }
        )
        .test(
          "not-same-as-mother",
          "Spouse and Mother Contact cannot be the same",
          function (value) {
            return value !== this.parent.motherContactNumber;
          }
        ),
    otherwise: () => Yup.string(),
  }),


  spouseQualification: Yup.string().when("isMarried", {
    is: true,
    then: () => Yup.string().required("Spouse Qualification is required"),
    otherwise: () => Yup.string(),
  }),

  hasKids: Yup.boolean().when("isMarried", {
    is: true,
    then: (schema) => schema.required("Please specify if you have kids"),
    otherwise: (schema) => schema.notRequired(),
  }),

  numberOfKids: Yup.string().when(["isMarried", "hasKids"], {
    is: (isMarried, hasKids) => isMarried === true && hasKids === true,
    then: () => Yup.string().required("Number of kids is required"),
    otherwise: () => Yup.string().nullable(),
  }),

  kidsAges: Yup.string().when(["isMarried", "hasKids"], {
    is: (isMarried, hasKids) => isMarried === true && hasKids === true,
    then: () => Yup.string().required("Kids age is required"),
    otherwise: () => Yup.string().nullable(),
  }),

  kidsActivities: Yup.string().when(["isMarried", "hasKids"], {
    is: (isMarried, hasKids) => isMarried === true && hasKids === true,
    then: () => Yup.string().required("Kids status is required"),
    otherwise: () => Yup.string().nullable(),
  }),
  
});


const timeField = (label, max) =>
  Yup.number()
    .typeError(`${label} must be a number`)
    .required(`${label} is required`)
    .min(0, `${label} must be >= 0`)
    .max(max, `${label} must be <= ${max}`);

export const EmployeeShiftModalSchema = Yup.object().shape({
  shiftName: Yup.string().required("Please enter a shift name"),
  startPeriod: Yup.string().required("Select AM or PM for start time"),
  endPeriod: Yup.string().required("Select AM or PM for end time"),
  breakDuration: Yup.string().required("Enter break duration"),
  workingHours: Yup.string().required("Enter working hours"),
  startHour: timeField("Start Hour", 12),
  startMinute: timeField("Start Minute", 59),
  endHour: timeField("End Hour", 12),
  endMinute: timeField("End Minute", 59),
});

export const EmployeePayrollSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  entryType: Yup.string().required("Entry Type is required"),
  valueType: Yup.string().required("Value Type is required"),
});

export const AddEditModalSchema = Yup.object().shape({
  name: Yup.string().required("This field is required"),
});

// employee id pattern
export const employeeIdPatternSchema = Yup.object().shape({
  companyId: Yup.string().required("Company Name is required"),
  prefix: Yup.string()
    .required("Prefix is required")
    .matches(/^[A-Z]+$/, "Prefix must be uppercase letters only"),

  nextSequence: Yup.number()
    .typeError("Next Sequence must be a number")
    .required("Next Sequence is required")
    .min(1, "Next Sequence must be at least 1"),
});

// HR Policy modal
export const HRpolicyModalSchema = Yup.object().shape({
  title: Yup.string().required("This field is required"),
  file: Yup.mixed().required("This field is required"),
});

export const postJobOpeningSchema = Yup.object().shape({
  jobTitle: Yup.string().required("Job Title is required"),
  vacancyCount: Yup.number()
    .required("Vacancy Count is required")
    .typeError("Vacancy Count must be a number")
    .min(1, "At least one vacancy is required"),
  jobType: Yup.string().required("Job Type is required"),
  department: Yup.string().required("Department is required"),
  designation: Yup.string().required("Designation is required"),
  hiringManager: Yup.string().required("Hiring Manager is required"),
  recruiterAssigned: Yup.string().required("Recruiter is required"),
  applicationStartDate: Yup.date()
    .required("Application Start Date is required")
    .typeError("Start Date must be a valid date")
    .min(today, "Start Date cannot be in the past"),
  applicationEndDate: Yup.date()
    .required("Application End Date is required")
    .typeError("End Date must be a valid date")
    .min(Yup.ref("applicationStartDate"), "End Date must be after Start Date"),
  jobDescription: pdfOnlyFileRule,
  url: Yup.string().url("Must be a valid URL").required("URL is required"),
});

// addLeaveModal
export const AddLeaveModalSchema = Yup.object().shape({
  name: Yup.string().required("Leave name is required"),
  gender: Yup.string().required("Please select gender eligibility"),
});

export const assignedLeaveValidationSchema = Yup.object().shape({
  leaves: Yup.array()
    .of(
      Yup.object().shape({
        employeeCategory: Yup.string()
          .required("Employee category is required"),
        leaveType: Yup.string()
          .required("Leave type is required"),
        leaveCount: Yup.number()
          .typeError("Leave count must be a number")
          .required("Leave count is required")
          .min(0, "Leave count cannot be negative"),
        leavePeriod: Yup.number()
          .typeError("Leave period must be a number")
          .required("Leave period is required")
          .min(1, "Leave period must be at least 1 day"),
        leavePlanType: Yup.string()
          .required("Leave plan type is required"),
        carryForward: Yup.boolean()
          .required("Carry forward selection is required"),
        maxCount: Yup.number()
          .nullable()
          .when("carryForward", {
            is: true,
            then: (schema) =>
              schema
                .typeError("Max count must be a number")
                .required("Max count is required when carry forward is enabled")
                .min(0, "Max count cannot be negative"),
            otherwise: (schema) => schema.notRequired().nullable(),
          }),
      })
    )
    .min(1, "At least one leave entry is required"),
});

export const editAssignedLeaveSchema = Yup.object().shape({
  leaveType: Yup.string().required("Leave type is required"),
  leaveCount: Yup.number()
    .typeError("Leave count must be a number")
    .required("Leave count is required")
    .min(0, "Leave count cannot be negative"),
  duration: Yup.number()
    .typeError("Duration must be a number")
    .required("Duration is required")
    .min(1, "Minimum 1 day"),
  maxCount: Yup.string().required("Maximum count is required"),
  carryForward: Yup.string().required("Please select carry forward"),
  durationType: Yup.string().required("Duration type is required"),
});
//job &schedule

export const jobScheduleSchema = Yup.object().shape({
  employeeCategory: Yup.string().required("Please select an employee category"),

  designation: Yup.string().required("Please select a designation"),
  department: Yup.string().required("Please select a department"),

  // employeeGrade: Yup.string().required("Please select an employee grade"),

  shift: Yup.string().required("Please select a shift"),

});

//Salary
export const salarySchema = (calcType) =>
  Yup.object().shape({
    [calcType === "BASIC" ? "base" : "base"]: rupeeValidation.required(
      `${calcType === "BASIC" ? "Base" : "Gross"} salary is required`
    ),
    gross: rupeeValidation.nullable(),
    basic: rupeeValidation.nullable(),
    netSalary: rupeeValidation.nullable(),
  });

  
export const backgroundVerificationSchema = Yup.object().shape({
  externalVerification: Yup.string().required("Please select an option"),

  agencyName: Yup.string().when("externalVerification", {
    is: "Yes",
    then: (schema) => schema.required("Agency Name is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  contactPerson: Yup.string().when("externalVerification", {
    is: "Yes",
    then: (schema) => schema.required("Contact Person is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  agencyContact: Yup.string()
    .matches(/^\d{10}$/, "Enter a valid 10-digit number")
    .when("externalVerification", {
      is: "Yes",
      then: (schema) => schema.required("Contact Number is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  verificationReport: Yup.mixed()
    .required("Verification report is required")
    .test(
      "fileType",
      "Only PDF, JPG, JPEG, PNG, and GIF files are supported",
      (value) => (value ? ALLOWED_FILE_TYPES.includes(value.type) : true)
    ),

  highestQualification: Yup.string().required(
    "Highest Qualification is required"
  ),

  universityName: Yup.string().required("University Name is required"),

  yearOfPassing: Yup.number()
    .typeError("Must be a number")
    .min(1900, "Invalid year")
    .max(new Date().getFullYear(), "Future year not allowed")
    .required("Year of Passing is required"),

  degreeCertificate: Yup.mixed()
    .required("Degree certificate is required")
    .test(
      "fileType",
      "Only PDF, JPG, JPEG, PNG, and GIF files are supported",
      (value) => (value ? ALLOWED_FILE_TYPES.includes(value.type) : true)
    ),

  previousCompany: Yup.string().required("Previous Company Name is required"),

  relievingLetter: Yup.mixed()
    .required("Relieving letter is required")
    .test(
      "fileType",
      "Only PDF, JPG, JPEG, PNG, and GIF files are supported",
      (value) => (value ? ALLOWED_FILE_TYPES.includes(value.type) : true)
    ),

  criminalRecord: Yup.string().required("Please select an option"),

  criminalDetails: Yup.string().when("criminalRecord", {
    is: "Yes",
    then: (schema) => schema.required("Please provide details"),
    otherwise: (schema) => schema.notRequired(),
  }),
});

///Add WorkReport

export const workReportSchema = Yup.object().shape({
  date: Yup.date()
    .required("Date is required")
    .typeError("Please select a valid date"),
  workType: Yup.string()
    .oneOf(["Full Day", "Half Day"], "Invalid work type")
    .required("Work type is required"),
  login: Yup.string().required("Login time is required"),
  logout: Yup.string().required("Logout time is required"),
  entries: Yup.array()
    .of(
      Yup.object().shape({
        project: Yup.string().required("Project is required"),
        task: Yup.string().required("Task is required"),
        subtasks: Yup.array()
          .of(Yup.string())
          .min(1, "At least one subtask must be selected")
          .required("Subtasks are required"),
        hours: Yup.number()
          .required("Work hours are required")
          .min(0.1, "Must be more than 0")
          .max(24, "Cannot exceed 24"),
        details: Yup.string().when("task", {
          is: (val) => val === "Development" || val === "Debugging",
          then: (schema) => schema.required("Details are required"),
        }),
        status: Yup.string().required("Status is required"),
        progress: Yup.number()
          .transform((value, originalValue) =>
            String(originalValue).trim() === "" ? undefined : value
          )
          .when("status", {
            is: "Pending",
            then: (schema) =>
              schema
                .required("Progress is required when status is pending")
                .min(0, "Minimum 0%")
                .max(100, "Maximum 100%"),
            otherwise: (schema) => schema.notRequired(),
          }),
      })
    )
    .min(1, "At least one entry is required"),
});

export const kpiAssignedValueSchema = Yup.object().shape({
  calls: Yup.number().required("Required").min(0, "Must be 0 or more"),
  dealsClosed: Yup.number().required("Required").min(0, "Must be 0 or more"),
  meetings: Yup.number().required("Required").min(0, "Must be 0 or more"),
  leadFollowUp: Yup.number().required("Required").min(0, "Must be 0 or more"),
  bugFixes: Yup.number().required("Required").min(0, "Must be 0 or more"),
  contentCreated: Yup.number().required("Required").min(0, "Must be 0 or more"),
  customerTickets: Yup.number()
    .required("Required")
    .min(0, "Must be 0 or more"),
  codeCommits: Yup.number().required("Required").min(0, "Must be 0 or more"),
});

// kpiempassesmentEditModal

export const kpiEmpAssesmentEditSchema = Yup.object().shape({
  callsMonthly: Yup.number()
    .typeError("Calls (Monthly) must be a number")
    .required("Calls (Monthly) is required"),
  dealsClosedYearly: Yup.number()
    .typeError("Deals Closed (Yearly) must be a number")
    .required("Deals Closed (Yearly) is required"),
  meetingsHeldMonthly: Yup.number()
    .typeError("Meetings Held (Monthly) must be a number")
    .required("Meetings Held (Monthly) is required"),
  newLeadsGeneratedYearly: Yup.number()
    .typeError("New Leads Generated (Yearly) must be a number")
    .required("New Leads Generated (Yearly) is required"),
  dealsClosedYearlyPercentage: Yup.number()
    .typeError("Deals Closed (Yearly) Percentage must be a number")
    .required("Deals Closed (Yearly) Percentage is required"),
  followUpsDoneYearly: Yup.number()
    .typeError("Follow-ups Done (Yearly) must be a number")
    .required("Follow-ups Done (Yearly) is required"),
});

// kpiAddEditTemplateModal
export const kpiAddEditTemplateModalSchema = Yup.object().shape({
  department: Yup.string().required("Department is required"),
  designation: Yup.string().required("Designation is required"),
  kpiParam: Yup.string().required("KPI Parameter is required"),
  targetType: Yup.string().required("Target Type is required"),
  frequency: Yup.string().required("Frequency is required"),
});

//Add Form Title
export const formTitleSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required("Form title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
});

//AddEdit Company Modal

export const AddEditCompanySchema = Yup.object().shape({
  companyName: Yup.string().required("Company name is required"),

  address: Yup.string().required("Address is required"),

  logo: Yup.mixed().when("existingLogo", {
    is: (val) => !val,
    then: (schema) =>
      schema
        .required("Logo is required")
        .test("fileFormat", "Unsupported file format", (file) => {
          if (!file || typeof file === "string") return true;
          return SUPPORTED_IMAGE_FORMATS.includes(file.type);
        })
        .test("fileSize", "File too large (Max 2MB)", (file) => {
          if (!file || typeof file === "string") return true;
          return file.size <= MAX_FILE_SIZE;
        }),
    otherwise: (schema) =>
      schema
        .notRequired()
        .test("fileFormat", "Unsupported file format", (file) => {
          if (!file || typeof file === "string") return true;
          return SUPPORTED_IMAGE_FORMATS.includes(file.type);
        })
        .test("fileSize", "File too large (Max 2MB)", (file) => {
          if (!file || typeof file === "string") return true;
          return file.size <= MAX_FILE_SIZE;
        }),
  }),

  header: Yup.mixed().when("existingHeader", {
    is: (val) => !val,
    then: (schema) =>
      schema
        .required("Header is required")
        .test("fileFormat", "Unsupported file format", (file) => {
          if (!file || typeof file === "string") return true;
          return SUPPORTED_IMAGE_FORMATS.includes(file.type);
        })
        .test("fileSize", "File too large (Max 2MB)", (file) => {
          if (!file || typeof file === "string") return true;
          return file.size <= MAX_FILE_SIZE;
        }),
    otherwise: (schema) =>
      schema
        .notRequired()
        .test("fileFormat", "Unsupported file format", (file) => {
          if (!file || typeof file === "string") return true;
          return SUPPORTED_IMAGE_FORMATS.includes(file.type);
        })
        .test("fileSize", "File too large (Max 2MB)", (file) => {
          if (!file || typeof file === "string") return true;
          return file.size <= MAX_FILE_SIZE;
        }),
  }),

  footer: Yup.mixed().when("existingFooter", {
    is: (val) => !val,
    then: (schema) =>
      schema
        .required("Footer is required")
        .test("fileFormat", "Unsupported file format", (file) => {
          if (!file || typeof file === "string") return true;
          return SUPPORTED_IMAGE_FORMATS.includes(file.type);
        })
        .test("fileSize", "File too large (Max 2MB)", (file) => {
          if (!file || typeof file === "string") return true;
          return file.size <= MAX_FILE_SIZE;
        }),
    otherwise: (schema) =>
      schema
        .notRequired()
        .test("fileFormat", "Unsupported file format", (file) => {
          if (!file || typeof file === "string") return true;
          return SUPPORTED_IMAGE_FORMATS.includes(file.type);
        })
        .test("fileSize", "File too large (Max 2MB)", (file) => {
          if (!file || typeof file === "string") return true;
          return file.size <= MAX_FILE_SIZE;
        }),
  }),
   probationPeriod: Yup.number()
    .required("Probation period is required")
    .typeError("Probation period must be a number")
});
// change password

export const ChangePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current password is required")
    .min(8, "Current password must be at least 8 characters"),
  newPassword: passwordRule,
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});

// Schedule Interview

export const scheduleInterviewSchema = Yup.object().shape({
  totalRound: Yup.string().required("Total round is required"),
  interviewName: Yup.string().required("Interview name is required"),
  interviewerName: Yup.string().required("Interviewer name is required"),
  interviewMode: Yup.string().required("Interview mode is required"),
  interviewDate: Yup.date().nullable().required("Interview date is required"),
  startHour: Yup.string()
    .required("Start hour is required")
    .matches(/^(0[1-9]|1[0-2])$/, "Hour must be between 01-12"),
  startMinute: Yup.string()
    .required("Start minute is required")
    .matches(/^[0-5][0-9]$/, "Minute must be between 00-59"),
  startMeridian: Yup.string().required("Start AM/PM is required"),
  endHour: Yup.string()
    .required("End hour is required")
    .matches(/^(0[1-9]|1[0-2])$/, "Hour must be between 01-12"),
  endMinute: Yup.string()
    .required("End minute is required")
    .matches(/^[0-5][0-9]$/, "Minute must be between 00-59"),
  endMeridian: Yup.string().required("End AM/PM is required"),
});
// InductionAddNewCardModal
export const inductionAddCardSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),
});

// InductionCardEditModal

export const inductionCardSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must be under 100 characters"),

  file: Yup.mixed()
    .required("File upload is required")
    .test("fileType", "Unsupported file type", (file) => {
      if (!file) return false;
      const supportedTypes = [
        "video/mp4",
        "application/pdf",
        "image/jpeg",
        "image/png",
      ];
      return supportedTypes.includes(file.type);
    })
    .test("fileSize", "File too large (max 10MB)", (file) => {
      if (!file) return false;
      return file.size <= 10 * 1024 * 1024;
    }),

  audience: Yup.string().required("Target audience is required"),

  employeeDesignation: Yup.array()
    .min(1, "Select at least one designation")
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        label: Yup.string().required(),
      })
    ),

  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters"),

  expectedCompletion: Yup.string().required("Expected completion is required"),
});

// InductionNewAddDetails
export const inductionNewCardSchema = Yup.object().shape({
  forms: Yup.array().of(
    Yup.object().shape({
      title: Yup.string()
        .required("Title is required")
        .min(3, "Minimum 3 characters"),
      file: Yup.mixed()
        .required("File is required")
        .test("fileSize", "File too large (Max 2MB)", (file) =>
          file ? file.size <= 2 * 1024 * 1024 : false
        )
        .test("fileFormat", "Unsupported format", (file) =>
          file
            ? ["image/jpeg", "image/png", "application/pdf"].includes(file.type)
            : false
        ),
      audience: Yup.string().required("Audience is required"),
      employeeDesignation: Yup.string().required("Designation is required"),
      description: Yup.string()
        .required("Description is required")
        .min(10, "Minimum 10 characters"),
      expectedCompletion: Yup.string().required(
        "Expected Completion is required"
      ),
    })
  ),
  selectedForms: Yup.array()
    .min(1, "Select at least one form")
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        label: Yup.string().required(),
      })
    ),
});

//AddEdit Department modal
export const departmentSchema = Yup.object().shape({
  companyId: Yup.string().required("Please select a company"),
  name: Yup.string()
    .trim()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name cannot be more than 50 characters"),
});

//Reject Field Modal
export const RejectedFieldsValidation = (fields) =>
  Yup.object().shape(
    fields.reduce((acc, field) => {
      acc[field] = Yup.string()
        .trim()
        .required(`Reason for rejecting "${field}" is required`);
      return acc;
    }, {})
  );

//update monthly off days
export const UpdateOffDaysSchema = Yup.object().shape({
  type: Yup.string().required("Off Day Type is required"),

  date: Yup.date().required("Date is required").typeError("Invalid date"),

  duration: Yup.string().required("Duration is required"),

  fromTime: Yup.string().required("From Time is required"),

  toTime: Yup.string()
    .required("To Time is required")
    .test("is-after", "To Time must be after From Time", function (value) {
      const { fromTime } = this.parent;
      if (!fromTime || !value) return true; // skip check if either is empty
      return value > fromTime;
    }),

  comments: Yup.string().max(200, "Comments cannot exceed 200 characters"),
});


//ApplyLeave
export const applyLeaveSchema = Yup.object().shape({
  leaveType: Yup.string().required("Leave type is required"),
  fromDate: Yup.date()
    .required("From date is required")
    .typeError("Invalid date"),
  toDate: Yup.date()
    .required("To date is required")
    .typeError("Invalid date")
    .min(Yup.ref("fromDate"), "To Date cannot be before From Date"),
  leaveDuration: Yup.string().required("Leave duration is required"),
  reason: Yup.string()
    .required("Reason is required")
    .min(5, "Reason must be at least 5 characters")
    .max(500, "Reason cannot exceed 500 characters"),

    document: Yup.mixed()
    .nullable()
    .test(
      "fileFormat",
      "Only PDF and image files are allowed",
      (value) => {
        if (!value) return true; // not required
        if (!value.type) return false; // unknown = reject
        return ALLOWED_FILE_TYPES.includes(value.type);
      }
    ),
});


// Reject schema
export const rejectSchema = Yup.object().shape({
  reason: Yup.string()
    .trim()
    .required("Rejection reason is required"),
});

// Weekend schema (only Continuous Days allowed)
export const weekendSchema = Yup.object().shape({
  option: Yup.string()
    .required("Please select an option to Continue"),
});



// Reimbursement schema 
export const reimbursementSchema = Yup.object().shape({
  category: Yup.string()
    .required("Please select a reimbursement category")
    .oneOf(["Travel", "Food", "Miscellaneous"], "Invalid category"),

  travelEntries: Yup.array().when("category", {
    is: "Travel",
    then: () =>
      Yup.array()
        .of(
          Yup.object().shape({
            mode: Yup.string().required("Mode of Travel is required"),
            km: Yup.number()
              .typeError("Kilometers must be a number")
              .positive("Kilometers must be greater than zero")
              .required("Kilometers is required"),
            amount: Yup.number()
              .typeError("Amount must be a number")
              .positive("Amount must be greater than zero")
              .required("Amount is required"),
          })
        )
        .min(1, "At least one travel entry is required"),
    otherwise: () => Yup.array().notRequired(),
  }),

  food: Yup.object().when("category", {
    is: "Food",
    then: () =>
      Yup.object().shape({
        days: Yup.number()
          .typeError("Days must be a number")
          .positive("Days must be greater than zero")
          .required("Days is required"),
        amount: Yup.number()
          .typeError("Amount must be a number")
          .positive("Amount must be greater than zero")
          .required("Amount is required"),
      }),
    otherwise: () => Yup.object().notRequired(),
  }),
});

// Reimbursement Apply schema


export const reimbursementApplySchema = Yup.object().shape({
  type: Yup.string()
    .required("Please select a reimbursement type")
    .oneOf(["Travel", "Food", "Miscellaneous"], "Invalid type"),

  advanceAmount: Yup.number()
    .transform((v, o) => (o === "" ? undefined : v))
    .min(0, "Must be greater than or equal to 0")
    .required("Advance amount is required"),
    
  totalAmount: Yup.number()
    .transform((v, o) => (o === "" ? undefined : v))
    .min(0, "Must be greater than or equal to 0")
    .required("Total amount is required"),

  // Travel
  modeOfTravel: Yup.string().when("type", {
    is: "Travel",
    then: (schema) => schema.required("Mode of travel is required"),
  }),
  totalKm: Yup.number()
    .transform((v, o) => (o === "" ? undefined : v))
    .when("type", {
      is: "Travel",
      then: (schema) =>
        schema.min(1, "Total KM must be at least 1").required("Total KM is required"),
    }),
  fromLocation: Yup.string().when("type", {
    is: "Travel",
    then: (schema) => schema.required("From location is required"),
  }),
  toLocation: Yup.string().when("type", {
    is: "Travel",
    then: (schema) => schema.required("To location is required"),
  }),
  fromDate: Yup.date().when("type", {
    is: "Travel",
    then: (schema) => schema.required("From Date is required"),
  }),
  toDate: Yup.date().when("type", {
    is: "Travel",
    then: (schema) => schema.required("To Date is required"),
  }),

  // Food
  days: Yup.number()
    .transform((v, o) => (o === "" ? undefined : v))
    .when("type", {
      is: "Food",
      then: (schema) =>
        schema.min(1, "Days must be at least 1").required("Days are required"),
    }),
    foodFromDate: Yup.date().when("type", {
    is: "Food",
    then: (schema) => schema.required("From Date is required"),
  }),
  foodToDate: Yup.date().when("type", {
    is: "Food",
    then: (schema) => schema.required("To Date is required"),
  }),

  // Miscellaneous
  miscDate: Yup.date().when("type", {
    is: "Miscellaneous",
    then: (schema) => schema.required("Date is required"),
  }),

  reason: Yup.string()
    .test(
      "min-letters",
      "Reason must be at least 5 letters",
      (value) => {
        if (!value) return true;
        return value.replace(/\s+/g, "").length >= 5;
      }
    ),
 fileAttachment: Yup.mixed()
    .nullable() // ✅ allow null
    .notRequired() // ✅ not mandatory
    .test(
      "fileType",
      "Only PDF and image files are allowed",
      (value) => {
        if (!value) return true; // skip if no file
        if (!(value instanceof File)) return true; // skip if not a file
        return ALLOWED_FILE_TYPES.includes(value.type); // check allowed type
      }
    ),
});

/// Payroll settings Schema  
export const payrollSchema = Yup.object().shape({
  company: Yup.string().required("Company is required"),
  calcType: Yup.string()
    .oneOf(["BASIC", "GROSS"], "Invalid calculation type")
    .required("Calculation type is required"),
  percentValue: Yup.number()
    .typeError("Percentage value must be a number")
    .required("Percentage value is required")
    .min(0, "Must be greater than or equal to 0")
    .max(100, "Must be less than or equal to 100"),
  entries: Yup.array()
    .of(
      Yup.object().shape({
        label: Yup.string().required("Name is required"),
        entryType: Yup.string()
          .oneOf(["BENEFIT", "CREDIT", "DEDUCTION"], "Invalid entry type")
          .required("Entry type is required"),
        valueType: Yup.string()
          .oneOf(["PERCENTAGE", "FIXED_AMOUNT"], "Invalid value type")
          .required("Value type is required"),
        percentage: Yup.number()
          .when("valueType", {
            is: "PERCENTAGE",
            then: (schema) =>
              schema
                .typeError("Must be a number")
                .required("Percentage is required")
                .min(0, "Must be >= 0")
                .max(100, "Must be <= 100"),
            otherwise: (schema) => schema.notRequired(),
          }),
        amount: Yup.number()
          .when("valueType", {
            is: "FIXED_AMOUNT",
            then: (schema) =>
              schema
                .typeError("Must be a number")
                .required("Amount is required")
                .min(0, "Must be >= 0"),
            otherwise: (schema) => schema.notRequired(),
          }),
      })
    )
    .min(1, "At least one entry is required"),
});

// payroll allocation modal schema
export const payrollAllocationModalSchema = Yup.object().shape({
    company: Yup.string().required("Company is required"),
  employeeCategory: Yup.array()
    .min(1, "Please select at least one employee category")
    .of(
      Yup.object().shape({
        value: Yup.string().required(),
        label: Yup.string().required(),
      })
    )
    .required("Employee category is required"),
  allocations: Yup.object().test(
    "at-least-one",
    "Please select at least one payroll allocation",
    (value) => {
      return value && Object.values(value).some((v) => v === true);
    }
  ),
});
export const employeePayrollAllocationModalSchema = Yup.object().shape({
  allocations: Yup.object().test(
    "at-least-one",
    "Please select at least one payroll allocation",
    (value) => {
      return value && Object.values(value).some((v) => v === true);
    }
  ),
});


export const appRejectionReasonSchema = Yup.object().shape({
  reason: Yup.string()
    .trim()
    .required("Rejection reason is required")
    .min(5, "Reason must be at least 5 characters")
    .max(200, "Reason must not exceed 200 characters"),
});