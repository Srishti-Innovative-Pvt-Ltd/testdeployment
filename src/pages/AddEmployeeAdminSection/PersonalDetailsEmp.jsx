import React, { useMemo, useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { personalDetailsValidationSchema } from "../../utils/ValidationSchema";
import img from "../../assets/images/profile.jpg";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import styles from "./PersonalDetailsEmp.module.css";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import { addEmployeePersonalDetails, getEmployeePersonalAndProfessionalInfo , getOnboardingRejectionReasons} from "../../services/addEmployeeService";
import { useSnackbar } from 'notistack';
import { UPLOADS_PATH_BASE_URL } from "../../config/env";
import RejectedReasonList from "../../components/RejectedReasonList/RejectedReasonList";
import { getUserRole, getVerificationStatus } from "../../utils/roleUtils";


const initialValues = {
  employeeId: "",
  firstName: "",
  middleName: "",
  lastName: "",
  dateOfBirth: "",
  gender: "",
  age: "",
  primaryAddress: "",
  permanentAddress: "",
  nationality: "",
  state: "",
  city: "",
  place: "",
  personalEmail: "",
  officialEmail: "",
  primaryContactNo: "",
  secondaryContactNo: "",
  emergencyContactNo: "",
  qualification: [],
  dateOfJoining: "",
  previousExperience: "",
  expertise: [],
  sameAsPrimary: false,
  profileImage: "",
};

const qualificationOptions = [
  { value: "High School", label: "High School" },
  { value: "Diploma", label: "Diploma" },
  { value: "Bachelor's Degree", label: "Bachelor's Degree" },
  { value: "Master's Degree", label: "Master's Degree" },
  { value: "PhD", label: "PhD" },
  { value: "B.Tech", label: "B.Tech" },
  { value: "MBA", label: "MBA" },
  // Add more qualifications as needed
];

const expertiseOptions = [
  // Programming Languages
  { value: "JavaScript", label: "JavaScript" },
  { value: "TypeScript", label: "TypeScript" },
  { value: "Python", label: "Python" },
  { value: "Java", label: "Java" },
  { value: "C", label: "C" },
  { value: "C++", label: "C++" },
  { value: "C#", label: "C#" },
  { value: "Go", label: "Go" },
  { value: "Rust", label: "Rust" },
  { value: "Ruby", label: "Ruby" },
  { value: "PHP", label: "PHP" },
  { value: "Kotlin", label: "Kotlin" },
  { value: "Swift", label: "Swift" },
  { value: "Objective-C", label: "Objective-C" },
  { value: "R", label: "R" },
  { value: "Scala", label: "Scala" },
  { value: "Perl", label: "Perl" },
  { value: "Haskell", label: "Haskell" },
  { value: "Dart", label: "Dart" },
  { value: "Elixir", label: "Elixir" },

  // Web Development
  { value: "HTML", label: "HTML" },
  { value: "CSS", label: "CSS" },
  { value: "Sass", label: "Sass" },
  { value: "React", label: "React" },
  { value: "Next.js", label: "Next.js" },
  { value: "Vue.js", label: "Vue.js" },
  { value: "Nuxt.js", label: "Nuxt.js" },
  { value: "Angular", label: "Angular" },
  { value: "Svelte", label: "Svelte" },
  { value: "jQuery", label: "jQuery" },
  { value: "Node.js", label: "Node.js" },
  { value: "Express.js", label: "Express.js" },
  { value: "NestJS", label: "NestJS" },
  { value: "Django", label: "Django" },
  { value: "Flask", label: "Flask" },
  { value: "Spring Boot", label: "Spring Boot" },
  { value: "Laravel", label: "Laravel" },
  { value: "Symfony", label: "Symfony" },
  { value: "Ruby on Rails", label: "Ruby on Rails" },

  // Microsoft / .NET Ecosystem
  { value: ".NET", label: ".NET" },
  { value: ".NET Core", label: ".NET Core" },
  { value: "ASP.NET", label: "ASP.NET" },
  { value: "ASP.NET Core", label: "ASP.NET Core" },
  { value: "ASP.NET MVC", label: "ASP.NET MVC" },
  { value: "ASP.NET Web API", label: "ASP.NET Web API" },
  { value: "Entity Framework", label: "Entity Framework" },
  { value: "Entity Framework Core", label: "Entity Framework Core" },
  { value: "Blazor", label: "Blazor" },
  { value: "WPF", label: "WPF" },
  { value: "WinForms", label: "WinForms" },
  { value: "XAML", label: "XAML" },

  // Mobile Development
  { value: "React Native", label: "React Native" },
  { value: "Flutter", label: "Flutter" },
  { value: "Ionic", label: "Ionic" },
  { value: "Xamarin", label: "Xamarin" },

  // Databases
  { value: "MySQL", label: "MySQL" },
  { value: "PostgreSQL", label: "PostgreSQL" },
  { value: "SQLite", label: "SQLite" },
  { value: "MongoDB", label: "MongoDB" },
  { value: "Redis", label: "Redis" },
  { value: "Oracle", label: "Oracle" },
  { value: "SQL Server", label: "SQL Server" },
  { value: "Cassandra", label: "Cassandra" },
  { value: "Firebase", label: "Firebase" },
  { value: "DynamoDB", label: "DynamoDB" },

  // DevOps & Cloud
  { value: "Docker", label: "Docker" },
  { value: "Kubernetes", label: "Kubernetes" },
  { value: "AWS", label: "AWS" },
  { value: "Azure", label: "Azure" },
  { value: "Google Cloud", label: "Google Cloud" },
  { value: "Terraform", label: "Terraform" },
  { value: "Jenkins", label: "Jenkins" },
  { value: "Ansible", label: "Ansible" },
  { value: "Git", label: "Git" },
  { value: "GitHub Actions", label: "GitHub Actions" },
  { value: "CI/CD", label: "CI/CD" },

  // Data Science & AI
  { value: "TensorFlow", label: "TensorFlow" },
  { value: "PyTorch", label: "PyTorch" },
  { value: "Keras", label: "Keras" },
  { value: "Pandas", label: "Pandas" },
  { value: "NumPy", label: "NumPy" },
  { value: "Matplotlib", label: "Matplotlib" },
  { value: "Scikit-learn", label: "Scikit-learn" },
  { value: "OpenCV", label: "OpenCV" },
  { value: "NLTK", label: "NLTK" },

  // Cybersecurity
  { value: "Ethical Hacking", label: "Ethical Hacking" },
  { value: "Penetration Testing", label: "Penetration Testing" },
  { value: "OWASP", label: "OWASP" },
  { value: "Metasploit", label: "Metasploit" },

  // Other
  { value: "Blockchain", label: "Blockchain" },
  { value: "Solidity", label: "Solidity" },
  { value: "Web3.js", label: "Web3.js" },
  { value: "Hardhat", label: "Hardhat" },
  { value: "Unity", label: "Unity" },
  { value: "Unreal Engine", label: "Unreal Engine" },
  { value: "MATLAB", label: "MATLAB" },
 //-- HR / Management skills
  { value: "Recruitment", label: "Recruitment" },
  { value: "Talent Acquisition", label: "Talent Acquisition" },
  { value: "Employee Relations", label: "Employee Relations" },
  { value: "Onboarding", label: "Onboarding" },
  { value: "Payroll Management", label: "Payroll Management" },
  { value: "Performance Management", label: "Performance Management" },
  { value: "Training & Development", label: "Training & Development" },
  { value: "HR Policies", label: "HR Policies" },
  { value: "Conflict Resolution", label: "Conflict Resolution" },
  { value: "Team Management", label: "Team Management" },
  { value: "Leadership", label: "Leadership" },
  { value: "Communication Skills", label: "Communication Skills" },
  { value: "Organizational Development", label: "Organizational Development" }

];


const PersonalDetailsEmp = ({ onNext, user_id }) => {
  const { enqueueSnackbar } = useSnackbar();
  const [formValues, setFormValues] = useState(initialValues);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [preview, setPreview] = useState("");
  const role = getUserRole();
  const verificationStatus = getVerificationStatus();
  const [rejectedFields, setRejectedFields] = useState([]);

  useEffect(() => {
    const fetchRejectionReasons = async () => {
      if (verificationStatus === "rejected" && role !== "admin") {
        const res = await getOnboardingRejectionReasons(user_id);
        if (res.success && res.data?.rejectionReasons) {

          const staticLabels = {
            firstName: "First Name",
            middleName: "Middle Name",
            lastName: "Last Name",
            dateOfBirth: "Date of Birth",
            gender: "Gender",
            nationality: "Nationality",
            primaryAddress: "Primary Address",
            permanentAddress: "Permanent Address",
            state: "State",
            city: "City",
            place: "Place",
            primaryContactNo: "Primary Contact Number",
            secondaryContactNo: "Secondary Contact Number",
            emergencyContactNo: "Emergency Contact Number",
            personalEmail: "Personal Email",
            officialEmail: "Official Email",
            dateOfJoining: "Date of Joining",
            previousExperience: "Previous Experience",
            profileImage: "Profile Image"
          };

          const rejectedArray = Object.entries(res.data.rejectionReasons).map(
            ([field, reason]) => {
              let label = staticLabels[field] || field;

              // Handle dynamic qualifications
              if (field.startsWith("qualifications[")) {
                const index = field.match(/\[(\d+)\]/)?.[1];
                label = `Qualification ${Number(index) + 1}`;
              }

              // Handle dynamic technical expertise
              if (field.startsWith("technicalExpertise[")) {
                const index = field.match(/\[(\d+)\]/)?.[1];
                label = `Technical Expertise ${Number(index) + 1}`;
              }

              return { fieldName: label, reason };
            }
          );
          setRejectedFields(rejectedArray);
        }
      }
    };
    fetchRejectionReasons();
  }, [user_id, role, verificationStatus]);


  const countryOptions = useMemo(() => {
    return Country.getAllCountries().map((country) => ({
      label: country.name,
      value: country.isoCode,
    }));
  }, []);

  const states = State.getStatesOfCountry(selectedCountry);
  const cities = City.getCitiesOfState(selectedCountry, selectedState);

  const calculateAge = (dobString) => {
    if (!dobString) return "";

    const dob = new Date(dobString);
    const today = new Date();

    let years = today.getFullYear() - dob.getFullYear();
    let months = today.getMonth() - dob.getMonth();

    if (today.getDate() < dob.getDate() && months === 0) {
      years--;
      months = 11;
    } else if (months < 0) {
      years--;
      months += 12;
    }

    return `${years}y ${months}m`;
  };

  useEffect(() => {
    const fetchEmployeeData = async () => {
      const res = await getEmployeePersonalAndProfessionalInfo(user_id);
      if (res.success && res.data) {
        const data = res.data;
        const personal = data.personalInfo || {};
        const contact = data.contactInfo || {};
        const professional = data.professionalInfo || {};
        const user = data.userId || {};

        const dob = personal.dateOfBirth?.value || "";
        const age = calculateAge(dob);
        const qualifications = professional?.qualifications?.map(q => q.value) || [];
        const expertise = professional?.technicalExpertise?.map(e => e.value) || [];

        // Find country code for nationality
        const nationality = personal?.nationality?.value || "";
        let countryCode = "";
        if (nationality) {
          const country = Country.getAllCountries().find(c => c.name === nationality);
          countryCode = country?.isoCode || "";
        }

        // Find state code if state exists
        const stateName = contact?.state?.value || "";
        let stateCode = "";
        if (stateName && countryCode) {
          const states = State.getStatesOfCountry(countryCode);
          const state = states.find(s => s.name === stateName);
          stateCode = state?.isoCode || "";
        }

        setFormValues({
          employeeId: data?.employeeId || "",
          firstName: personal?.firstName?.value || "",
          middleName: personal?.middleName?.value || "",
          lastName: personal?.lastName?.value || "",
          dateOfBirth: dob || "",
          gender: personal?.gender?.value || "",
          age: age || "",
          primaryAddress: contact?.primaryAddress?.value || "",
          permanentAddress: contact?.permanentAddress?.value || "",
          nationality: nationality,
          state: stateName,
          city: contact?.city?.value || "",
          place: contact?.place?.value || "",
          personalEmail: contact?.personalEmail?.value || "",
          officialEmail: professional?.officialEmail?.value || user?.email || "",
          primaryContactNo: contact?.primaryContactNo?.value || "",
          secondaryContactNo: contact?.secondaryContactNo?.value || "",
          emergencyContactNo: contact?.emergencyContactNo?.value || "",
          qualification: qualifications,
          dateOfJoining: professional?.dateOfJoining?.value || "",
          previousExperience: professional?.previousExperience?.value?.toString() || "",
          expertise: expertise,
          sameAsPrimary: personal?.sameAsPrimary || false,
          profileImage: undefined,
          existingProfileImage: data.profileImage ? true : false,
        });

        // Set country and state for dropdowns
        setSelectedCountry(countryCode);
        setSelectedState(stateCode);

        // Preview image if exists
        if (data.profileImage) {
          setPreview(data.profileImage);
        }
      } else {
        enqueueSnackbar(res.message || "Failed to fetch employee info", {
          variant: "error"
        });
      }
    };

    fetchEmployeeData();
  }, [user_id]);
  return (
    <Formik
      initialValues={formValues}
      enableReinitialize={true}
      validationSchema={personalDetailsValidationSchema}
      onSubmit={async (values, { setSubmitting }) => {
        const response = await addEmployeePersonalDetails(user_id, values);
        if (response.success) {
          enqueueSnackbar('Saved successfully!', { variant: 'success' });
          onNext();
        } else {
          enqueueSnackbar(response.message, { variant: 'error' });
        }
        setSubmitting(false);
      }}
    >

      {({ setFieldValue, values }) => {
        useEffect(() => {
          if (values.sameAsPrimary) {
            setFieldValue("permanentAddress", values.primaryAddress);
          }
        }, [values.primaryAddress, values.sameAsPrimary]);


        return (

          <Form className={styles.wrapper}>
            {rejectedFields.length > 0 && (
              <RejectedReasonList rejectedFields={rejectedFields} />
            )}
            {/* Card 1 - Personal Info */}
            <Card title="Personal Information" icon="mdi:account">
              <div className={styles.topSection}>
                {/* Profile Image Upload */}
                <div className={styles.imageUploader}>
                  <label
                    htmlFor="profileUpload"
                    className={styles.customImageContainer}
                  >
                    <img
                      src={
                        preview
                          ? (preview?.startsWith && preview?.startsWith("data:image"))
                            ? preview
                            : `${UPLOADS_PATH_BASE_URL}${preview.value}`
                          : img
                      }

                      alt="Profile"
                    />
                    <input
                      id="profileUpload"
                      type="file"
                      accept="image/*"
                      className={styles.fileInput}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = () => {
                            setPreview(reader.result);
                            // setFieldValue("profileImage", reader.result);
                          };
                          reader.readAsDataURL(file);
                          setFieldValue("profileImage", file);
                        }
                      }}
                    />

                    {!preview && <div className={styles.plusOverlay}>+</div>}
                  </label>
                  <span className={styles.uploadText}>+ Add Image<span className={styles.star}>*</span></span>
                  <ErrorMessage
                    name="profileImage"
                    component="div"
                    className="error"
                  />
                </div>

                {/* Fields beside image */}
                <div className={styles.sideFields}>
                  <div className={styles.sideRow}>
                    <div className={styles.formGroup}>
                      <label>First Name</label>
                      <Field name="firstName" className={styles.formInput} />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Middle Name</label>
                      <Field name="middleName" className={styles.formInput} />
                      <ErrorMessage
                        name="middleName"
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>

                  <div className={styles.sideRow}>
                    <div className={styles.formGroup}>
                      <label>Last Name</label>
                      <Field name="lastName" className={styles.formInput} />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="error"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Employee ID</label>
                      <Field name="employeeId" className={styles.formInput} readOnly />
                      <ErrorMessage
                        name="employeeId"
                        component="div"
                        className="error"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <hr style={{ width: "100%" }} />

              <div className={styles.detailsGrid}>
                <div className={styles.formGroup}>
                  <label>Date of Birth<span className={styles.star}>*</span></label>
                  <Field
                    type="date"
                    name="dateOfBirth"
                    className={styles.formInput}
                    max={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      const selectedDate = e.target.value;
                      setFieldValue("dateOfBirth", selectedDate);

                      if (selectedDate) {
                        const dateOfBirth = new Date(selectedDate);
                        const today = new Date();
                        let years = today.getFullYear() - dateOfBirth.getFullYear();
                        let months = today.getMonth() - dateOfBirth.getMonth();

                        if (today.getDate() < dateOfBirth.getDate() && months === 0) {
                          years--;
                          months = 11;
                        } else if (months < 0) {
                          years--;
                          months += 12;
                        }

                        const age = `${years}y ${months}m`;
                        setFieldValue("age", age);
                      } else {
                        setFieldValue("age", "");
                      }
                    }}
                  />
                  <ErrorMessage name="dateOfBirth" component="div" className="error" />
                </div>

                <div className={styles.formGroup}>
                  <label>Gender<span className={styles.star}>*</span></label>
                  <div className={styles.radioOptions}>
                    <label>
                      <Field type="radio" name="gender" value="Male" /> Male
                    </label>
                    <label>
                      <Field type="radio" name="gender" value="Female" /> Female
                    </label>
                    <label>
                      <Field type="radio" name="gender" value="Other" /> Other
                    </label>
                  </div>
                  <ErrorMessage
                    name="gender"
                    component="div"
                    className="error"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Age (in years and months)</label>
                  <Field
                    name="age"
                    className={styles.formInput}
                    placeholder="00y 0m"
                    readOnly
                    style={{ cursor: 'not-allowed' }}
                  />
                  <ErrorMessage name="age" component="div" className="error" />
                </div>

                <div className={styles.formGroup}>
                  <label>Address (Primary)<span className={styles.star}>*</span></label>
                  <Field
                    as="textarea"
                    name="primaryAddress"
                    className={styles.formInput}
                  />
                  <ErrorMessage
                    name="primaryAddress"
                    component="div"
                    className="error"
                  />
                </div>

                <div className={styles.formGroupCheckbox}>
                  <label className={styles.checkboxLabel}>
                    <Field
                      type="checkbox"
                      name="sameAsPrimary"
                      checked={values.sameAsPrimary}
                      className={styles.checkboxInput}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        setFieldValue("sameAsPrimary", isChecked);
                        if (isChecked) {
                          setFieldValue(
                            "permanentAddress",
                            values.primaryAddress
                          );
                        } else {
                          setFieldValue("permanentAddress", "");
                        }
                      }}
                    />
                    Same as primary Address?
                  </label>
                </div>

                <div className={styles.formGroup}>
                  <label>Address (Permanent)<span className={styles.star}>*</span></label>
                  <Field
                    as="textarea"
                    name="permanentAddress"
                    className={styles.formInput}
                    readOnly={values.sameAsPrimary}
                  />
                  <ErrorMessage
                    name="permanentAddress"
                    component="div"
                    className="error"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Country<span className={styles.star}>*</span></label>
                  <Select
                    options={countryOptions}
                    name="nationality"
                    className={styles.selectDropdown}
                    value={countryOptions.find(opt => opt.label === values.nationality)}
                    onChange={(selectedOption) => {
                      setSelectedCountry(selectedOption.value);
                      setFieldValue("nationality", selectedOption.label);
                      setFieldValue("state", "");
                      setFieldValue("city", "");
                    }}
                    placeholder="Select country..."
                    isSearchable
                  />
                  <ErrorMessage
                    name="nationality"
                    component="div"
                    className="error"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>State<span className={styles.star}>*</span></label>
                  <Select
                    options={states.map((state) => ({
                      label: state.name,
                      value: state.isoCode,
                    }))}
                    name="state"
                    value={states.find(s => s.name === values.state) ? {
                      label: values.state,
                      value: states.find(s => s.name === values.state)?.isoCode
                    } : null}
                    className={styles.selectDropdown}
                    isDisabled={!selectedCountry}
                    onChange={(selectedOption) => {
                      setSelectedState(selectedOption.value);
                      setFieldValue("state", selectedOption.label);
                      setFieldValue("city", "");
                    }}
                    placeholder="Select state..."
                    isSearchable
                  />
                  <ErrorMessage
                    name="state"
                    component="div"
                    className="error"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>City<span className={styles.star}>*</span></label>
                  <Select
                    options={cities.map((city) => ({
                      value: city.name,
                      label: city.name,
                    }))}
                    name="city"
                    value={values.city ? { value: values.city, label: values.city } : null}
                    isDisabled={!selectedState}
                    onChange={(selectedOption) =>
                      setFieldValue("city", selectedOption.value)
                    }
                    isSearchable
                    placeholder="Select city..."
                    className={styles.selectDropdown}
                  />
                  <ErrorMessage name="city" component="div" className="error" />
                </div>

                <div className={styles.formGroup}>
                  <label>Place<span className={styles.star}>*</span></label>
                  <Field name="place" className={styles.formInput} />
                  <ErrorMessage
                    name="place"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
            </Card>

            {/* Contact Info */}
            <Card title="Contact Information" icon="mdi:email-edit">
              <div className={styles.detailsGrid}>
                <div className={styles.formGroup}>
                  <label>Email ID (Personal)<span className={styles.star}>*</span></label>
                  <Field
                    type="email"
                    name="personalEmail"
                    className={styles.formInput}
                  />
                  <ErrorMessage
                    name="personalEmail"
                    component="div"
                    className="error"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Email ID (Official)</label>
                  <Field
                    type="email"
                    name="officialEmail"
                    className={styles.formInput}
                    disabled
                    style={{ cursor: "not-allowed" }}
                  />
                  <ErrorMessage
                    name="officialEmail"
                    component="div"
                    className="error"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Contact No (Primary)<span className={styles.star}>*</span></label>
                  <Field name="primaryContactNo" className={styles.formInput} 
                   onInput={(e) => {
                     e.target.value = e.target.value.replace(/\D/g, "");
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10); // restrict to 10 digits
                    }
                  }}/>
                  <ErrorMessage
                    name="primaryContactNo"
                    component="div"
                    className="error"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Contact No (Secondary)<span className={styles.star}>*</span></label>
                  <Field name="secondaryContactNo" className={styles.formInput} 
                   onInput={(e) => {
                     e.target.value = e.target.value.replace(/\D/g, "");
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10); // restrict to 10 digits
                    }
                  }}/>
                  <ErrorMessage
                    name="secondaryContactNo"
                    component="div"
                    className="error"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Contact No (Emergency)<span className={styles.star}>*</span></label>
                  <Field name="emergencyContactNo" className={styles.formInput} 
                   onInput={(e) => {
                     e.target.value = e.target.value.replace(/\D/g, "");
                    if (e.target.value.length > 10) {
                      e.target.value = e.target.value.slice(0, 10); // restrict to 10 digits
                    }
                  }}/>
                  <ErrorMessage
                    name="emergencyContactNo"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
            </Card>

            {/* Professional Info */}
            <Card
              title="Professional Details"
              icon="mdi:briefcase-account-outline"
            >
              <div className={styles.detailsGrid}>
                <div className={styles.formGroup}>
                  <label>Qualification<span className={styles.star}>*</span></label>
                  <Select
                    isMulti
                    name="qualification"
                    options={qualificationOptions}
                    value={values.qualification.map((val) => ({
                      label: val,
                      value: val,
                    }))}
                    onChange={(selectedOptions) =>
                      setFieldValue(
                        "qualification",
                        selectedOptions
                          ? selectedOptions.map((opt) => opt.value)
                          : []
                      )
                    }
                    className={styles.selectDropdown}
                    classNamePrefix="react-select"
                    placeholder="Select qualifications..."
                  />
                  <ErrorMessage
                    name="qualification"
                    component="div"
                    className="error"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Date of Joining<span className={styles.star}>*</span></label>
                  <Field type="date" name="dateOfJoining" className={styles.formInput} max={new Date().toISOString().split("T")[0]} />
                  <ErrorMessage name="dateOfJoining" component="div" className="error" />
                </div>
                <div className={styles.formGroup}>
                  <label>Previous Years of Experience<span className={styles.star}>*</span></label>
                  <Field name="previousExperience" className={styles.formInput} />
                  <ErrorMessage
                    name="previousExperience"
                    component="div"
                    className="error"
                  />
                </div>
                <div className={`${styles.formGroup} ${styles.fullRow}`}>
                  <label>Technical Expertise<span className={styles.star}>*</span></label>
                  <Select
                    isMulti
                    name="expertise"
                    options={expertiseOptions}
                    value={values.expertise.map((val) => ({
                      label: val,
                      value: val,
                    }))}
                    onChange={(selectedOptions) =>
                      setFieldValue(
                        "expertise",
                        selectedOptions
                          ? selectedOptions.map((opt) => opt.value)
                          : []
                      )
                    }
                    className={styles.selectDropdown}
                    classNamePrefix="react-select"
                    placeholder="Select technical skills..."
                  />
                  <ErrorMessage
                    name="expertise"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <div className={styles.footerButtons}>
                {role === "admin" && (
                  <Button label="Skip" secondary type="button" onClick={onNext} />)}
                <Button label="Next" type="submit" />
              </div>
            </Card>
          </Form>
        );
      }}
    </Formik>
  );
};

export default PersonalDetailsEmp;
