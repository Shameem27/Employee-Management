import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

export default function EditEmployeeForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [feedbackMessage, setFeedbackMessage] = useState('');

    // Fetch the employee details when the component loads
    useEffect(() => {
        axios.get(`http://localhost:3001/employee/${id}`)
            .then((response) => {
                const employee = response.data;
                // Format DateOfJoining to YYYY-MM-DD for the input field
                if (employee.DateOfJoining) {
                    employee.DateOfJoining = employee.DateOfJoining.split('T')[0];
                }
                setFormData(employee);
            })
            .catch((error) => {
                console.error('Error fetching employee:', error);
                setFeedbackMessage('Failed to load employee details');
            });
    }, [id]);

    // Validate the form before submission
    const validate = () => {
        const newErrors = {};
        if (!formData.EmployeeName) newErrors.EmployeeName = 'Employee Name is required';
        if (!formData.EmployeeID) newErrors.EmployeeID = 'Employee ID is required';
        if (!formData.EmployeeEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.EmployeeEmail)) {
            newErrors.EmployeeEmail = 'Valid Email is required';
        }
        if (!formData.PhoneNumber || formData.PhoneNumber.length !== 10) {
            newErrors.PhoneNumber = 'Phone Number must be 10 digits';
        }
        if (!formData.Department) newErrors.Department = 'Department is required';
        if (!formData.Role) newErrors.Role = 'Role is required';
        if (!formData.DateOfJoining) newErrors.DateOfJoining = 'Date of Joining is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle input field changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: '' }); // Clear error for the specific field
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            // Submit the form data
            await axios.put(`http://localhost:3001/employee/${id}`, formData);
            setFeedbackMessage('Employee updated successfully');
            navigate('/'); // Navigate to the Employee List page
        } catch (error) {
            console.error('Error updating employee:', error);
            setFeedbackMessage('Failed to update employee. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Edit Employee</h2>

            {/* Feedback Message */}
            {feedbackMessage && (
                <div style={{ marginBottom: '10px', color: feedbackMessage.includes('Failed') ? 'red' : 'green' }}>
                    {feedbackMessage}
                </div>
            )}

            {/* Form Fields */}
            <div>
                <label>
                    Employee Name:
                    <input
                        type="text"
                        name="EmployeeName"
                        value={formData.EmployeeName || ''}
                        onChange={handleChange}
                    />
                </label>
                {errors.EmployeeName && <span style={{ color: 'red' }}>{errors.EmployeeName}</span>}
            </div>

            <div>
                <label>
                    Employee ID:
                    <input
                        type="text"
                        name="EmployeeID"
                        value={formData.EmployeeID || ''}
                        onChange={handleChange}
                        readOnly // ID is usually not editable
                    />
                </label>
            </div>

            <div>
                <label>
                    Email:
                    <input
                        type="email"
                        name="EmployeeEmail"
                        value={formData.EmployeeEmail || ''}
                        onChange={handleChange}
                    />
                </label>
                {errors.EmployeeEmail && <span style={{ color: 'red' }}>{errors.EmployeeEmail}</span>}
            </div>

            <div>
                <label>
                    Phone Number:
                    <input
                        type="text"
                        name="PhoneNumber"
                        value={formData.PhoneNumber || ''}
                        onChange={handleChange}
                    />
                </label>
                {errors.PhoneNumber && <span style={{ color: 'red' }}>{errors.PhoneNumber}</span>}
            </div>

            <div>
                <label>
                    Department:
                    <input
                        type="text"
                        name="Department"
                        value={formData.Department || ''}
                        onChange={handleChange}
                    />
                </label>
                {errors.Department && <span style={{ color: 'red' }}>{errors.Department}</span>}
            </div>

            <div>
                <label>
                    Role:
                    <input
                        type="text"
                        name="Role"
                        value={formData.Role || ''}
                        onChange={handleChange}
                    />
                </label>
                {errors.Role && <span style={{ color: 'red' }}>{errors.Role}</span>}
            </div>

            <div>
                <label>
                    Date of Joining:
                    <input
                        type="date"
                        name="DateOfJoining"
                        value={formData.DateOfJoining || ''}
                        onChange={handleChange}
                    />
                </label>
                {errors.DateOfJoining && <span style={{ color: 'red' }}>{errors.DateOfJoining}</span>}
            </div>

            <button type="submit">Update</button>
        </form>
    );
}
