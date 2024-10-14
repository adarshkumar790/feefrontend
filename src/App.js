import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import FeePage from './pages/FeePage';
import AddStudent from './components/AddStudent';
import PaymentReceipt from './components/PaymentReciept';
import Login from './pages/Login';
import Receipt from './pages/Receipt';
import StudentPaymentList from './pages/StudentPaymentList';
import SalarySlip from './pages/SalarySlip';
import { AuthProvider } from './AuthContext'; // Import the AuthProvider
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component

function App() {
  return (
    <AuthProvider>
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route 
              element={<ProtectedRoute />} // Use ProtectedRoute here as a wrapper
            >
              <Route path="/home" element={<Home />} />
              <Route path="/add-student" element={<AddStudent />} />
              <Route path="/fee/:studentId" element={<FeePage />} />
              <Route path="/payment-receipt/:paymentId" element={<PaymentReceipt />} />
              <Route path="/receipt" element={<Receipt />} />
              <Route path="/studentlist" element={<StudentPaymentList />} />
              <Route path="/salary" element={<SalarySlip />} />
            </Route>
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
