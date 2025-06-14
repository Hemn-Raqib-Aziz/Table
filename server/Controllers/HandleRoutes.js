import express from 'express';

// controllers
import fetchUsers from './Fetch.js';
import insertUsers from './Insert.js';
import updateUsers from './Update.js';
import deleteUsers from './Delete.js';

const router = express.Router();





// GET /users
router.get("/", fetchUsers);

// POST /users
router.post("/", insertUsers);


// PUT /users/:id
router.put("/:id", updateUsers);

// DELETE /users/:id
router.delete("/:id", deleteUsers);


export default router;