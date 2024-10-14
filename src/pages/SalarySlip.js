import React, { useState } from 'react';
import styles from './SalarySlip.module.css';

function SalarySlip() {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    dateOfJoining: '',
    month: '',
    workedDays: '',
    basicPay: '',
    da: '',
    hra: '',
    tpt: '',
    pfa: '',
    eslc: '',
    eol: '',
    advance: '',
  });

  const [showPayslip, setShowPayslip] = useState(false);
  const [receiptNumber, setReceiptNumber] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPayslip(true);

    // Generate a receipt number (e.g., timestamp + random number)
    const generatedReceiptNumber = `RCP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setReceiptNumber(generatedReceiptNumber);
  };

  const totalEarnings =
    parseFloat(formData.basicPay || 0) +
    parseFloat(formData.da || 0) +
    parseFloat(formData.hra || 0) +
    parseFloat(formData.tpt || 0);

  const totalDeductions =
    parseFloat(formData.pfa || 0) +
    parseFloat(formData.eslc || 0) +
    parseFloat(formData.eol || 0) +
    parseFloat(formData.advance || 0);

  const netPay = totalEarnings - totalDeductions;

  return (
    <div className={styles.container}>
      {!showPayslip ? (
        <form onSubmit={handleSubmit} className={styles.form}>
          <h2>Employee Information</h2>
          <div>
            <label>Employee Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Designation</label>
            <input
              type="text"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Date of Joining</label>
            <input
              type="date"
              name="dateOfJoining"
              value={formData.dateOfJoining}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label>Month</label>
            <select
              name="month"
              value={formData.month}
              onChange={handleChange}
              required
            >
              <option value="">Select Month</option>
              <option value="January">January</option>
              <option value="February">February</option>
              <option value="March">March</option>
              <option value="April">April</option>
              <option value="May">May</option>
              <option value="June">June</option>
              <option value="July">July</option>
              <option value="August">August</option>
              <option value="September">September</option>
              <option value="October">October</option>
              <option value="November">November</option>
              <option value="December">December</option>
            </select>
          </div>

          {/* Earnings Section */}
          <h2>Earnings</h2>
          <div>
            <label>Basic Pay</label>
            <input
              type="number"
              name="basicPay"
              value={formData.basicPay}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label>DA</label>
            <input
              type="number"
              name="da"
              value={formData.da}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label>House Rent Allowance (HRA)</label>
            <input
              type="number"
              name="hra"
              value={formData.hra}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label>TPT</label>
            <input
              type="number"
              name="tpt"
              value={formData.tpt}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          {/* Deductions Section */}
          <h2>Deductions</h2>
          <div>
            <label>PF</label>
            <input
              type="number"
              name="pfa"
              value={formData.pfa}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label>ESLC</label>
            <input
              type="number"
              name="eslc"
              value={formData.eslc}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label>EOL</label>
            <input
              type="number"
              name="eol"
              value={formData.eol}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>
          <div>
            <label>Advance</label>
            <input
              type="number"
              name="advance"
              value={formData.advance}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
            />
          </div>

          <button type="submit">Generate Payslip</button>
        </form>
      ) : (
        <div className={styles.payslip}>
          {/* College Name and Address */}
          <div className={styles.header}>
            <h3>N.N.GHOSH SANATAN TEACHERS TRAINING COLLEGE</h3>
            <p>SANATAN ROAD, JAMUARY, KANKE, RANCHI-834006 (JHARKHAND)</p>
            <p>Mob:-06512913165</p>
          </div>

          {/* Displaying the Receipt Number and Selected Month */}
          <div className={styles.month}>
            <strong>Receipt No:</strong> {receiptNumber} &nbsp;|&nbsp; <strong>Month:</strong> {formData.month}
          </div>

          {/* Employee Information Table */}
          <table className={styles.payslipTable}>
            <thead>
              <tr>
                <th colSpan="2">Employee Information</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>Employee Name</strong></td>
                <td>{formData.name}</td>
              </tr>
              <tr>
                <td><strong>Designation</strong></td>
                <td>{formData.designation}</td>
              </tr>
              <tr>
                <td><strong>Date of Joining</strong></td>
                <td>{formData.dateOfJoining}</td>
              </tr>
            </tbody>
          </table>

          {/* Earnings and Deductions Table */}
          <table className={styles.payslipTable}>
            <thead>
              <tr>
                <th>Earnings</th>
                <th>Amount (₹)</th>
                <th>Deductions</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Basic Pay</td>
                <td>{parseFloat(formData.basicPay).toFixed(2)}</td>
                <td>PF</td>
                <td>{parseFloat(formData.pfa).toFixed(2)}</td>
              </tr>
              <tr>
                <td>DA</td>
                <td>{parseFloat(formData.da).toFixed(2)}</td>
                <td>ESLC</td>
                <td>{parseFloat(formData.eslc).toFixed(2)}</td>
              </tr>
              <tr>
                <td>House Rent Allowance (HRA)</td>
                <td>{parseFloat(formData.hra).toFixed(2)}</td>
                <td>EOL</td>
                <td>{parseFloat(formData.eol).toFixed(2)}</td>
              </tr>
              <tr>
                <td>TPT</td>
                <td>{parseFloat(formData.tpt).toFixed(2)}</td>
                <td>Advance</td>
                <td>{parseFloat(formData.advance).toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Total Earnings</strong></td>
                <td><strong>{totalEarnings.toFixed(2)}</strong></td>
                <td><strong>Total Deductions</strong></td>
                <td><strong>{totalDeductions.toFixed(2)}</strong></td>
              </tr>
              <tr>
                <td colSpan="3"><strong>Net Pay</strong></td>
                <td><strong>{netPay.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>

          {/* Reset Button */}
          <button  onClick={() => { setShowPayslip(false); setReceiptNumber(''); setFormData({ name: '', designation: '', dateOfJoining: '', month: '', workedDays: '', basicPay: '', da: '', hra: '', tpt: '', pfa: '', eslc: '', eol: '', advance: '' }); }}>Generate Another Payslip</button>
        </div>
      )}
    </div>
  );
}

export default SalarySlip;
