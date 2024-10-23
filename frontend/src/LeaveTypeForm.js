import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
// import './leavetype.css'


const LeaveTypeForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [leaveType, setLeaveType] = useState('');

    useEffect(() => {
        if (id) {
            axios.get(`http://localhost:5000/api/leave-types/${id}`)
                .then(response => setLeaveType(response.data.leave_type))
                .catch(error => console.error(error));
        }
    }, [id]);

    const handleSubmit = (e) => {
        e.preventDefault();
        axios.post('http://localhost:5000/api/leave-types', { id, leave_type: leaveType })
            .then(() => {
                navigate('/leave-types');
            })
            .catch(error => console.error(error));
    };

    return (
        <div className='leaveType leavetypeForm'>
            <h2>{id ? 'Edit Leave Type' : 'Add Leave Type'}</h2>
            <form onSubmit={handleSubmit} >
                <input
                    type="text"
                    value={leaveType}
                    onChange={(e) => setLeaveType(e.target.value)}
                    placeholder="Leave Type"
                    required
                />
                <button type="submit">{id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default LeaveTypeForm;
