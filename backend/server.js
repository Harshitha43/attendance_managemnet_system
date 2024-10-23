const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());



// PostgreSQL connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: '123456',
    port: 5433,
});

pool.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to PostgreSQL database');
});
var user;

//fetch attendence
app.get('/api/attendance', async (req, res) => {
    console.log("attendence---------------")
    try {

        const results = await pool.query(`
            SELECT * FROM attendances
        `);
        res.json(results.rows);
        console.log("res", results.rows)
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// Login route
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ msg: 'Please fill in all fields' });
    }

    try {
        const query = 'SELECT * FROM "public"."users" WHERE email = $1';
        const result = await pool.query(query, [email]);
        console.log('result', result.rows[0])

        if (result.rows.length === 0) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        user = result.rows[0];
        console.log('user', user)


        const isMatch = bcrypt.compare(password, user.password)
            .then(isMatch => {
                if (isMatch) {
                    console.log('Password matches');
                } else {
                    console.log('Password does not match');
                }
            })
            .catch(err => {
                console.error('Error during password comparison:', err);
            });

        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        res.status(200).json({
            userId: user.id,
            userName: user.employee_name,
            role: user.role,
            email: user.email,
            dept_id: user.dept_id,
            leave_balance: user.leave_bal,
            employee_name: user.employee_name,
            shift: user.shift

        });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ msg: 'Server error' });
    }

});


