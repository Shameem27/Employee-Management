const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL database!');
});

// API Routes

// Add a new employee
app.post('/addEmployee', (req, res) => {
    const { EmployeeID, EmployeeName, EmployeeEmail, PhoneNumber, Department, DateOfJoining, Role } = req.body;

    // Check for duplicate EmployeeID or EmployeeEmail
    db.query(
        'SELECT * FROM Employees WHERE EmployeeID = ? OR EmployeeEmail = ?',
        [EmployeeID, EmployeeEmail],
        (err, results) => {
            if (err) {
                console.error('Error querying database:', err);
                res.status(500).json({ error: 'Database error', details: err.message });
                return;
            }
            if (results.length > 0) {
                res.status(400).json({ message: 'Employee ID or Email already exists' });
                return;
            }

            // If no duplicate, insert the new employee
            const query = `
                INSERT INTO Employees (EmployeeID, EmployeeName, EmployeeEmail, PhoneNumber, Department, DateOfJoining, Role)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `;

            db.query(
                query,
                [EmployeeID, EmployeeName, EmployeeEmail, PhoneNumber, Department, DateOfJoining, Role],
                (err, result) => {
                    if (err) {
                        console.error('Error inserting employee:', err);
                        res.status(500).json({ error: 'Database error', details: err.message });
                        return;
                    }
                    res.status(201).json({ message: 'Employee added successfully!' });
                }
            );
        }
    );
});

// Fetch all employees
app.get('/employees', (req, res) => {
    db.query('SELECT * FROM Employees', (err, results) => {
        if (err) {
            console.error('Error fetching employees:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }
        res.status(200).json(results);
    });
});

// Fetch a specific employee by ID
app.get('/employee/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM Employees WHERE EmployeeID = ?', [id], (err, results) => {
        if (err) {
            console.error('Error fetching employee:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }
        if (results.length === 0) {
            res.status(404).json({ message: 'Employee not found' });
        } else {
            res.status(200).json(results[0]);
        }
    });
});

// Update an employee's details
app.put('/employee/:id', (req, res) => {
    const { id } = req.params;
    const updatedData = req.body;

    db.query(
        'UPDATE Employees SET ? WHERE EmployeeID = ?',
        [updatedData, id],
        (err, result) => {
            if (err) {
                console.error('Error updating employee:', err);
                res.status(500).json({ error: 'Database error', details: err.message });
                return;
            }
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Employee not found' });
            } else {
                res.status(200).json({ message: 'Employee updated successfully' });
            }
        }
    );
});

// Delete an employee
app.delete('/employee/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM Employees WHERE EmployeeID = ?', [id], (err, result) => {
        if (err) {
            console.error('Error deleting employee:', err);
            res.status(500).json({ error: 'Database error', details: err.message });
            return;
        }
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Employee not found' });
        } else {
            res.status(200).json({ message: 'Employee deleted successfully' });
        }
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
