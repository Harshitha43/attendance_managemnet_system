import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './Dashboard';

const EmployeeMaster = () => {
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const role = user?.role;
                const deptId = user?.dept_id;

                const res = await axios.get('http://localhost:5000/api/users');
                let userData = res.data;

                // If the user role is "manager", filter data based on dept_id
                if (role === 'manager' && deptId) {
                    userData = userData.filter(user => user.dept_id === parseInt(deptId, 10));
                }

                setUsers(userData);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/users/${id}`);
            setUsers(users.filter(user => user.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    // Filter users based on search query
    const filteredUsers = users.filter(user =>
        user.employee_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate current entries based on pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredUsers.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalEntries = filteredUsers.length;

    // Calculate total pages
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    return (
        <div className="content employee">
            <h4>Employees</h4>
            <button onClick={() => navigate('/add-employee')} className="me-2">Add User</button>

            {/* Search Input */}
            <input
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />

            <table className="table">
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Shift</th>
                        <th>Department ID</th>
                        <th>Leave Balance</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEntries.map((user, index) => (
                        <tr key={user.id}>
                            <td>{index + 1 + indexOfFirstEntry}</td>
                            <td>{user.id}</td>
                            <td>{user.employee_name}</td>
                            <td>{user.email}</td>
                            <td>{user.shift}</td>
                            <td>{user.dept_id}</td>
                            <td>{user.leave_bal}</td>
                            <td>
                                <button onClick={() => navigate(`/add-employee/${user.id}`)}>Edit</button>
                                <button onClick={() => handleDelete(user.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
                <p>
                    Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries} entries
                </p>
                <div>
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                        Previous
                    </button>
                    <span> Page {currentPage} of {totalPages} </span>
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                        Next
                    </button>
                </div>
            </div>

            <Dashboard />
        </div>
    );
};

export default EmployeeMaster;
