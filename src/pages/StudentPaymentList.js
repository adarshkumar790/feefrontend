import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx'; // Import the xlsx library
import jsPDF from 'jspdf'; // Import the jsPDF library
import 'jspdf-autotable'; // Import jsPDF autotable plugin
import styles from './StudentList.module.css';

const baseURL = 'https://feebackend.onrender.com'

function StudentPaymentList() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Define the default total fee
  const DEFAULT_TOTAL_FEE = 161200;

  useEffect(() => {
    const fetchReceipts = async () => {
      try {
        const response = await axios.get(`${baseURL}/api/receipts`);
        setReceipts(response.data);
      } catch (err) {
        setError('Failed to fetch receipts. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchReceipts();
  }, []);

  const exportToExcel = () => {
    // Group receipts by roll number
    const groupedReceipts = receipts.reduce((acc, receipt) => {
      const rollNo = receipt.rollno;
      if (!acc[rollNo]) {
        acc[rollNo] = {
          name: receipt.name,
          rollno: rollNo,
          receipts: [],
          totalAmount: 0,
          totalFee: DEFAULT_TOTAL_FEE,
          duesFee: DEFAULT_TOTAL_FEE, // Initialize with default total fee
        };
      }
      acc[rollNo].receipts.push(receipt);
      acc[rollNo].totalAmount += receipt.totalAmount;
      acc[rollNo].duesFee = DEFAULT_TOTAL_FEE - acc[rollNo].totalAmount;

      return acc;
    }, {});

    // Prepare data for Excel export
    const exportData = Object.values(groupedReceipts).map(student => ({
      'Roll No': student.rollno,
      'Name': student.name,
      'Total Fee': student.totalFee,
      'Total Paid': student.totalAmount,
      'Dues Fee': student.duesFee,
      'Receipt Details': student.receipts.map(receipt => 
        `Receipt_No: ${receipt.receiptno}, Amount: ${receipt.totalAmount}, Tui_Fee: ${receipt.tuitionFee}, Add_Fee: ${receipt.admissionfee}, Pros:-${receipt.prospectusFee}, Trans:-${receipt.transportFee}, Other:-${receipt.other}, on ${formatReceiptDate(receipt.date)}`
      ).join('\n') // Join all receipt details with a newline character
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Receipts');

    // Setting the cell to wrap text
    worksheet['!cols'] = [
      { wpx: 80 },  // Roll No
      { wpx: 150 }, // Name
      { wpx: 100 }, // Total Fee
      { wpx: 100 }, // Total Paid
      { wpx: 100 }, // Dues Fee
      { wpx: 400 }  // Receipt Details
    ];

    // Apply text wrapping to all cells
    for (let cell in worksheet) {
      if (worksheet[cell] && typeof worksheet[cell] === 'object' && cell !== '!cols') {
        if (!worksheet[cell].s) worksheet[cell].s = {};
        worksheet[cell].s.alignment = { wrapText: true };
      }
    }

    XLSX.writeFile(workbook, 'Student_Receipts.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Student Payment Details', 20, 10);
    
    const groupedReceipts = receipts.reduce((acc, receipt) => {
      const rollNo = receipt.rollno;
      if (!acc[rollNo]) {
        acc[rollNo] = {
          name: receipt.name,
          rollno: rollNo,
          receipts: [],
          totalAmount: 0,
          totalFee: DEFAULT_TOTAL_FEE,
          duesFee: DEFAULT_TOTAL_FEE, // Initialize with default total fee
        };
      }
      acc[rollNo].receipts.push(receipt);
      acc[rollNo].totalAmount += receipt.totalAmount;
      acc[rollNo].duesFee = DEFAULT_TOTAL_FEE - acc[rollNo].totalAmount;

      return acc;
    }, {});

    const tableData = Object.values(groupedReceipts).map(student => {
      return [
        student.rollno,
        student.name,
        student.totalFee,
        student.totalAmount,
        student.duesFee,
        student.receipts.map(receipt => 
          `Receipt_No: ${receipt.receiptno}, Amount: ${receipt.totalAmount}, T_Fee: ${receipt.tuitionFee}, Admission Fee: ${receipt.admissionfee}, Pros:-${receipt.prospectusFee}, Trans:-${receipt.transportFee}, Other:-${receipt.other} on ${formatReceiptDate(receipt.date)}`
        ).join('\n')
      ];
    });

    doc.autoTable({
      head: [['Roll No', 'Name', 'Total Fee', 'Total Paid', 'Dues Fee', 'Receipt Details']],
      body: tableData,
      styles: { fontSize: 8 }, // Set the font size to small
      startY: 20, // Start after the title
      columnStyles: {
        0: { cellWidth: 20 },  // Roll No
        1: { cellWidth: 20 },  // Name
        2: { cellWidth: 20 },  // Total Fee
        3: { cellWidth: 20 },  // Total Paid
        4: { cellWidth: 20 },  // Dues Fee
        5: { cellWidth: 90 }   // Receipt Details
      },
      styles: { cellPadding: 1 }, // Optional: Reduce cell padding for more compact table
      // Enable text wrapping in receipt details
      // You might need to adjust `minCellHeight` or other properties based on content
    });

    doc.save('Student_Receipts.pdf');
  };

  const formatReceiptDate = (dateString) => {
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  // Group receipts by roll number for display
  const groupedReceipts = receipts.reduce((acc, receipt) => {
    const rollNo = receipt.rollno;
    if (!acc[rollNo]) {
      acc[rollNo] = {
        name: receipt.name,
        rollno: rollNo,
        receipts: [],
        totalAmount: 0,
        totalFee: DEFAULT_TOTAL_FEE,
        duesFee: DEFAULT_TOTAL_FEE, // Initialize with default total fee
      };
    }
    acc[rollNo].receipts.push(receipt);
    acc[rollNo].totalAmount += receipt.totalAmount;
    acc[rollNo].duesFee = DEFAULT_TOTAL_FEE - acc[rollNo].totalAmount;

    return acc;
  }, {});

  const receiptList = Object.values(groupedReceipts);

  return (
    <div className={styles.studentListContainer}>
      <h2>Student Payment Details</h2>
      <div className={styles.buttonContainer}>
        <button onClick={exportToExcel} className={styles.exportExcel}>
          Export to Excel
        </button>
        <button onClick={exportToPDF} className={styles.exportPdf}>
          Download PDF
        </button>
      </div>
      <table className={styles.receiptTable}>
        <thead>
          <tr>
            <th>Roll No</th>
            <th>Name</th>
            <th>Total Fee</th>
            <th>Total_Paid</th>
            <th>Dues Fee</th>
            <th>Receipts</th>
          </tr>
        </thead>
        <tbody>
          {receiptList.map((student) => (
            <tr key={student.rollno}>
              <td className={styles.Rollno}>{student.rollno}</td>
              <td className={styles.Name}>{student.name}</td>
              <td className={styles.receiptTotal}>{student.totalFee}</td>
              <td className={styles.receiptAmount}>{student.totalAmount}</td>
              <td className={styles.duesFee}>{student.duesFee}</td>
              <td>
                <ul className={styles.receiptList}>
                  {student.receipts.map((receipt) => (
                    <li key={receipt.receiptno} className={styles.receiptDetails}>
                      Receipt_No: {receipt.receiptno}, Amount: {receipt.totalAmount}, Tui_Fee: {receipt.tuitionFee}, Adm_Fee: {receipt.admissionfee}, Pros:-{receipt.prospectusFee}, Trans:-{receipt.transportFee}, Other:-{receipt.other}  on {formatReceiptDate(receipt.date)}
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default StudentPaymentList;
