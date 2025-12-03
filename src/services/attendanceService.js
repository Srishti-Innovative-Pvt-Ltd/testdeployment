import Papa from "papaparse";

export const processNewAttendance = async (file) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(
      `${import.meta.env.VITE_HRMS_ATTENDANCE_API}/process-attendance`,
      {
        method: "POST",
        headers: {
          "X-API-KEY": import.meta.env.VITE_API_KEY_ATTENDANCE,
        },
        body: formData,
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Attendance processing failed");
    }

    const csvText = await response.text();

    // Parse CSV to JSON using PapaParse
    const parsed = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
    });

    return { type: "parsed", data: parsed.data };
  } catch (error) {
    throw new Error(error.message || "Error processing attendance");
  }
};
