import React, { useState, useEffect } from "react";
import styles from "./CategoryPayrollAllocarion.module.css";
import { Icon } from "@iconify/react";
import PrimaryButton from "../../components/PrimaryButton/PrimaryButton";
import Table from "../../components/Table/Table";
import Button from "../../components/Button/Button";
import PayrollAllocationModal from "../../components/PayrollAllocationModal/PayrollAllocationModal";
import { getCompaniesByName } from "../../services/companyService";
import { getEmployeeCategories } from "../../services/settingsService";
import { enqueueSnackbar } from "notistack";
import { getPayrollAllocations, allocatePayrollsforCategory, updatePayrollAllocations } from "../../services/salaryService";


function CategoryPayrollAllocarion() {
  const [companies, setCompanies] = useState([]);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingData, setEditingData] = useState(null);

  const fetchAllocations = async () => {
    const res = await getPayrollAllocations(selectedCompany, selectedCategory);
    if (res.success) {
    const formatted = res.data.map((item, index) => ({
  id: item._id || index + 1,
  companyId: item.companyId?._id,
  company: item.companyId?.companyName || "-",
  categoryId: item.categoryId?._id,
  category: item.categoryId?.name || "-",
  components: item.allocatedComponents || [],
}));

      setData(formatted);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    fetchAllocations();
  }, [selectedCompany, selectedCategory]);


  // Table columns
  const columns = [
    { header: "Company Name", accessor: "company" },
    { header: "Employee Category", accessor: "category" },
    {
      header: "Action",
      render: (row) => (
        <Icon
          icon="mdi:pencil-outline"
          className={styles.CategoryPayrollAllocarionEditIcon}
          title="Edit"
          onClick={() => handleEditClick(row)}
        />
      ),
    },
  ];

const handleEditClick = async (row) => {
  try {
    const res = await getPayrollAllocations(row.companyId, row.categoryId);
    if (res.success && res.data.length > 0) {
      const allocation = res.data[0]; // assuming one match per company+category

      setEditingData({
        companyId: allocation.companyId._id,
        companyName: allocation.companyId.companyName,
        categoryId: allocation.categoryId._id,
        categoryName: allocation.categoryId.name,
        allocatedComponents: allocation.allocatedComponents || [],
        allComponents: allocation.allComponents || [],
      });

      setShowModal(true);
    } else {
      enqueueSnackbar("No allocation data found", { variant: "warning" });
    }
  } catch (err) {
    console.error("Edit click fetch error:", err);
    enqueueSnackbar("Failed to load allocation details", { variant: "error" });
  }
};

const handleAddClick = () => {
    setEditingData(null);
    setShowModal(true);
  };

  const handleClear = () => {
    setSelectedCompany("");
    setSelectedCategory("");
    setCategories([]); // reset categories also
  };

  // Handle Add Submit
  const handleAddSubmit = async (formData) => {
    const companyId = formData.company;
    const categoryIds = formData.employeeCategory;
    const allocatedComponents = Object.keys(formData.allocations).filter(
      (key) => formData.allocations[key]
    );

    const res = await allocatePayrollsforCategory(companyId, categoryIds, allocatedComponents);

    if (res.success) {
      enqueueSnackbar("Payroll allocation added successfully!", { variant: "success" });
      setShowModal(false);
      fetchAllocations();
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  };

  // Handle Edit Submit
  const handleEditSubmit = async (formData) => {
    const categoryId = formData.employeeCategory[0]; // since editing one category
    const allocatedComponents = Object.keys(formData.allocations).filter(
      (key) => formData.allocations[key]
    );

    const res = await updatePayrollAllocations(categoryId, allocatedComponents);

    if (res.success) {
      enqueueSnackbar("Payroll allocation updated successfully!", { variant: "success" });
      setShowModal(false);
      fetchAllocations();
    } else {
      enqueueSnackbar(res.message, { variant: "error" });
    }
  };


  // Fetch companies on mount
  useEffect(() => {
    const fetchCompanies = async () => {
      const res = await getCompaniesByName();
      if (res.success) {
        setCompanies(res.data || []);
      } else {
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, []);


  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getEmployeeCategories(selectedCompany || undefined);
      setCategories(res.success ? res.data || [] : []);
    };
    fetchCategories();
  }, [selectedCompany]);


  return (
    <div className={styles.CategoryPayrollAllocarionContainer}>
      {/* Header with Add Button */}
      <div className={styles.CategoryPayrollAllocarionHeader}>
        <PrimaryButton label="Add" onClick={handleAddClick} />
      </div>

      {/* Filters */}
      <div className={styles.CategoryPayrollAllocarionFilterSection}>
        <div className={styles.CategoryPayrollAllocarionFilterGroup}>
          <label>
            <Icon icon="mdi:office-building" /> Company
          </label>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
          >
            <option value="">-- Select Company --</option>
            {companies.length > 0 ? (
              companies.map((company) => (
                <option key={company._id} value={company._id}>
                  {company.companyName}
                </option>
              ))
            ) : (
              <option disabled>No companies available</option>
            )}
          </select>
        </div>

        <div className={styles.CategoryPayrollAllocarionFilterGroup}>
          <label>
            <Icon icon="mdi:account" /> Employee Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}

          >
            <option value="">-- Select Category --</option>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>
        </div>

        <div className={styles.CategoryPayrollAllocarionFilterButtons}>
          <Button label="Clear" onClick={handleClear} />
        </div>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        data={data}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
      />

      {/* Modal */}
      {showModal && (
        <PayrollAllocationModal
          isEdit={!!editingData}
          initialData={editingData}
          onClose={() => setShowModal(false)}
          onSubmit={editingData ? handleEditSubmit : handleAddSubmit}
        />
      )}

    </div>
  );
}

export default CategoryPayrollAllocarion;
