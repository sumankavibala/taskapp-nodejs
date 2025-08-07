// const express  = require('express');\
import express from 'express';
import dotenv from 'dotenv';
import taskRoutes from './src/routes/taskRoutes.js';
import loginRoutes from './src/routes/loginRoutes.js';
import {authenticateToken} from './middleware/authMiddleware.js';
import cors from 'cors';

dotenv.config();

const app = express();

app.use(cors())

app.use(express.json());
app.use('/tasks' ,authenticateToken, taskRoutes);
app.use('/login',loginRoutes);

const PORT = process.env.PORT || '3001';

app.listen(PORT, ()=>console.log(`server running on port ${PORT}`));

console.log(`app running on port ${PORT}`);