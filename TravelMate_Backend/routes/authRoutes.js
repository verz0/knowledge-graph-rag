const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Validation middleware
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// Registration validation
const registerValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('travelInterests')
    .optional()
    .isArray()
    .withMessage('Travel interests must be an array'),
  body('travelStyle')
    .optional()
    .isIn(['adventure', 'relaxation', 'cultural', 'business', 'family'])
    .withMessage('Invalid travel style'),
  body('preferredBudget')
    .optional()
    .isIn(['budget', 'medium', 'luxury'])
    .withMessage('Invalid preferred budget')
];

// Login validation
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Profile update validation
const profileUpdateValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('travelInterests')
    .optional()
    .isArray()
    .withMessage('Travel interests must be an array'),
  body('travelStyle')
    .optional()
    .isIn(['adventure', 'relaxation', 'cultural', 'business', 'family'])
    .withMessage('Invalid travel style'),
  body('preferredBudget')
    .optional()
    .isIn(['budget', 'medium', 'luxury'])
    .withMessage('Invalid preferred budget')
];

// Password change validation
const passwordChangeValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
];

// Public routes
router.post('/register', registerValidation, validateRequest, authController.register);
router.post('/login', loginValidation, validateRequest, authController.login);

// Protected routes (require authentication)
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile', authenticateToken, profileUpdateValidation, validateRequest, authController.updateProfile);
router.post('/change-password', authenticateToken, passwordChangeValidation, validateRequest, authController.changePassword);
router.post('/verify-token', authenticateToken, authController.verifyToken);
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;
