import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import './attendance.css';

const AttendanceList = () => {
    const [attendances, setAttendances] = useState([]);
    const [filteredAttendances, setFilteredAttendances] = useState([]);
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('Today');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [currentPage, setCurrentPage] = useState(1);
    const [entriesPerPage] = useState(3);

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const role = user?.role;
                const deptId = user?.dept_id;

                const response = await axios.get('http://localhost:5000/api/attendance');

                let attendanceData = response.data;

                if (role === 'manager' && deptId) {
                    attendanceData = attendanceData.filter(attendance => attendance.dept_id === parseInt(deptId, 10));
                }

                setAttendances(attendanceData);
                setFilteredAttendances(attendanceData);
            } catch (error) {
                console.error('Error fetching attendance data:', error);
            }
        };

        fetchAttendanceData();
    }, []);


    const applyFilters = useCallback(() => {
        let filtered = [...attendances];

        if (statusFilter !== 'all') {
            filtered = filtered.filter(attendance => attendance.attendance_status === statusFilter);
        }

        const today = new Date();
        if (dateFilter) {
            filtered = filtered.filter(attendance => {
                const attendanceDate = new Date(attendance.date);
                switch (dateFilter) {
                    case 'today':
                        return attendanceDate.toDateString() === today.toDateString();
                    case 'yesterday':
                        const yesterday = new Date(today);
                        yesterday.setDate(today.getDate() - 1);
                        return attendanceDate.toDateString() === yesterday.toDateString();
                    case 'lastWeek':
                        const lastWeek = new Date(today);
                        lastWeek.setDate(today.getDate() - 7);
                        return attendanceDate >= lastWeek && attendanceDate <= today;
                    default:
                        return true;
                }
            });
        }

        // Filter by custom date range
        if (startDate && endDate) {
            filtered = filtered.filter(attendance => {
                const attendanceDate = new Date(attendance.date);
                return attendanceDate >= new Date(startDate) && attendanceDate <= new Date(endDate);
            });
        }

        // Filter by search query
        if (searchQuery) {
            filtered = filtered.filter(attendance =>
                attendance.employee_name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setFilteredAttendances(filtered);
    }, [attendances, statusFilter, dateFilter, startDate, endDate, searchQuery]);

    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    // Calculate current entries based on pagination
    const indexOfLastEntry = currentPage * entriesPerPage;
    const indexOfFirstEntry = indexOfLastEntry - entriesPerPage;
    const currentEntries = filteredAttendances.slice(indexOfFirstEntry, indexOfLastEntry);
    const totalEntries = filteredAttendances.length;

    // Calculate total pages
    const totalPages = Math.ceil(totalEntries / entriesPerPage);

    return (
        <div className='attendance content'>
            <h1>Attendance List</h1>

            <div className="mx-0 mb-3">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                />
            </div>

            <div className="mx-0">
                <label>Status Filter: </label>
                <select className="me-3" onChange={(e) => setStatusFilter(e.target.value)} value={statusFilter}>
                    <option value="all">All</option>
                    <option value="Present">Present</option>
                    <option value="Absent">Absent</option>
                    <option value="Late">Late</option>
                </select>

                <label>Date Filter: </label>
                <select className="me-3" onChange={(e) => setDateFilter(e.target.value)} value={dateFilter}>
                    <option value="today">Today</option>
                    <option value="yesterday">Yesterday</option>
                    <option value="lastWeek">Last Week</option>
                    <option value="custom">Custom Range</option>
                </select>

                {dateFilter === 'custom' && (
                    <div>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            placeholder="Start Date"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            placeholder="End Date"
                        />
                    </div>
                )}
            </div>

            <table>
                <thead>
                    <tr>
                        <th>Employee ID</th>
                        <th>Department ID</th>
                        <th>Employee Name</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEntries.map((attendance) => (
                        <tr key={attendance.employee_id}>
                            <td>{attendance.employee_id}</td>
                            <td>{attendance.dept_id}</td>
                            <td>{attendance.employee_name}</td>
                            <td>{attendance.attendance_status}</td>
                            <td>{attendance.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="mx-0">
                <p>
                    Showing {indexOfFirstEntry + 1} to {Math.min(indexOfLastEntry, totalEntries)} of {totalEntries} entries
                </p>
                <button className="ms-0" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                    Previous
                </button>
                <span> Page {currentPage} of {totalPages} </span>
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                    Next
                </button>
            </div>
        </div>
    );
};

export default AttendanceList;
