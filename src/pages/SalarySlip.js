import React, { useState } from 'react';
import styles from './SalarySlip.module.css';

function SalarySlip() {
  const [formData, setFormData] = useState({
    name: '',
    designation: '',
    // department: '',
    dateOfJoining: '',
    // payPeriod: '',
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPayslip(true);
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
          {/* <div>
            <label>Pay Period</label>
            <input
              type="text"
              name="payPeriod"
              value={formData.payPeriod}
              onChange={handleChange}
              required
            />
          </div> */}
          {/* <div>
            <label>Worked Days</label>
            <input
              type="number"
              name="workedDays"
              value={formData.workedDays}
              onChange={handleChange}
              required
            />
          </div> */}

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
            />
          </div>
          <div>
            <label>House Rent Allowance</label>
            <input
              type="number"
              name="hra"
              value={formData.hra}
              onChange={handleChange}
              required
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
            />
          </div>
          <div>
            <label>ESIC</label>
            <input
              type="number"
              name="eslc"
              value={formData.eslc}
              onChange={handleChange}
              required
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
            />
          </div>

          <button type="submit">Generate Payslip</button>
        </form>
      ) : (
        <div className={styles.payslip}>
          <h3>N.N.GHOSH SANATAN TEACHERS TRAINING COLLEGE
          SANATAN ROAD, JAMUARY, KANKE, RANCHI-834006(JHARKHAND)</h3>
          <h3>Mob:-</h3>
          <div></div>
          <p>Month</p>
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
              {/* <tr>
                <td><strong>Worked Days</strong></td>
                <td>{formData.workedDays}</td>
              </tr> */}
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
                <td>{formData.basicPay}</td>
                <td>PF</td>
                <td>{formData.pfa}</td>
              </tr>
              <tr>
                <td>ESIC</td>
                <td>{formData.eslc}</td>
                <td>EOL</td>
                <td>{formData.eol}</td>
              </tr>
              <tr>
                <td>Advance</td>
                <td>{formData.advance}</td>
              </tr>
              <tr>
                <td><strong>Total Earnings</strong></td>
                <td><strong>{totalEarnings.toFixed(2)}</strong></td>
                <td><strong>Total Deductions</strong></td>
                <td><strong>{totalDeductions.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>

          {/* Net Pay Section */}
          <table className={styles.payslipTable}>
            <tbody>
              <tr>
                <td><strong>Net Pay</strong></td>
                <td><strong>₹{netPay.toFixed(2)}</strong></td>
              </tr>
            </tbody>
          </table>

          <div className={styles.footerNote}>
            This is a system-generated payslip.
          </div>

          <button onClick={() => setShowPayslip(false)}>Back to Form</button>
        </div>
      )}
    </div>
  );
}

export default SalarySlip;
