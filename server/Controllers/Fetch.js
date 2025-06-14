import express from 'express';
import con from '../DB/connection.js';

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { sortBy, sortDirection, groupBy } = req.query;
        
        let fetchQuery = `SELECT * FROM users`;
        
        // Add grouping (ORDER BY for grouping effect)
        if (groupBy && ['country', 'role', 'is_active'].includes(groupBy)) {
            fetchQuery += ` ORDER BY ${groupBy}`;
            
            // Add secondary sorting if both groupBy and sortBy are provided
            if (sortBy && ['id', 'name', 'age', 'email', 'created_at', 'updated_at'].includes(sortBy)) {
                const direction = sortDirection === 'desc' ? 'DESC' : 'ASC';
                fetchQuery += `, ${sortBy} ${direction}`;
            }
        } else if (sortBy && ['id', 'name', 'age', 'email', 'created_at', 'updated_at'].includes(sortBy)) {
            // Add sorting if only sortBy parameters are provided
            const direction = sortDirection === 'desc' ? 'DESC' : 'ASC';
            fetchQuery += ` ORDER BY ${sortBy} ${direction}`;
        }
        
        console.log('Executing query:', fetchQuery); // For debugging
        
        const result = await con.query(fetchQuery);
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;