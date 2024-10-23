import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "./addLeave.css";

const AddLeave = () => {
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [leaveData, setLeaveData] = useState({
        leaveId: '',
        leaveFrom: '',
        leaveTo: '',
        leaveDescription: '',
    });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));
    const employeeId = user.userId; 
    const employee_name = user.userName; 
console.log('emp',employeeId, employee_name)

    useEffect(() => {
        const fetchLeaveTypes = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/leave-types');
                setLeaveTypes(response.data);
            } catch (error) {
                console.error('Error fetching leave types:', error);
            }
        };
        fetchLeaveTypes();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLeaveData({
            ...leaveData,
            [name]: value, 
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {           
            if (!employeeId || !employee_name) {
                throw new Error("Employee ID or name is missing.");
            }

            const dataToSubmit = { 
                ...leaveData, 
                employeeId, 
                employee_name 
            };

            // Submit the leave request
            await axios.post('http://localhost:5000/api/leave', dataToSubmit);
            setMessage('Leave request submitted successfully!');

            setLeaveData({
                leaveId: '',
                leaveFrom: '',
                leaveTo: '',
                leaveDescription: '',
            });

            navigate('/leaves');
        } catch (error) {
            setMessage('Error submitting leave request. Please try again.');
            console.error("Error submitting leave:", error);
        }
    };

    return (
        <div className="addLeave">
            <h1>Add Leave</h1>
            {message && <p>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Leave Type:</label>
                    <select
                        name="leaveId"
                        value={leaveData.leaveId}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Leave</option>
                        {leaveTypes.map(leaveType => (
                            <option key={leaveType.id} value={leaveType.id}>
                                {leaveType.leave_type}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label>From Date:</label>
                    <input
                        type="date"
                        name="leaveFrom"i
                        value={leaveData.leaveFrom}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>To Date:</label>
                    <input
                        type="date"
                        name="leaveTo"
                        value={leaveData.leaveTo}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Leave Description:</label>
                    <input
                        type="text"
                        name="leaveDescription"
                        value={leaveData.leaveDescription}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit Leave</button>
            </form>
        </div>
    );
};

export default AddLeave;
