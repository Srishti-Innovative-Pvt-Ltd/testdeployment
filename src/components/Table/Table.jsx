import React, { useState, useEffect } from "react";
import styles from "./Table.module.css";

const Table = ({ columns, data, currentPage, onPageChange, actions }) => {
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default 10 rows per page

  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedData = data.slice(startIndex, startIndex + rowsPerPage);

useEffect(() => {
  if (currentPage > totalPages) {
    onPageChange(1); 
  }
}, [rowsPerPage, data, totalPages, currentPage, onPageChange]);

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.tableContainer}>
        {/* Table Header */}
        <div className={styles.tableHeader}>
          <div className={`${styles.headerCell} ${styles.slNoCell}`}>Sl NO</div>
          {columns.map((col, idx) => (
            <div key={idx} className={styles.headerCell}>
              {col.header}
            </div>
          ))}
          {actions && <div className={styles.headerCell}>Action</div>}
        </div>

        {/* Table Rows */}
        {paginatedData.length > 0 ? (
          paginatedData.map((row, idx) => (
            <div key={idx} className={styles.tableRow}>
              <div className={`${styles.cell} ${styles.slNoCell}`}>
                {startIndex + idx + 1}
              </div>
              {columns.map((col, cidx) => (
                <div key={cidx} className={styles.cell}  title={col.render ? "" : row[col.accessor]}>
                  {col.render
                    ? col.render(row, startIndex + idx)
                    : row[col.accessor]}
                </div>
              ))}
              {actions && (
                <div className={styles.cell}>
                  {actions.map((ActionBtn, aidx) => (
                    <ActionBtn key={aidx} row={row} />
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className={styles.noDataRow}>
            <div
              className={styles.cell}
              style={{ textAlign: "center", width: "100%" }}
            >
              No Data Available
            </div>
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className={styles.bottomControls}>
        <div className={styles.tableControls}>
          Show{" "}
          <select
            className={styles.entriesSelect}
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
          >
            {[10, 25, 50, 100].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>{" "}
          per page
        </div>

        <div className={styles.pagination}>
          <span>
            {startIndex + 1}–{Math.min(startIndex + rowsPerPage, data.length)}{" "}
            of {data.length}
          </span>
          <button
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
            className={`${styles.paginationButton} ${
              currentPage === 1 ? styles.disabledArrow : styles.arrowButton
            }`}
          >
            &lt;
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => onPageChange(i + 1)}
              className={`${styles.paginationButton} ${
                currentPage === i + 1 ? styles.activePage : ""
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
            className={`${styles.paginationButton} ${
              currentPage === totalPages
                ? styles.disabledArrow
                : styles.arrowButton
            }`}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Table;
