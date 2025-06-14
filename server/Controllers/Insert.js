import express from 'express';
import con from '../DB/connection.js';
import { validationResult } from 'express-validator';
import { validateUser } from '../Validation/Insert.js'

const router = express.Router();



router.post("/", validateUser, async (req, res) => {
    try {
        // Check for validation errors
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            // Format errors to match your client-side structure
            const formattedErrors = {};
            errors.array().forEach(error => {
                formattedErrors[error.path] = error.msg;
            });
            
            return res.status(400).json({ 
                success: false,
                message: 'Validation failed',
                errors: formattedErrors
            });
        }
        
        const { name, email, age, country, role, is_active = true } = req.body;
        
        const insertQuery = `INSERT INTO users (name, email, age, country, role, is_active) 
                            VALUES($1, $2, $3, $4, $5, $6) 
                            RETURNING *`;
        
        const result = await con.query(insertQuery, [name, email, age, country, role, is_active]);
        
        // Send back the created user
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error inserting user:', error);
        
        // Handle specific database errors
        if (error.code === '23505') { // Unique constraint violation
            return res.status(409).json({ 
                success: false,
                message: 'Email already exists',
                errors: {
                    email: 'This email is already registered'
                }
            });
        }
        
        res.status(500).json({ 
            success: false,
            message: 'Internal server error',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
        });
    }
});

export default router;