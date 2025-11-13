import React, { useState } from 'react';
import API from '../api/axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import '../styles/Auth.css'; // same CSS file as signup

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post('/auth/login', { email, password });

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      Swal.fire({
        title: 'Login Successful!',
        text: `Welcome back, ${data.user.name || 'User'}!`,
        icon: 'success',
        confirmButtonColor: '#007bff',
        timer: 1800,
        showConfirmButton: false
      });

      setTimeout(() => navigate('/'), 1000);
    } catch (err) {
      Swal.fire({
        title: 'Login Failed',
        text: err.response?.data?.message || 'Invalid email or password.',
        icon: 'error',
        confirmButtonColor: '#d33'
      });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h2>Welcome Back</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account? <Link to="/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
}
