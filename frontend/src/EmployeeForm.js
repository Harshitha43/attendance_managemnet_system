import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./employee.css";

const EmployeeForm = () => {
  const [userData, setUserData] = useState({
    employee_name: '',
    email: '',
    password: '',
    dept_id: '',
    shift: '',
    leave_bal: '',
    role: 'user',
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      // Fetch user details for editing
      const fetchUser = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/users/${id}`);
          setUserData(res.data);
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      };
      fetchUser();
    }
  }, [id]);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (id) {
        // Update user if ID exists
        await axios.put(`http://localhost:5000/api/users/${id}`, userData);
      } else {
        // Create new user
        await axios.post('http://localhost:5000/api/users', userData);
      }
      navigate('/employees');
    } catch (error) {
      console.error('Error saving user:', error);
    }
  };

  return (
    <div className="p-4 employeeForm">
      <h2>{id ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="employee_name" value={userData.employee_name} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={userData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" value={userData.password} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Shift</label>
          <input type="text" name="shift" value={userData.shift} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Department ID</label>
          <input type="text" name="dept_id" value={userData.dept_id} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Leave Balance</label>
          <input type="number" name="leave_bal" value={userData.leave_bal} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label>Role</label>
          <select name="role" value={userData.role} onChange={handleChange} required>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
          </select>
        </div>
        <div className="form-group mt-3 ">
          <button type="submit" className="employeeFormBtn mx-0">{id ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
