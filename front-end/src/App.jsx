import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import EditEmployeeForm from './components/EditEmployeeForm'; // Import the EditEmployeeForm
import './App.css';

function NavigationButtons() {
    const location = useLocation();
    return (
        <div className="navigation-buttons">
            {location.pathname !== '/' && (
                <Link to="/" className="nav-button">
                    View Employee List
                </Link>
            )}
            {location.pathname !== '/add-employee' && (
                <Link to="/add-employee" className="nav-button">
                    Add Employee
                </Link>
            )}
        </div>
    );
}

function App() {
    return (
        <Router>
            <div id="root">
                {/* Header */}
                <header>
                    <h1>Employee Management System</h1>
                </header>

                {/* Navigation */}
                <NavigationButtons />

                {/* Main Content */}
                <main>
                    <Routes>
                        <Route path="/" element={<EmployeeList />} />
                        <Route path="/add-employee" element={<EmployeeForm />} />
                        <Route path="/edit-employee/:id" element={<EditEmployeeForm />} /> {/* New Route */}
                    </Routes>
                </main>

                {/* Footer */}
                <footer>
                    <p>&copy; {new Date().getFullYear()} Employee Management System</p>
                </footer>
            </div>
        </Router>
    );
}

export default App;
