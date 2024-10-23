import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    // Validate email format using regex
    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    // Validate form inputs before submission
    const validateForm = () => {
        let errors = {};
        if (!email) {
            errors.email = 'Email is required';
        } else if (!validateEmail(email)) {
            errors.email = 'Invalid email format';
        }

        if (!password) {
            errors.password = 'Password is required';
        } else if (password.length < 6) {
            errors.password = 'Password must be at least 6 characters long';
        }

        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const response = await axios.post('http://localhost:5000/api/login', { email, password });
            console.log(response.data)
            localStorage.setItem('user', JSON.stringify({
                role: response.data.role,
                userId: response.data.userId,
                userName: response.data.employee_name,
                email: response.data.email,
                dept_id:response.data.dept_id,
                leave_balance:response.data.leave_balance,
                employee_name:response.data.employee_name,
                shift:response.data.shift
              // users: response.data
            }));
            sessionStorage.setItem('user', JSON.stringify({
                role: response.data.role,
                userId: response.data.userId,
                userName: response.data.userName,
                email: response.data.email,
                dept_id:response.data.dpt_id,
                leave_balance:response.data.leave_balance
            }));

            navigate('/dashboard'); 

        } catch (error) {
            if (error.response && error.response.data) {
                setMsg(error.response.data.msg || 'Please enter correct login details');
            } else {
                setMsg('An error occurred. Please try again.');
            }
        }
    };

    return (
        <div className=" login bg-dark h-100">
            <div className="sufee-login d-flex align-content-center flex-wrap h-100">
                <div className="container h-100">
                    <div className="login-content">
                        <div className="login-form mt-0">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="form-group d-flex flex-column mx-0">
                                    <label>Email address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                </div>
                                <div className="form-group mx-0">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
                                </div>
                                <button type="submit" className="btn btn-success btn-flat m-b-30 m-t-30 mx-0">
                                    Sign in
                                </button>
                                {msg && <div className="alert alert-danger mt-3">{msg}</div>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;
