import express from 'express';
import {signUp, login} from '../controllers/loginController.js';

const router = express.Router();

router.post('/login',login);
router.post('/signup',signUp);

export default router;