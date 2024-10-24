const pool = require('../config/db');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');


// Fetch user profile by ID
const getProfile = async (req, res) => {
    const userId = req.userId;  // Extracted from JWT token middleware
    console.log('User ID from token:', userId);

    const query = `
        SELECT f_name, l_name, email, phone_no, dob, gender, country, address
        FROM user_details
        WHERE user_id = ?
    `;
    try {
        const [result] = await pool.query(query, [userId]);
        console.log('Query result:', result);
        if (result.length === 0) {
            console.log('No user found for ID:', userId);
            return res.status(404).json({ error: 'User not found' });
        }
        console.log('Sending user data:', result[0]);
        res.json(result[0]);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Error fetching user profile' });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    const userId = req.userId;
    const { f_name, l_name, dob, gender, country, address } = req.body;

    const updateUserDetailsQuery = `
        UPDATE user_details
        SET f_name = ?, l_name = ?, dob = ?, gender = ?, country = ?, address = ?
        WHERE user_id = ?
    `;
    try {
        await pool.query(updateUserDetailsQuery, [f_name, l_name, email, phone_no, dob, gender, country, address, userId]);
        console.log('User profile updated:', userId);
        res.json({ message: 'Profile updated successfully' });
    } catch (err) {
        console.error('Error updating user_details:', err);
        res.status(500).json({ error: 'Error updating profile' });
    }
};

// Upload profile image
const uploadProfileImage = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const imagePath = `/uploads/${req.file.filename}`;

    try {
        // Update user's profile image in MySQL
        await pool.query('UPDATE user_regis SET profile_image_path = ? WHERE id = ?', [imagePath, req.userId]);

        // Get user email from MySQL
        const [userResult] = await pool.query('SELECT email FROM user_regis WHERE id = ?', [req.userId]);
        const userEmail = userResult[0]?.email;

        // Update profile image in MongoDB
        await User.findOneAndUpdate({ email: userEmail }, { profileImagePath: imagePath }, { upsert: true });

        res.json({
            message: 'Profile image uploaded successfully',
            imagePath: imagePath
        });
    } catch (error) {
        console.error('Error updating profile image:', error);
        res.status(500).json({ error: 'Failed to update profile image' });
    }
};

// Get profile image
const getProfileImage = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT email, profile_image_path FROM user_regis WHERE id = ?', [req.userId]);
        if (rows.length > 0) {
            const user = rows[0];
            if (user.profile_image_path) {
                res.json({ imagePath: user.profile_image_path });
            } else {
                const mongoUser = await User.findOne({ email: user.email });
                if (mongoUser && mongoUser.profileImagePath) {
                    res.json({ imagePath: mongoUser.profileImagePath });
                } else {
                    res.json({ imagePath: null });
                }
            }
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching profile image:', error);
        res.status(500).json({ error: 'Failed to fetch profile image' });
    }
};

// Route to handle account deletion request (with password confirmation)
const deleteAccount = async (req, res) => {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
        return res.status(400).json({ status: 'error', message: 'Email and password are required' });
    }

    try {
        // Fetch user details by email from the database
        const [userResult] = await pool.query('SELECT * FROM user_regis WHERE email = ?', [email]);

        if (userResult.length === 0) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        const user = userResult[0];

        // Compare the provided password with the hashed password in the database
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({ status: 'error', message: 'Incorrect password' });
        }

        // If the password matches, update the user's status to -1 (account marked for deletion)
        try {
            await pool.query('UPDATE user_regis SET status = -1 WHERE email = ?', [email]);
            res.status(200).json({ status: 'success', message: 'Account marked for deletion' });
        } catch (error) {
            console.error('Error updating user status:', error);
            res.status(500).json({ status: 'error', message: 'Error updating user status' });
        }
    } catch (err) {
        console.error('Error querying user:', err);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    }
};


module.exports = {
    getProfile,
    updateProfile,
    uploadProfileImage,
    getProfileImage,
    deleteAccount
};
