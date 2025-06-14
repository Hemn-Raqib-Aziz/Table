// routes/users.js - Add this DELETE route to your existing router

import express from 'express';
import con from '../DB/connection.js';

const router = express.Router();

// ... your existing routes ...

router.delete("/:id", async (req, res) => {
    try {
        const userId = req.params.id;
        
        // Validate that ID is a number
        if (!userId || isNaN(parseInt(userId))) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID provided'
            });
        }
        
        // Check if user exists first
        const userExists = await con.query('SELECT id, name FROM users WHERE id = $1', [userId]);
        if (userExists.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Delete the user
        const deleteQuery = 'DELETE FROM users WHERE id = $1 RETURNING id, name';
        const result = await con.query(deleteQuery, [userId]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found or already deleted'
            });
        }
        
        // Send success response
        res.status(200).json({
            success: true,
            message: `User "${result.rows[0].name}" deleted successfully`,
            deletedUser: result.rows[0]
        });
        
    } catch (error) {
        console.error('Error deleting user:', error);
        
        // Handle foreign key constraint errors if you have related tables
        if (error.code === '23503') {
            return res.status(409).json({
                success: false,
                message: 'Cannot delete user as it is referenced by other records'
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