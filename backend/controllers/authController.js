const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const transporter = require('../config/mailer');
const crypto = require('crypto');
const moment = require('moment');
const axios = require('axios');

let resetCodes = {};

const secretKey = process.env.JWT_SECRET;
const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY

async function verifyRecaptcha(token) {
    const url = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${token}`;

    try {
        const response = await axios.post(url);
        console.log('reCAPTCHA Verification Response:', response.data);
        return response.data.success;
    } catch (error) {
        console.error('Error verifying reCAPTCHA:', error);
        return false;
    }
}

// Fetch countries from the database
const getCountries = (req, res) => {
    pool.query('SELECT country_code AS code, name FROM countries', (err, results) => {
        if (err) {
            console.error('Error fetching countries:', err);
            return res.status(500).json({ error: 'Error fetching countries' });
        }
        console.log('Fetched countries:', results); // Log results for debugging
        res.json(results);
    });
};

const register = async (req, res) => {
    const { f_name, l_name, email, phone_no, dob, gender, country, address, pass } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        const [existingUsers] = await connection.query(
            'SELECT email, phone_no FROM user_regis WHERE email = ? OR phone_no = ?',
            [email, phone_no]
        );

        if (existingUsers.length > 0) {
            if (existingUsers[0].email === email) {
                return res.status(400).json({ error: 'Email already exists' });
            }
            if (existingUsers[0].phone_no === phone_no) {
                return res.status(400).json({ error: 'Phone number already exists' });
            }
        }

        const hashedPassword = await bcrypt.hash(pass, 10);
        const user = { f_name, l_name, email, phone_no, dob, gender, country, address, pass: hashedPassword };
        await connection.query('INSERT INTO user_regis SET ?', user);
        await connection.commit();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error in registration:', error);
        res.status(500).json({ error: 'Error registering user' });
    }
};

const login = async (req, res) => {
    const { email, pass } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM user_login WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(pass, user.pass);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        if (user.status === 1) {
            const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
            await pool.query('UPDATE user_login SET last_active = NOW() WHERE id = ?', [user.id]);
            return res.json({ token, redirect: '/dashboard.html' });
        } else if (user.status === -1) {
            return res.status(403).json({ error: 'Account has been deleted' });
        } else if (user.status === 0) {
            return res.json({ error: 'Account is deactivated', redirect: '/reactivate.html' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Database error' });
    }
};

//Forgot Password
const forgotPassword = (req, res) => {
    const { email } = req.body;
  
    pool.query('SELECT * FROM user_regis WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Error fetching user');
        }
  
        if (results.length === 0) {
            return res.status(404).send('Email not found');
        }
  
        const resetCode = Math.floor(1000 + Math.random() * 9000).toString();
        resetCodes[email] = resetCode;
  
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${resetCode}`
        };
  
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).send('Error sending email');
            }
  
            setTimeout(() => {
                delete resetCodes[email];
            }, 120000); // Code is valid for 2 minutes
  
            res.status(200).send('Password reset code sent');
        });
    });
};

//Verify Reset Code
const verifyResetCode = (req, res) => {
    const { email, code } = req.body;
  
    if (resetCodes[email] && resetCodes[email] === code) {
        const token = jwt.sign({ email }, secretKey, { expiresIn: '15m' });
        res.status(200).json({ token });
    } else {
        res.status(400).send('Invalid or expired reset code');
    }
};

//Resend Reset Code
const resendResetCode = (req, res) => {
    const { email } = req.body;
  
    pool.query('SELECT * FROM user_regis WHERE email = ?', [email], (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Error fetching user');
        }
  
        if (results.length === 0) {
            return res.status(404).send('Email not found');
        }
  
        const resetCode = crypto.randomBytes(4).toString('hex');
        resetCodes[email] = resetCode;
  
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Code',
            text: `Your password reset code is: ${resetCode}`
        };
  
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Error sending email:', err);
                return res.status(500).send('Error sending email');
            }
  
            setTimeout(() => {
                delete resetCodes[email];
            }, 120000);                 // Code is valid for 2 minutes
  
            res.status(200).send('Password reset code resent');
        });
    });
};

//Reset Password
const resetPassword = async (req, res) => {
    const { token, newPassword, confirmNewPassword } = req.body;
  
    if (newPassword !== confirmNewPassword) {
        return res.status(400).send('New Password and Confirm New Password do not match');
    }
  
    try {
        const decoded = jwt.verify(token, secretKey);
        const email = decoded.email;
  
        pool.query('SELECT * FROM user_login WHERE email = ?', [email], async (err, results) => {
            if (err) {
                console.error('Error fetching user:', err);
                return res.status(500).send('Error fetching user');
            }
  
            if (results.length === 0) {
                return res.status(404).send('User not found');
            }
  
            const user = results[0];
            if (user.reset_counter >= 5) {
                return res.status(403).send('Password reset limit reached');
            }
  
            const { pass, l_pass1, l_pass2, l_pass3 } = user;
            if ([pass, l_pass1, l_pass2, l_pass3].includes(newPassword)) {
                return res.status(400).send('New password cannot be one of the last three passwords');
            }
  
            // Update password and history
            pool.query(
                'UPDATE user_login SET l_pass3 = l_pass2, l_pass2 = l_pass1, l_pass1 = pass, pass = ?, reset_counter = reset_counter + 1 WHERE email = ?',
                [newPassword, email], 
                (err) => {
                    if (err) {
                        console.error('Error updating password:', err);
                        return res.status(500).send('Error updating password');
                    }
                    res.status(200).send('Password reset successfully');
                }
            );
        });
    } catch (err) {
        console.error('Token verification error:', err);
        res.status(400).send('Invalid or expired token');
    }
};

const reactivate = async (req, res) => {
    const { email, pass } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM user_regis WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        const user = users[0];
        const isMatch = await bcrypt.compare(pass, user.pass);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        if (user.status !== 0) {
            return res.status(400).json({ error: 'Account is not deactivated' });
        }
        
        const verificationCode = crypto.randomBytes(3).toString('hex');
        resetCodes[email] = verificationCode;
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Account Reactivation Verification Code',
            text: `Your account reactivation verification code is: ${verificationCode}`
        };
        await transporter.sendMail(mailOptions);
        res.json({ message: 'Verification code sent to email' });
    } catch (error) {
        console.error('Error in reactivation:', error);
        res.status(500).json({ error: 'Error processing reactivation request' });
    }
};

// Verify Reactivation Code Route
const verify_reactivation = async (req, res) => {
    const { email, code } = req.body;
    if (resetCodes[email] === code) {
        try {
            await pool.query('UPDATE user_regis SET status = 1 WHERE email = ?', [email]);
            delete resetCodes[email];
            res.json({ message: 'Account reactivated successfully', redirect: '/login.html' });
        } catch (error) {
            console.error('Error updating user status:', error);
            res.status(500).json({ error: 'Error updating user status' });
        }
    } else {
        res.status(400).json({ error: 'Invalid or expired verification code' });
    }
};
module.exports = {
    getCountries,
    register,
    login,
    reactivate,
    verify_reactivation,
    forgotPassword,
    verifyResetCode,
    resendResetCode,
    resetPassword
};
