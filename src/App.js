import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import FeePage from './pages/FeePage';
import AddStudent from './components/AddStudent';
import PaymentReceipt from './components/PaymentReciept';
import Login from './pages/Login';
import Receipt from './pages/Receipt';

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/add-student" element={<AddStudent />} />
          <Route path="/fee/:studentId" element={<FeePage />} />
          <Route path="/payment-receipt/:paymentId" element={<PaymentReceipt />} />
          <Route path='/' element={<Login/>}/>
          <Route path='/receipt' element={<Receipt/>}/>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
