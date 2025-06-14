// Validation/Update.js (Server-side)
import { body } from 'express-validator';

// Validation middleware for updates - only validate fields that are being updated
export const validateUserUpdate = [
    body('name')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('age')
        .optional()
        .notEmpty()
        .withMessage('Age is required')
        .isInt({ min: 1, max: 120 })
        .withMessage('Age must be a number between 1 and 120'),
    
    body('country')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Country is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Country must be between 2 and 100 characters'),
    
    body('role')
        .optional()
        .trim()
        .notEmpty()
        .withMessage('Role is required')
        .isIn(['user', 'moderator', 'admin'])
        .withMessage('Invalid role. Must be user, moderator, or admin'),
    
    body('is_active')
        .optional()
        .isBoolean()
        .withMessage('is_active must be a boolean value')
];