import React, { useState } from 'react';
import axios from 'axios';

export default function EmployeeForm() {
    const [formData, setFormData] = useState({
        EmployeeName: '',
        EmployeeID: '',
        EmployeeEmail: '',
        PhoneNumber: '',
        Department: '',
        DateOfJoining: '',
        Role: '',
    });

    const [errors, setErrors] = useState({});
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const validate = () => {
        const newErrors = {};
        if (!formData.EmployeeName) newErrors.EmployeeName = "Employee Name is required";
        if (!formData.EmployeeID) newErrors.EmployeeID = "Employee ID is required";
        if (!formData.EmployeeEmail) newErrors.EmployeeEmail = "Valid Email is required";
        if (!formData.PhoneNumber) {
            newErrors.PhoneNumber = "Phone Number is required";
        } else if (formData.PhoneNumber.length !== 10) {
            newErrors.PhoneNumber = "Phone Number must be at least 10 digits";
        }
        if (!formData.Department) newErrors.Department = "Department is required";
        if (!formData.DateOfJoining) newErrors.DateOfJoining = "Date of Joining is required";
        if (!formData.Role) newErrors.Role = "Role is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        console.log({
            EmployeeName: formData.EmployeeName,
            EmployeeID: formData.EmployeeID,
            EmployeeEmail: formData.EmployeeEmail,
            PhoneNumber: formData.PhoneNumber,
            Department: formData.Department,
            DateOfJoining: formData.DateOfJoining,
            Role: formData.Role
        });

        try {
            const response = await axios.post('http://localhost:3001/addEmployee', formData);
            setFeedbackMessage(response.data.message);
            setFormData({
                EmployeeName: '',
                EmployeeID: '',
                EmployeeEmail: '',
                PhoneNumber: '',
                Department: '',
                DateOfJoining: '',
                Role: '',
            });
            setErrors({});
        } catch (error) {
            setFeedbackMessage(error.response?.data?.message || 'Submission failed');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <br /><br />
            <label>
                Employee Name: <span style={{ color: 'red' }}>*</span>
                <input
                    type="text"
                    name="EmployeeName"
                    value={formData.EmployeeName}
                    onChange={handleChange}
                />
                {errors.EmployeeName && <div style={{ color: 'red' }}>{errors.EmployeeName}</div>}
            </label>
            <br />
            <br />

            <label>
                Employee ID: <span style={{ color: 'red' }}>*</span>
                <input
                    type="text"
                    name="EmployeeID"
                    value={formData.EmployeeID}
                    onChange={handleChange}
                />
                {errors.EmployeeID && <div style={{ color: 'red' }}>{errors.EmployeeID}</div>}
            </label>
            <br />
            <br />

            <label>
                Email: <span style={{ color: 'red' }}>*</span>
                <input
                    type="email"
                    name="EmployeeEmail"
                    value={formData.EmployeeEmail}
                    onChange={handleChange}
                />
                {errors.EmployeeEmail && <div style={{ color: 'red' }}>{errors.EmployeeEmail}</div>}
            </label>
            <br />
            <br />

            <label>
                Phone Number: <span style={{ color: 'red' }}>*</span>
                <input
                    type="number"
                    name="PhoneNumber"
                    value={formData.PhoneNumber}
                    onChange={handleChange}
                />
                {errors.PhoneNumber && <div style={{ color: 'red' }}>{errors.PhoneNumber}</div>}
            </label>
            <br />
            <br />

            <label>
                Department: <span style={{ color: 'red' }}>*</span>
                <select
                    name="Department"
                    value={formData.Department}
                    onChange={handleChange}
                >
                    <option value="">Select Department</option>
                    <option value="HR">HR</option>
                    <option value="Engineering">Engineering</option>
                    <option value="Marketing">Marketing</option>
                </select>
                {errors.Department && <div style={{ color: 'red' }}>{errors.Department}</div>}
            </label>
            <br />
            <br />

            <label>
                Date of Joining: <span style={{ color: 'red' }}>*</span>
                <input
                    type="date"
                    name="DateOfJoining"
                    value={formData.DateOfJoining}
                    onChange={handleChange}
                    max={new Date().toISOString().split('T')[0]}
                />
                {errors.DateOfJoining && <div style={{ color: 'red' }}>{errors.DateOfJoining}</div>}
            </label>
            <br />
            <br />

            <label>
                Role: <span style={{ color: 'red' }}>*</span>
                <input
                    type="text"
                    name="Role"
                    value={formData.Role}
                    onChange={handleChange}
                />
                {errors.Role && <div style={{ color: 'red' }}>{errors.Role}</div>}
            </label>
            <br />
            <br />

            <button type="submit">Submit</button>
            <button type="button" onClick={() => {
                setFormData({
                    EmployeeName: '',
                    EmployeeID: '',
                    EmployeeEmail: '',
                    PhoneNumber: '',
                    Department: '',
                    DateOfJoining: '',
                    Role: '',
                });
                setErrors({});
                setFeedbackMessage('');
            }} style={{ marginLeft: '10px' }}>
                Reset
            </button>

            <div style={{ marginTop: '10px', color: feedbackMessage.includes('success') ? 'green' : 'red' }}>
                {feedbackMessage}
            </div>
        </form>
    );
}
