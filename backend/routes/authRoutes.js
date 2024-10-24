const express = require('express');
const { register, login, reactivate, verify_reactivation, getCountries, forgotPassword, verifyResetCode, resendResetCode, resetPassword } = require('../controllers/authController');
const router = express.Router();

// Route to fetch countries
router.get('/countries', getCountries);

router.post('/register', register);
router.post('/login', login);
router.post('/reactivate', reactivate);
router.post('/verify_reactivation', verify_reactivation);
router.post('/forgotPassword', forgotPassword);
router.post('/verifyResetCode', verifyResetCode);
router.post('/resendResetCode', resendResetCode);
router.post('/resetPassword', resetPassword);

module.exports = router;
