import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
import Dashboard from './Dashboard';
import './leaveManagement.css';

const Leave = () => {
  const [leaves, setLeaves] = useState([]);
  const [filteredLeaves, setFilteredLeaves] = useState([]);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [entriesPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));

    if (userData) {
      setRole(userData.role);
      setUserId(userData.userId);
    }

    // Fetch leaves after setting role and userId
    const fetchLeaves = async () => {
      try {
        const url = role === "admin"
          ? 'http://localhost:5000/api/leave'
          : `http://localhost:5000/api/leave/user/${userId}`;

        const response = await axios.get(url);
        setLeaves(response.data);
        setFilteredLeaves(response.data);
      } catch (error) {
        console.error('Error fetching leaves:', error);
      }
    };

    if (role && userId) {
      fetchLeaves();
    }
  }, [role, userId]);

  useEffect(() => {
    // Filter leaves based on the search query
    const filtered = leaves.filter(leave =>
      leave.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      leave.leave_id.toString().includes(searchQuery)
    );
    setFilteredLeaves(filtered);
    setCurrentPage(1); // Reset to first page on search
  }, [searchQuery, leaves]);

  const deleteLeave = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/leave/${id}`);
      setLeaves(leaves.filter(leave => leave.leave_id !== id));
      setFilteredLeaves(filteredLeaves.filter(leave => leave.leave_id !== id));
    } catch (err) {
      console.error('Error deleting leave', err);
    }
  };

  const updateLeaveStatus = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/api/leave/${id}/status`, { status });
      // Update filtered leaves after status change
      const updatedLeaves = filteredLeaves.map(leave =>
        leave.leave_id === id ? { ...leave, leave_status: status } : leave
      );
      setFilteredLeaves(updatedLeaves);
    } catch (err) {
      console.error('Error updating leave status', err);
    }
  };

  // Pagination logic
  const indexOfLastEntry = currentPage * entriesPerPage;
  const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
  const currentLeaves = filteredLeaves.slice(indexOfFirstEntry, indexOfLastEntry);
  const totalPages = Math.ceil(filteredLeaves.length / entriesPerPage);

  return (
    <div className='leave-management content'>
      <h4>Leave Management</h4>
      {role === "user" && (
        <button
          className="btn btn-primary mb-3 me-2"
          onClick={() => navigate('/add-leave')}
        >
          Add Leave
        </button>
      )}
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: '20px', padding: '8px', width: '200px' }}
      />

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>ID</th>
            <th>leave_id</th>
            <th>Employee Name</th>
            <th>From</th>
            <th>To</th>
            <th>Description</th>
            <th>Status</th>
            {role === "admin" && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentLeaves.map((leave, index) => (
            <tr key={leave.leave_id}>
              <td>{index + 1 + indexOfFirstEntry}</td>
              <td>{leave.employee_id}</td>
              <td>{leave.leave_id}</td>
              <td>{leave.employee_name}</td>
              <td>{leave.leave_from}</td>
              <td>{leave.leave_to}</td>
              <td>{leave.leave_description}</td>
              <td>
                {leave.leave_status === '1' && 'Applied'}
                {leave.leave_status === '2' && 'Approved'}
                {leave.leave_status === '3' && 'Rejected'}
              </td>
              {role === "admin" && (
                <td className="actions">
                  <select className='mb-1'
                    onChange={(e) => updateLeaveStatus(leave.leave_id, e.target.value)}
                    defaultValue={leave.leave_status}
                  >
                    <option value="">Update Status</option>
                    <option value="2">Approve</option>
                    <option value="3">Reject</option>
                  </select>
                  <button onClick={() => deleteLeave(leave.leave_id)}>Delete</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <p>
          Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, filteredLeaves.length)} of {filteredLeaves.length} entries
        </p>
        <div>
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}>
            Previous
          </button>
          <span> Page {currentPage} of {totalPages} </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
      <Dashboard />
    </div>
  );
};

export default Leave;
