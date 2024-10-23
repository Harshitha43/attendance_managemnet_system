import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './Dashboard';
import './leavetype.css';

const LeaveTypeList = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const entriesPerPage = 5; 
    const navigate = useNavigate();

    // Fetch leave types from the backend
    useEffect(() => {
        fetchLeaveTypes();
    }, []);

    const fetchLeaveTypes = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/leave-types');
            setLeaveTypes(response.data);
        } catch (error) {
            console.error('Error fetching leave types:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this leave type?')) {
            try {
                await axios.delete(`http://localhost:5000/api/leave-types/${id}`);
                fetchLeaveTypes();  
            } catch (error) {
                console.error('Error deleting leave type:', error);
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/edit-leave-type/${id}`);
    };

    // Pagination logic
    const indexOfLastLeaveType = currentPage * entriesPerPage;
    const indexOfFirstLeaveType = indexOfLastLeaveType - entriesPerPage;

    // Filter leave types based on search query
    const filteredLeaveTypes = leaveTypes.filter(leaveType =>
        leaveType.leave_type.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get current leave types to display
    const currentLeaveTypes = filteredLeaveTypes.slice(indexOfFirstLeaveType, indexOfLastLeaveType);

    const totalPages = Math.ceil(filteredLeaveTypes.length / entriesPerPage);

    return (
        <div className="content pb-0 leaveType">
            <div className="orders">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body px-0">
                                <h4 className="box-title m">Leave Type Master</h4>
                                <button onClick={() => navigate(`/add-leave-type`)} class="me-2">Add Leave Type</button>
                                {/* Search Input */}
                                <input
                                    type="text"
                                    placeholder="Search leave types..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="card-body--">
                                <div className="table-stats order-table ov-h">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th width="5%">S.No</th>
                                                <th width="5%">ID</th>
                                                <th width="70%">Leave Type</th>
                                                <th width="20%">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentLeaveTypes.map((leaveType, index) => (
                                                <tr key={leaveType.id}>
                                                    <td>{indexOfFirstLeaveType + index + 1}</td>
                                                    <td>{leaveType.id}</td>
                                                    <td>{leaveType.leave_type}</td>
                                                    <td className='d-flex'>
                                                        <button onClick={() => handleEdit(leaveType.id)}>Edit</button>
                                                        <button onClick={() => handleDelete(leaveType.id)}>Delete</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Pagination and Entry Count */}
                            <div className="pagination">
                                <p>
                                    Showing {indexOfFirstLeaveType + 1} to {Math.min(indexOfLastLeaveType, filteredLeaveTypes.length)} of {filteredLeaveTypes.length} entries
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
                        </div>
                    </div>
                </div>
            </div>
            <Dashboard />
        </div>
    );
};

export default LeaveTypeList;
