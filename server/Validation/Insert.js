import { body } from 'express-validator';


// Validation middleware
export const validateUser = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Name must be between 2 and 100 characters'),
    
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('age')
        .notEmpty()
        .withMessage('Age is required')
        .isInt({ min: 1, max: 120 })
        .withMessage('Age must be a number between 1 and 120'),
    
    body('country')
        .trim()
        .notEmpty()
        .withMessage('Country is required')
        .isLength({ min: 2, max: 100 })
        .withMessage('Country must be between 2 and 100 characters'),
    
    body('role')
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

