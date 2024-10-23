import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import Profile from './Profile';
import DepartmentList from './DepartmentList';
import DepartmentForm from './DepartmentForm';
import EmployeeMaster from './EmployeeMaster';
import EmployeeForm from './EmployeeForm';
import LeaveTypeList from './LeaveTypeList';
import LeaveTypeForm from './LeaveTypeForm';
import Leave from './Leave';
import AddLeave from './AddLeave';
import AttendanceList from './AttendanceList';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/departments" element={<DepartmentList />} /> { }
                <Route exact path="/add-department" element={<DepartmentForm />} />
                {/* <Route path="/leave-type" element={<LeaveTypeMaster />} /> */}
                <Route path="/employees" element={<EmployeeMaster />} />
                <Route path="/add-employee" element={<EmployeeForm />} />
                <Route path="/add-employee/:id" element={<EmployeeForm />} />

                <Route path="/profile/:username" element={<Profile />} />
                <Route path="/leaves" element={<Leave />} />
                <Route path="/add-leave" element={<AddLeave />} />
                <Route exact path="/update-department/:id" element={<DepartmentForm />} />
                <Route path="/profile" element={<Profile />} />
                {/* <Route path="/logout" element={<Logout />} /> */}

                <Route path="/leave-types" element={<LeaveTypeList />} />
                <Route path="/add-leave-type" element={<LeaveTypeForm />} />
                <Route path="/edit-leave-type/:id" element={<LeaveTypeForm />} />
                <Route path="/attendance" element={<AttendanceList />} />

            </Routes>
        </Router>
    );
}

export default App;