//Fetch all departments
app.get('/api/Departments', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM department ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fetch department by ID
app.get('/api/Department/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM department WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Department not found' });
        }
    } catch (err) {
        console.error('Error fetching department:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add or update department (use this for adding)
app.post('/api/add-department', async (req, res) => {
    const { department } = req.body;
    try {
        const insertQuery = 'INSERT INTO department (department) VALUES ($1)';
        await pool.query(insertQuery, [department]);
        res.json({ message: 'Department added successfully' });
    } catch (err) {
        console.error('Error adding department:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update department by ID (create this for updating)
app.post('/api/update-department/:id', async (req, res) => {
    const { id } = req.params;
    const { department } = req.body;
    try {
        const updateQuery = 'UPDATE department SET department = $1 WHERE id = $2';
        await pool.query(updateQuery, [department, id]);
        res.json({ message: 'Department updated successfully' });
    } catch (err) {
        console.error('Error updating department:', err);
        res.status(500).json({ error: 'Server error' });
    }
});




// Delete a department by ID
app.delete('/api/Departments/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM department WHERE id = $1', [id]);
        res.json({ message: 'Department deleted successfully' });
    } catch (err) {
        console.error('Error deleting department:', err);
        res.status(500).json({ error: 'Server error' });
    }
});



// Fetch all users
app.get('/api/users', async (req, res) => {
    try {
        const users = await pool.query('SELECT * FROM users ORDER BY id DESC');
        res.json(users.rows);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fetch user by ID
app.get('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Update user by ID
app.put('/api/users/:id', async (req, res) => {
    const { id } = req.params; // Get ID from URL
    const { employee_name, email, password, shift, dept_id, leave_bal } = req.body;

    try {
        await pool.query(
            `UPDATE users 
             SET employee_name = $1, email = $2, password = $3, dept_id = $4, shift = $5, leave_bal = $6 
             WHERE id = $7`,
            [employee_name, email, password, dept_id, shift, leave_bal, id]
        );
        res.json({ message: 'User updated' });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});



app.post('/api/users', async (req, res) => {
    const { employee_name, email, password, shift, dept_id, leave_bal, role } = req.body;

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert new user with the hashed password and role
        await pool.query(
            `INSERT INTO users (employee_name, email, password, dept_id, shift, leave_bal, role) 
             VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [employee_name, email, hashedPassword, dept_id, shift, leave_bal, role]
        );
        res.json({ message: 'User created' });
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Delete user by ID
app.delete('/api/users/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Server error' });
    }
});



// Get leave types
app.get('/api/leave-types', async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM leave_type ORDER BY id DESC');
        res.json(results.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});



//fetch leave type id
app.get('/api/leave-types/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT * FROM leave_type WHERE id = $1', [id]);

        if (result.rows.length > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Leave type not found' });
        }
    } catch (err) {
        console.error('Error fetching leave type:', err);
        res.status(500).json({ error: 'Server error' });
    }
});



// Delete a leave type
app.delete('/api/leave-types/:id', (req, res) => {
    const id = req.params.id;
    pool.query('DELETE FROM leave_type WHERE id = $1', [id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ message: 'Leave type deleted' });
    });
});


// Create or update a leave type
app.post('/api/leave-types', (req, res) => {
    console.log("add leave")
    const { id, leave_type } = req.body;

    if (id) {
        pool.query('UPDATE leave_type SET leave_type = $1 WHERE id = $2', [leave_type, id], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Leave type updated' });
        });
    } else {
        pool.query('INSERT INTO leave_type (leave_type) VALUES ($1)', [leave_type], (err) => {
            if (err) return res.status(500).json(err);
            res.json({ message: 'Leave type created' });
        });
    }
});



app.delete('/api/leave/:id', async (req, res) => {
    const { id } = req.params;
    console.log(`Deleting leave with ID: ${id}`);

    try {
        const result = await pool.query('DELETE FROM leave WHERE leave_id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Leave not found' });
        }
        res.status(200).json({ message: 'Leave deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});




// Fetch leave data
app.get('/api/leave', async (req, res) => {
    try {
        let query = `SELECT * FROM leave`;

        const results = await pool.query(query);
        res.status(200).json(results.rows);
    } catch (err) {
        console.error('Error fetching leave records:', err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Fetch leaves for a specific user
app.get('/api/leave/user/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Query to select leaves for a specific user
        const results = await pool.query(`SELECT * FROM leave WHERE employee_id = $1`, [userId]);
        res.status(200).json(results.rows);
    } catch (err) {
        console.error('Error fetching leave records for user:', err);
        res.status(500).json({ error: 'Server error' });
    }
});






// API endpoint to add a new leave
app.post('/api/leave', async (req, res) => {
    console.log("Request received");
    const { employeeId, employee_name, leaveFrom, leaveTo, leaveDescription } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO leave (employee_id, employee_name, leave_from, leave_to, leave_description, leave_status)
            VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
            [employeeId, employee_name, leaveFrom, leaveTo, leaveDescription, 1]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error adding leave:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




app.put('/api/leave/:id/status', async (req, res) => {
    console.log("update leave");
    const { id } = req.params;
    const { status } = req.body;

    // Validate the status
    const validStatuses = ['2', '3'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }

    try {
        // Fetch leave details to get employee ID, leave_from, and leave_to
        const leaveResult = await pool.query(
            `SELECT leave_id, employee_id, leave_from, leave_to FROM leave WHERE leave_id = $1`,
            [id]
        );
        const leave = leaveResult.rows[0];

        if (!leave) {
            return res.status(404).json({ error: 'Leave request not found' });
        }

        if (status == "2") {
            // Calculate the number of leave days
            const leaveFrom = new Date(leave.leave_from);
            const leaveTo = new Date(leave.leave_to);
            const leaveDays = Math.ceil((leaveTo - leaveFrom) / (1000 * 60 * 60 * 24)) + 1;

            // Fetch employee's current leave balance using employee_id from leave record
            const employeeResult = await pool.query(
                `SELECT leave_bal FROM users WHERE id = $1`,
                [leave.employee_id]
            );
            const currentLeaveBalance = employeeResult.rows[0]?.leave_bal;
            console.log('currentLeaveBalance', currentLeaveBalance)
            if (currentLeaveBalance < leaveDays) {
                return res.status(400).json({ error: 'Insufficient leave balance' });
            }

            const updatedLeaveBalance = currentLeaveBalance - leaveDays;
            console.log('updatedLeaveBalance', updatedLeaveBalance)
            await pool.query(
                `UPDATE users SET leave_bal = $1 WHERE id = $2`,
                [updatedLeaveBalance, leave.employee_id]
            );
        }

        // Update the leave status (approved, rejected, etc.)
        await pool.query(
            `UPDATE leave SET leave_status = $1 WHERE leave_id = $2`,
            [status, id]
        );


        // Fetch the updated leave data
        const updatedLeave = await pool.query(
            `SELECT leave_id, employee_id, leave_from, leave_to, leave_status FROM leave WHERE leave_id = $1`,
            [id]
        );

        res.json({ message: 'Leave status updated', leave: updatedLeave.rows[0] });
    } catch (error) {
        console.error('Error updating leave status and balance:', error);
        res.status(500).json({ error: 'Server error' });
    }
});


// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
