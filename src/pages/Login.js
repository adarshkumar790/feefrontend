import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import zxcvbn from 'zxcvbn';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import { useAuth } from '../AuthContext';

function Login() {
  const { login } = useAuth(); // Destructure the login function from useAuth
  const navigate = useNavigate();
  const baseURL = 'https://feebackend.onrender.com';

  // CAPTCHA States
  const [captchaQuestion, setCaptchaQuestion] = useState('');
  const [captchaAnswer, setCaptchaAnswer] = useState(null);

  // Password Visibility State
  const [showPassword, setShowPassword] = useState(false);

  // Password Strength State
  const [passwordStrength, setPasswordStrength] = useState(null);

  // Generate a simple math CAPTCHA
  const generateCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const num2 = Math.floor(Math.random() * 10) + 1; // 1 to 10
    const operators = ['+', '-', '*'];
    const operator = operators[Math.floor(Math.random() * operators.length)];

    let question = '';
    let answer = 0;

    switch (operator) {
      case '+':
        question = `What is ${num1} + ${num2}?`;
        answer = num1 + num2;
        break;
      case '-':
        question = `What is ${num1} - ${num2}?`;
        answer = num1 - num2;
        break;
      case '*':
        question = `What is ${num1} × ${num2}?`;
        answer = num1 * num2;
        break;
      default:
        question = `What is ${num1} + ${num2}?`;
        answer = num1 + num2;
    }

    setCaptchaQuestion(question);
    setCaptchaAnswer(answer);
  };

  // Initialize CAPTCHA on component mount
  useEffect(() => {
    generateCaptcha();
  }, []);

  // Formik Setup with Validation
  const formik = useFormik({
    initialValues: {
      username: '',
      password: '',
      captcha: '',
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .min(4, 'Must be at least 4 characters')
        .required('Username is required'),
      password: Yup.string()
        .min(8, 'Must be at least 8 characters')
        .required('Password is required'),
      captcha: Yup.string()
        .required('Please solve the CAPTCHA')
        .test('captcha-match', 'Incorrect CAPTCHA answer', function (value) {
          return parseInt(value, 10) === captchaAnswer;
        }),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
      try {
        const response = await axios.post(`${baseURL}/api/admin/login`, {
          username: values.username,
          password: values.password,
        });

        // Use login function from useAuth and pass the token
        await login(response.data.token); 

        toast.success('Login successful');
        navigate('/home');
      } catch (error) {
        if (error.response && error.response.data && error.response.data.message) {
          setErrors({ submit: error.response.data.message });
          toast.error(error.response.data.message);
        } else {
          setErrors({ submit: 'An unexpected error occurred' });
          toast.error('An unexpected error occurred');
        }
        // Regenerate CAPTCHA on failed attempt
        generateCaptcha();
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Handle Password Input Change for Strength Validation
  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    formik.handleChange(e);
    if (pwd) {
      const strength = zxcvbn(pwd);
      setPasswordStrength(strength.score);
    } else {
      setPasswordStrength(null);
    }
  };

  // Toggle Password Visibility
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Get Password Strength Label
  const getPasswordStrengthLabel = () => {
    switch (passwordStrength) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  // Get Password Strength Color
  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case 0:
        return '#e74c3c'; // red
      case 1:
        return '#f39c12'; // orange
      case 2:
        return '#f1c40f'; // yellowgreen
      case 3:
        return '#2ecc71'; // green
      case 4:
        return '#27ae60'; // darkgreen
      default:
        return 'transparent';
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Admin Login</h2>
      <form onSubmit={formik.handleSubmit} className="login-form">
        {/* Username Field */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            className={`form-input ${formik.touched.username && formik.errors.username ? 'input-error' : ''}`}
            placeholder="Enter your username"
          />
          {formik.touched.username && formik.errors.username ? (
            <div className="error-message">{formik.errors.username}</div>
          ) : null}
        </div>

        {/* Password Field with Visibility Toggle */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">Password</label>
          <div className="password-input-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              onChange={handlePasswordChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={`form-input ${formik.touched.password && formik.errors.password ? 'input-error' : ''}`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="toggle-password-btn"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {formik.touched.password && formik.errors.password ? (
            <div className="error-message">{formik.errors.password}</div>
          ) : null}
          {/* Password Strength Indicator */}
          {passwordStrength !== null && (
            <div
              className="password-strength"
              style={{ color: getPasswordStrengthColor() }}
            >
              Password Strength: {getPasswordStrengthLabel()}
            </div>
          )}
        </div>

        {/* CAPTCHA Field */}
        <div className="form-group">
          <label htmlFor="captcha" className="form-label">{captchaQuestion}</label>
          <input
            id="captcha"
            name="captcha"
            type="text"
            autoComplete="off"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.captcha}
            className={`form-input ${formik.touched.captcha && formik.errors.captcha ? 'input-error' : ''}`}
            placeholder="Enter your answer"
          />
          {formik.touched.captcha && formik.errors.captcha ? (
            <div className="error-message">{formik.errors.captcha}</div>
          ) : null}
        </div>

        {/* Submit Button */}
        <button type="submit" className="login-button" disabled={formik.isSubmitting}>
          Login
        </button>

        {/* Display Error Messages */}
        {formik.errors.submit && <div className="error-message">{formik.errors.submit}</div>}
      </form>
      <ToastContainer />
    </div>
  );
}

export default Login;
