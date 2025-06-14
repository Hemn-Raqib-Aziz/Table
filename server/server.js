import express from 'express';
import dotenv from 'dotenv'
import cors from 'cors';

// controllers handler
import HandleRoutes from './Controllers/HandleRoutes.js';

dotenv.config();

const app =express();
const PORT = 3000;
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json()); 



app.use("/users", HandleRoutes);







app.listen(PORT, () => {console.log(`The Server Running on port: ${PORT}`)});