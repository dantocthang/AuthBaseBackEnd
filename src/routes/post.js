import express from 'express';
import authenticateToken from '../utils/authenticateToken.js';

const router = express.Router();

router.get('/', authenticateToken, (req, res) => {
    res.json({ success: true, message: 'Authenticated', data: [{id: 1, name: 'Dac Nhan Tam'}] })
})

export default router