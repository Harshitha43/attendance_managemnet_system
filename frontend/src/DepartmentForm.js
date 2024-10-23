import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const DepartmentForm = () => {
    const [department, setDepartment] = useState('');
    const { id: departmentId } = useParams();
    const navigate = useNavigate();

    // Fetch the department data if editing
    useEffect(() => {
        if (departmentId) {
            const fetchDepartment = async () => {
                try {
                    const response = await axios.get(`http://localhost:5000/api/Department/${departmentId}`);
                    setDepartment(response.data.department);
                } catch (error) {
                    console.error('Error fetching department:', error);
                }
            };
            fetchDepartment();
        }
    }, [departmentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const url = departmentId
            ? `http://localhost:5000/api/update-department/${departmentId}`
            : 'http://localhost:5000/api/add-department';

        const data = {
            department: department
        };

        try {
            await axios.post(url, data);
            console.log("Success: Department saved");
            navigate('/departments');
        } catch (error) {
            console.error('Error adding/updating department:', error);
        }
    };

    return (
        <form onSubmit={handleSubmit} className='departmentForm'>
            <div>
                <label htmlFor="department">Department Name</label>
                <input
                    type="text"
                    id="department"
                    value={department}
                    placeholder='Department name'
                    onChange={(e) => setDepartment(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Submit</button>
        </form>

    );
};

export default DepartmentForm;
