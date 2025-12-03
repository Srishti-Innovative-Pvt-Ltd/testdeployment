import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AttendanceExcelUpload.module.css';
import Button from '../../components/Button/Button';
import floorOptions from '../../pages/AttendanceExcelUpload/floorOptions';
import Card from '../../components/Card/Card';
import DashboardLayout from '../../layouts/DashboardLayout';
import { attendanceExcelUploadSchema } from '../../utils/ValidationSchema';
import { useSnackbar } from 'notistack';
import { processNewAttendance } from '../../services/attendanceService';

function AttendanceExcelUpload() {
  const [location, setLocation] = useState('');
  const [excelFile, setExcelFile] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleUpload = (e) => {
    setExcelFile(e.target.files[0]);
    setErrors((prev) => ({ ...prev, file: '' }));
  };

  const handleSubmit = async () => {
    const formDataToValidate = { location, file: excelFile };

    try {
      await attendanceExcelUploadSchema.validate(formDataToValidate, { abortEarly: false });

      const result = await processNewAttendance(excelFile);
      if (result.type === 'parsed') {
       
        enqueueSnackbar('Attendance parsed successfully!', { variant: 'success' });
        navigate('/pages/EmployeePunchlogs');
      }
    } catch (err) {
      if (err.name === 'ValidationError') {
        const formattedErrors = {};
        err.inner.forEach((e) => {
          formattedErrors[e.path] = e.message;
        });
        setErrors(formattedErrors);
      } else {
        enqueueSnackbar(err.message || 'Upload failed', { variant: 'error' });
      }
    }
  };

  return (
      <DashboardLayout>
    <div className={styles.attendanceUploadContainer}>
      <Card title="Attendance Excel Upload" icon="mdi:file-excel-outline">
      <div className={styles.uploadSection}>
        <label className={styles.uploadLabelInline}>SELECT OFFICE LOCATION:<span className={styles.star}>*</span></label>
        <div className={styles.uploadRadioGroupWrapper}>
          <div className={styles.uploadRadioGroup}>
            {floorOptions.map((loc) => (
              <label key={loc} className={styles.uploadRadioLabel}>
                <input
                  type="radio"
                  value={loc}
                  checked={location === loc}
                  onChange={(e) => {
                    setLocation(e.target.value);
                    setErrors((prev) => ({ ...prev, location: '' }));
                  }}
                />
                {loc}
              </label>
            ))}
          </div>
        </div>
        {errors.location && <p className={styles.error}>{errors.location}</p>}
      </div>

      <div className={styles.uploadSection}>
        <label className={styles.uploadLabelInline}>UPLOAD EXCEL<span className={styles.star}>*</span></label>
        <input
          type="file"
          onChange={handleUpload}
          className={styles.uploadFileInput}
          accept=".xls,.xlsx"
        />
        {errors.file && <p className={styles.error}>{errors.file}</p>}
      </div>
      <div className={styles.uploadButtonWrapper}>
        <Button label="Upload & Format" onClick={handleSubmit} />
      </div>
      </Card>
    </div>
    </DashboardLayout>

  );
}

export default AttendanceExcelUpload;
