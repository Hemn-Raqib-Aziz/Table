// routes/users.js - Add this PUT route to your existing router

import express from 'express';
import con from '../DB/connection.js';
import { validationResult } from 'express-validator';
import { validateUserUpdate } from '../Validation/Update.js'

const router = express.Router();

// ... your existing routes ...

router.put("/:id", validateUserUpdate, async (req, res) => {
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
        
        const userId = req.params.id;
        const updates = req.body;
        // Remove id from updates if present
        delete updates.id;
        
        // Check if user exists first
        const userExists = await con.query('SELECT id FROM users WHERE id = $1', [userId]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // If no fields to update
        if (Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        
        // Build dynamic update query
        const setClause = Object.keys(updates)
            .map((key, index) => `${key} = $${index + 2}`)
            .join(', ');
        
        const values = [userId, ...Object.values(updates)];
        
        const updateQuery = `
            UPDATE users 
            SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
            WHERE id = $1 
            RETURNING *
        `;
        
        const result = await con.query(updateQuery, values);
        
        // Send back the updated user
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            user: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error updating user:', error);
        
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