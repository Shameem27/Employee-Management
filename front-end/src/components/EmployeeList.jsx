import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function EmployeeList() {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredEmployees, setFilteredEmployees] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        // Fetch employees when the component mounts
        axios.get('http://localhost:3001/employees')
            .then((response) => {
                setEmployees(response.data);
                setFilteredEmployees(response.data); // Set initial filtered employees
                setError('');
            })
            .catch((err) => {
                console.error('Error fetching employee data:', err);
                setError('Failed to fetch employees');
            })
            .finally(() => setIsLoading(false));
    }, []);

    useEffect(() => {
        // Filter employees when the search term changes
        setFilteredEmployees(
            employees.filter(
                (employee) =>
                    employee.EmployeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.EmployeeID.toString().includes(searchTerm) ||
                    employee.EmployeeEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    employee.Department?.toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [searchTerm, employees]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this employee?')) {
            axios.delete(`http://localhost:3001/employee/${id}`)
                .then(() => {
                    setEmployees(employees.filter((employee) => employee.EmployeeID !== id));
                    setFilteredEmployees(filteredEmployees.filter((employee) => employee.EmployeeID !== id));
                    alert('Employee deleted successfully');
                })
                .catch((err) => {
                    console.error('Error deleting employee:', err);
                    alert('Failed to delete employee');
                });
        }
    };

    return (
        <div>
            <h2>Employee List</h2>

            {/* Search Input */}
            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by Employee ID, Name, Email, or Department"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{
                        padding: '10px',
                        width: '400px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                    }}
                />
            </div>

            {/* Loading State */}
            {isLoading && <div>Loading employees...</div>}

            {/* Error Message */}
            {error && <div style={{ color: 'red' }}>{error}</div>}

            {/* Employee Table */}
            {!isLoading && !error && filteredEmployees.length > 0 ? (
                <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                    <thead>
                        <tr>
                            <th>Employee ID</th>
                            <th>Employee Name</th>
                            <th>Employee Email</th>
                            <th>Phone Number</th>
                            <th>Department</th>
                            <th>Date of Joining</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee) => (
                            <tr key={employee.EmployeeID}>
                                <td>{employee.EmployeeID}</td>
                                <td>{employee.EmployeeName}</td>
                                <td>{employee.EmployeeEmail || 'N/A'}</td>
                                <td>{employee.PhoneNumber}</td>
                                <td>{employee.Department}</td>
                                <td>{employee.DateOfJoining?.split('T')[0] || 'N/A'}</td>
                                <td>{employee.Role}</td>
                                <td>
                                    <button
                                        onClick={() => navigate(`/edit-employee/${employee.EmployeeID}`)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(employee.EmployeeID)}
                                        style={{ color: 'red' }}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                !isLoading &&
                !error && <div>No employees found</div>
            )}
        </div>
    );
}
