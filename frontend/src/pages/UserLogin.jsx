import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import './Auth.css';

const UserLogin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
      password: Yup.string()
        .required('Password is required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.post('http://localhost:3000/api/auth/user/login', values, {
          withCredentials: true
        });
        
        if (response.data) {
          localStorage.setItem('user', JSON.stringify(response.data));
          navigate('/user/dashboard');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>User Login</h2>
        <p className="auth-subtitle">Welcome back! Please login to continue</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={formik.handleSubmit}>
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

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/user/register">Register here</Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
