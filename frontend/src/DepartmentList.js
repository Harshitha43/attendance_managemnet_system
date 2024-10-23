import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from './Dashboard';
import './department.css';

const DepartmentList = () => {
    const [departments, setDepartments] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [departmentsPerPage] = useState(5);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    // Fetch departments from the backend
    useEffect(() => {
        fetchDepartments();
    }, []);

    const fetchDepartments = async () => {
        console.log("Fetching departments");
        try {
            const response = await axios.get('http://localhost:5000/api/Departments');
            setDepartments(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this department?')) {
            try {
                await axios.delete(`http://localhost:5000/api/Departments/${id}`);
                fetchDepartments();
            } catch (error) {
                console.error('Error deleting department:', error);
            }
        }
    };

    // Navigate to add/edit page
    const handleEdit = (id) => {
        navigate(`/update-department/${id}`);
    };

    // Pagination logic
    const indexOfLastDepartment = currentPage * departmentsPerPage;
    const indexOfFirstDepartment = indexOfLastDepartment - departmentsPerPage;

    // Filter departments based on search query
    const filteredDepartments = departments.filter(department =>
        department.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Get current departments to display
    const currentDepartments = filteredDepartments.slice(indexOfFirstDepartment, indexOfLastDepartment);

    const totalPages = Math.ceil(filteredDepartments.length / departmentsPerPage);

    return (
        <div className="content pb-0 department">
            <div className="orders">
                <div className="row">
                    <div className="col-xl-12">
                        <div className="card">
                            <div className="card-body px-0">
                                <h4 className="box-title">Department Master</h4>
                                <button onClick={() => navigate(`/add-department`)}>Add Department</button>
                                {/* Search Input */}
                                <input
                                    type="text"
                                    placeholder="Search departments..."
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
                                                <th width="70%">Department Name</th>
                                                <th width="20%">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {currentDepartments.map((department, index) => (
                                                <tr key={department.id}>
                                                    <td>{indexOfFirstDepartment + index + 1}</td>
                                                    <td>{department.id}</td>
                                                    <td>{department.department}</td>
                                                    <td className='d-flex'>
                                                        <button onClick={() => handleEdit(department.id)}>Edit</button>
                                                        <button onClick={() => handleDelete(department.id)}>Delete</button>
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
                                    Showing {indexOfFirstDepartment + 1} to {Math.min(indexOfLastDepartment, filteredDepartments.length)} of {filteredDepartments.length} entries
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

export default DepartmentList;
