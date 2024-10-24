const moment = require('moment');
const { pool } = require('../config/db'); // Destructure to import 'pool'

const checkUserInactivity = async (req, res, next) => {
    try {
        const ninetyDaysAgo = moment().subtract(90, 'days').format('YYYY-MM-DD HH:mm:ss');
        const query = 'UPDATE user_login SET status = 0 WHERE last_active < ? AND status = 1';
        
        const [results] = await pool.query(query, [ninetyDaysAgo]); // Use pool.query directly with mysql2/promise

        console.log('Inactivity check results:', results);
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Error checking user inactivity:', error);
        next(error); // Pass the error to the next middleware (error handler)
    }
};

module.exports = checkUserInactivity;
