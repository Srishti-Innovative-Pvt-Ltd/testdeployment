import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { contactDetailsSchema } from "../../utils/ValidationSchema";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import Table from "../../components/Table/Table";
import { useSnackbar } from "notistack";
import { Country, State, City } from "country-state-city";
import Select from 'react-select';

const ContactDetails = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [attachmentData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const countries = Country.getAllCountries();
  const states = selectedCountry ? State.getStatesOfCountry(selectedCountry) : [];
  const cities = selectedState ? City.getCitiesOfState(selectedCountry, selectedState) : [];

  const attachmentColumns = [
    { header: "File Name", accessor: "fileName" },
    { header: "Description", accessor: "description" },
    { header: "Size", accessor: "size" },
    { header: "Type", accessor: "type" },
    { header: "Date Added", accessor: "dateAdded" },
    { header: "Added By", accessor: "addedBy" },
  ];

  const initialValues = {
    street1: "",
    street2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    homePhone: "",
    mobilePhone: "",
    workPhone: "",
    workEmail: "",
    otherEmail: "",
  };

  const handleSubmit = (values) => {
    console.log("Form Submitted:", values);
    enqueueSnackbar("Contact details submitted successfully!", { variant: "success" });
  };

  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={contactDetailsSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue }) => (
          <Form>
            <Card title="Contact Details" icon="fluent:contact-card-20-regular">
              <h6 className="mb-3">Address</h6>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Street 1</label>
                  <Field type="text" name="street1" className="form-control" />
                  <ErrorMessage name="street1" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>Street 2</label>
                  <Field type="text" name="street2" className="form-control" />
                </div>

                {/* <div className="col-md-4 mb-3">
                  <label>Country</label>
                  <Field
                    as="select"
                    name="country"
                    className="form-control"
                    onChange={(e) => {
                      const selected = e.target.value;
                      setSelectedCountry(selected);
                      setSelectedState("");
                      setFieldValue("country", selected);
                      setFieldValue("state", "");
                      setFieldValue("city", "");
                    }}
                  >
                    <option value="">-- Select Country --</option>
                    {countries.map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="country" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>State/Province</label>
                  <Field
                    as="select"
                    name="state"
                    className="form-control"
                    disabled={!selectedCountry}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setSelectedState(selected);
                      setFieldValue("state", selected);
                      setFieldValue("city", "");
                    }}
                  >
                    <option value="">-- Select State --</option>
                    {states.map((state) => (
                      <option key={state.isoCode} value={state.isoCode}>
                        {state.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="state" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>City</label>
                  <Field
                    as="select"
                    name="city"
                    className="form-control"
                    disabled={!selectedState}
                  >
                    <option value="">-- Select City --</option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </Field>
                  <ErrorMessage name="city" component="div" className="text-danger" />
                </div> */}

                <div className="col-md-4 mb-3">
                  <label>Country</label>
                  <Select
                    options={countries.map((c) => ({ value: c.isoCode, label: c.name }))}
                    name="country"
                    value={countries.find((c) => c.isoCode === selectedCountry) ? {
                      value: selectedCountry,
                      label: countries.find((c) => c.isoCode === selectedCountry)?.name
                    } : null}
                    onChange={(selectedOption) => {
                      setSelectedCountry(selectedOption.value);
                      setSelectedState("");
                      setFieldValue("country", selectedOption.value);
                      setFieldValue("state", "");
                      setFieldValue("city", "");
                    }}
                    isSearchable
                    placeholder="Select country..."
                  />
                  <ErrorMessage name="country" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>State/Province</label>
                  <Select
                    options={states.map((s) => ({ value: s.isoCode, label: s.name }))}
                    name="state"
                    isDisabled={!selectedCountry}
                    value={states.find((s) => s.isoCode === selectedState) ? {
                      value: selectedState,
                      label: states.find((s) => s.isoCode === selectedState)?.name
                    } : null}
                    onChange={(selectedOption) => {
                      setSelectedState(selectedOption.value);
                      setFieldValue("state", selectedOption.value);
                      setFieldValue("city", "");
                    }}
                    isSearchable
                    placeholder="Select state..."
                  />
                  <ErrorMessage name="state" component="div" className="text-danger" />
                </div>

                <div className="col-md-4 mb-3">
                  <label>City</label>
                  <Select
                    options={cities.map((city) => ({ value: city.name, label: city.name }))}
                    name="city"
                    isDisabled={!selectedState}
                    onChange={(selectedOption) => {
                      setFieldValue("city", selectedOption.value);
                    }}
                    isSearchable
                    placeholder="Select city..."
                  />
                  <ErrorMessage name="city" component="div" className="text-danger" />
                </div>


                <div className="col-md-4 mb-3">
                  <label>Zip/Postal Code</label>
                  <Field type="text" name="zipCode" className="form-control" />
                  <ErrorMessage name="zipCode" component="div" className="text-danger" />
                </div>
              </div>

              <h6 className="mb-3">Telephone</h6>
              <div className="row">
                <div className="col-md-4 mb-3">
                  <label>Home</label>
                  <Field type="text" name="homePhone" className="form-control" />
                  <ErrorMessage name="homePhone" component="div" className="text-danger" />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Mobile</label>
                  <Field type="text" name="mobilePhone" className="form-control" />
                  <ErrorMessage name="mobilePhone" component="div" className="text-danger" />
                </div>
                <div className="col-md-4 mb-3">
                  <label>Work</label>
                  <Field type="text" name="workPhone" className="form-control" />
                  <ErrorMessage name="workPhone" component="div" className="text-danger" />
                </div>
              </div>

              <h6 className="mb-3">Email</h6>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label>Work Email</label>
                  <Field type="email" name="workEmail" className="form-control" />
                  <ErrorMessage name="workEmail" component="div" className="text-danger" />
                </div>
                <div className="col-md-6 mb-3">
                  <label>Other Email</label>
                  <Field type="email" name="otherEmail" className="form-control" />
                  <ErrorMessage name="otherEmail" component="div" className="text-danger" />
                </div>
              </div>

              <div className="d-flex justify-content-end">
                <Button label="Save Contact Details" type="submit" />
              </div>
            </Card>
          </Form>
        )}
      </Formik>

      <Card title="Attachments" icon="fluent:attach-16-regular">
        <div className="d-flex justify-content-end mb-2">
          <Button label="+ Add" />
        </div>
        {attachmentData.length > 0 ? (
          <Table
            columns={attachmentColumns}
            data={attachmentData}
            currentPage={currentPage}
            rowsPerPage={5}
            onPageChange={setCurrentPage}
          />
        ) : (
          <p className="text-muted text-center">No Records Found</p>
        )}
      </Card>
    </div>
  );
};

export default ContactDetails;
