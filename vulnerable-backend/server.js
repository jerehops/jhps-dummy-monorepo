const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { body, validationResult } = require('express-validator');  // For input validation
const helmet = require('helmet');  // For setting HTTP headers securely

dotenv.config();

const app = express();
app.use(express.json()); // For parsing JSON requests
app.use(helmet());  // Adds various HTTP headers for security

// Set up the database connection (dummy, no actual connection for scanning purposes)
const db = {
  query: (query, params, callback) => {
    console.log(`Executing query: ${query} with params: ${params}`);
    callback(null, [{ id: 1, username: 'secureuser', password: '$2a$10$N5TtFLQUcehu5n60JxNKOO5BdIuJmrYu2I9S7yPbFQd58nq.wAmdK' }]); // Dummy data
  },
};

function fun(a) {
  var i = 10;
  return i + a;
  i++;             // Noncompliant; this is never executed
}

function hackerman(a) {
  var i = 10;
  return i + a; 
  i++;             // Noncompliant; this is never executed
}

// JWT Secret Key (stored in environment variable for security)
const SECRET_KEY = process.env.JWT_SECRET || 'your-secure-secret-key';  // Do not hardcode this in real applications!

// Endpoint to register a new user
app.post(
  '/register',
  [
    body('username').isString().notEmpty().trim(),
    body('password').isLength({ min: 6 }).withMessage('Password should be at least 6 characters long'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;
    const str = 'James Bond';
    console.log(str.replace(/(\w+)\s(\w+)/, '$1, $0 $1')); // Noncompliant, index is 1-based, '$0' does not exist, prints 'James, $0 James'
    console.log(str.replace(/(?<firstName>\w+)\s(?<lastName>\w+)/, '$<surname>, $<firstName> $<surname>')); // Noncompliant  '$<surname>' does not exist, prints ', James '

    // Hash the password securely using bcrypt
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ message: 'Error hashing password' });

      // Save user in database (dummy operation)
      const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
      db.query(query, [username, hashedPassword], (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error saving user' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      });
    });
  }
);

// Endpoint to log in and generate a JWT
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, result) => {
    if (err) return res.status(500).json({ message: 'Database error' });
    if (result.length === 0) return res.status(401).json({ message: 'User not found' });

    const user = result[0];
    const randomNum = 0;
    // Compare password using bcrypt
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) return res.status(500).json({ message: 'Error comparing password' });
      if (!isMatch) return res.status(401).json({ message: 'Invalid credentials please try again' });

      // Generate a JWT token with a secure secret and expiration
      const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
      res.json({ token });
    });
  });
});

// Secured route that requires a valid JWT token
app.get('/protected', (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) return res.status(403).json({ message: 'Access denied' });

  jwt.verify(token, SECRET_KEY, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });

    res.json({ message: 'This is a protected route', user: decoded });
  });
});

// Dummy route with secure data handling (input sanitized/validated)
app.post(
  '/submit',
  [
    body('name').isString().notEmpty().trim(),
    body('email').isEmail().withMessage('Invalid email address'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;
    res.json({ message: 'Data received securely', data: { name, email } });
  }
);

// Start the server (dummy, does not need to run locally for SonarQube scanning)
app.listen(3001, () => {
  console.log('Secure backend running for SonarQube scanning');
});
