import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Decimal from "decimal.js";
import styles from "./Salary.module.css";
import Card from "../../components/Card/Card";
import Button from "../../components/Button/Button";
import { salarySchema } from "../../utils/ValidationSchema";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { getEmployeeSalaryStructure, saveEmployeeSalary } from "../../services/addEmployeeService";

function Salary({ user_id }) {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [salaryStructure, setSalaryStructure] = useState(null);
  const [components, setComponents] = useState([]);
  const [calcType, setCalcType] = useState("");
  const [percentValue, setPercentValue] = useState(0);
  const [calculatedValues, setCalculatedValues] = useState({});
  const [netSalary, setNetSalary] = useState(0);
  const [baseValue, setBaseValue] = useState("");
  const [savedValues, setSavedValues] = useState({});

  // Fetch salary structure and populate saved values
  useEffect(() => {
    const fetchStructure = async () => {
      const res = await getEmployeeSalaryStructure(user_id);
      if (res.success) {
        const data = res.data;
        setSalaryStructure(data.salaryStructure);
        setComponents(data.allocatedComponents);
        setCalcType(data.salaryStructure.calcType);
        setPercentValue(data.salaryStructure.percentValue);

        const initialSavedValues = { netSalary: data.netSalary || "" };

        if (data.salaryStructure.calcType === "BASIC") {
          initialSavedValues.base = data.basicSalary || "";
          initialSavedValues.gross = data.grossSalary || "";
        } else {
          initialSavedValues.base = data.grossSalary || "";
          initialSavedValues.basic = data.basicSalary || "";
        }

        data.allocatedComponents.forEach(comp => {
          if (comp.calculatedValue != null) {
            initialSavedValues[comp.label] = comp.calculatedValue;
          }
        });

        setSavedValues(initialSavedValues);
        setBaseValue(initialSavedValues.base || "");
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    };
    fetchStructure();
  }, [user_id]);

  // Salary calculation logic
  const handleBaseChange = (e, setFieldValue) => {
    const inputValue = e.target.value;
    setBaseValue(inputValue);
    // If empty → reset everything
    if (!inputValue) {
      setCalculatedValues({});
      setNetSalary(0);
      setSavedValues({}); // clear savedValues

      setFieldValue("netSalary", "");
      setFieldValue("base", "");
      setFieldValue("gross", "");
      setFieldValue("basic", "");
      components.forEach((c) => setFieldValue(c.label, ""));
      return;
    }

    const base = new Decimal(inputValue || 0).mul(100);
    if (!salaryStructure || base.lte(0)) {
      setCalculatedValues({});
      setNetSalary(0);
      setFieldValue("netSalary", "");
      components.forEach((c) => setFieldValue(c.label, ""));
      return;
    }
    let basic = new Decimal(0);
    let gross = new Decimal(0);

    if (calcType === "BASIC") {
      basic = base;
      gross = base.mul(percentValue).div(100);
    } else if (calcType === "GROSS") {
      gross = base;
      basic = base.mul(percentValue).div(100);
    }

    let tempValues = {
      basic: basic.div(100).toDecimalPlaces(2).toNumber(),
      gross: gross.div(100).toDecimalPlaces(2).toNumber(),
    };

    let totalBenefit = new Decimal(0);
    let totalCredit = new Decimal(0);
    let totalDeduction = new Decimal(0);

    components.forEach((comp) => {
      let amount = new Decimal(0);
      const baseVal = gross;

      if (comp.valueType === "PERCENTAGE") {
        amount = baseVal.mul(comp.percentage || 0).div(100);
      } else if (comp.valueType === "FIXED_AMOUNT") {
        amount = new Decimal(comp.amount || 0).mul(100);
      }

      if (comp.entryType === "BENEFIT") totalBenefit = totalBenefit.plus(amount);
      else if (comp.entryType === "CREDIT") totalCredit = totalCredit.plus(amount);
      else if (comp.entryType === "DEDUCTION") totalDeduction = totalDeduction.plus(amount);

      tempValues[comp.label] = amount.div(100).toDecimalPlaces(2).toNumber();
    });

    const total = gross.plus(totalBenefit).plus(totalCredit).minus(totalDeduction);
    const netSalaryInRupees = total.div(100).toDecimalPlaces(2).toNumber();

    setNetSalary(netSalaryInRupees);
    setCalculatedValues(tempValues);

    Object.keys(tempValues).forEach((key) => setFieldValue(key, tempValues[key]));
    setFieldValue("netSalary", netSalaryInRupees);
  };

  const initialValues = {
    base: savedValues.base || "",
    gross: savedValues.gross || "",
    basic: savedValues.basic || "",
    netSalary: savedValues.netSalary || "",
    ...components.reduce((acc, comp) => {
      acc[comp.label] = savedValues[comp.label] || "";
      return acc;
    }, {}),
  };

  return (
    <Formik
      enableReinitialize
      initialValues={initialValues}
      validationSchema={salarySchema(calcType)}
      onSubmit={async (values) => {
        try {
          if (!salaryStructure) return enqueueSnackbar("Salary structure not found", { variant: "error" });
          const salaryComponents = {};

          components.forEach((comp) => {
            const value = calculatedValues[comp.label] ?? savedValues[comp.label] ?? 0;
            salaryComponents[comp._id] = Number(value);
          });
          
          const payload = {
            companyId: String(salaryStructure.company),
            employeeId: String(user_id),
            netSalary: Number(values.netSalary || 0),
            basicSalary: Number(calcType === "BASIC" ? values.base : calculatedValues.basic || 0),
            grossSalary: Number(calcType === "GROSS" ? values.base : calculatedValues.gross || 0),
            salaryComponents,
          };

          const res = await saveEmployeeSalary(payload);

          res.success
            ? (enqueueSnackbar("Salary saved successfully!", { variant: "success" }), navigate("/pages/EmployeeData"))
            : enqueueSnackbar(res.message || "Failed to save salary", { variant: "error" });

        } catch (err) {
          enqueueSnackbar(err.message || "Error submitting salary", { variant: "error" });
        }
      }}
    >
      {({ setFieldValue }) => (
        <Form>
          <Card title="Salary Generation" icon="mdi:cash-multiple">
            <div className={styles.grid}>
              {/* Editable Base Salary */}
              <div className={styles.field}>
                <label>
                  {calcType === "BASIC" ? "Basic Salary" : "Gross Salary"}{" "}
                  <span className={styles.star}>*</span>
                </label>
                <Field
                  type="number"
                  name="base"
                  min="0"
                  value={baseValue}
                  onChange={(e) => {
                    setFieldValue("base", e.target.value);
                    handleBaseChange(e, setFieldValue);
                  }}
                />
                <ErrorMessage name="base" component="div" className={styles.error} />
              </div>

              {/* Auto-calculated field */}
              <div className={styles.field}>
                <label>{calcType === "BASIC" ? "Gross Salary" : "Basic Salary"}</label>
                <Field
                  type="number"
                  name={calcType === "BASIC" ? "gross" : "basic"}
                  min="0"
                  value={
                    calculatedValues[calcType === "BASIC" ? "gross" : "basic"] ??
                    savedValues[calcType === "BASIC" ? "gross" : "basic"] ??
                    ""
                  }
                  readOnly
                  style={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }}
                />
              </div>

              {/* Dynamic components */}
              {components.map((comp, i) => (
                <div key={i} className={styles.field}>
                  <label>
                    {comp.label} ({comp.entryType})
                  </label>
                  <Field
                    type="number"
                    name={comp.label}
                    min="0"
                    value={calculatedValues[comp.label] ?? savedValues[comp.label] ?? ""}
                    readOnly
                    style={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }}
                  />
                </div>
              ))}

              {/* Net Salary */}
              <div className={styles.field}>
                <label>Net Salary</label>
                <Field
                  type="number"
                  name="netSalary"
                  min="0"
                  value={netSalary || savedValues.netSalary || ""}
                  readOnly
                  style={{ cursor: "not-allowed", backgroundColor: "#f9f9f9" }}
                />
              </div>
            </div>

            <div className={styles.buttonGroup}>
              <Button label="Complete Process" type="submit" />
            </div>
          </Card>
        </Form>
      )}
    </Formik>
  );
}

export default Salary;
