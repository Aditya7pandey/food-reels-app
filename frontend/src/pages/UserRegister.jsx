import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import './Auth.css';

const UserRegister = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      fullName: Yup.string()
        .min(3, 'Name must be at least 3 characters')
        .required('Full name is required'),
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.post('http://localhost:3000/api/auth/user/register', {
          fullName: values.fullName,
          email: values.email,
          password: values.password,
        }, {
          withCredentials: true
        });
        
        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
          navigate('/user/dashboard');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>User Registration</h2>
        <p className="auth-subtitle">Join Zomato to discover amazing food</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={formik.handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Enter your full name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fullName}
              className={formik.touched.fullName && formik.errors.fullName ? 'error' : ''}
            />
            {formik.touched.fullName && formik.errors.fullName && (
              <div className="field-error">{formik.errors.fullName}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
              className={formik.touched.email && formik.errors.email ? 'error' : ''}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="field-error">{formik.errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
              className={formik.touched.password && formik.errors.password ? 'error' : ''}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="field-error">{formik.errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.confirmPassword}
              className={formik.touched.confirmPassword && formik.errors.confirmPassword ? 'error' : ''}
            />
            {formik.touched.confirmPassword && formik.errors.confirmPassword && (
              <div className="field-error">{formik.errors.confirmPassword}</div>
            )}
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/user/login">Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
