import jwt from 'jsonwebtoken';
import ResponseGenerator from '../utils/ResponseGenerator.js';

const authMiddleware = (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json(ResponseGenerator.sendError(ResponseGenerator.UNAUTHORIZED, 'No token, authorization denied', 'AUTH_ERROR'));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json(ResponseGenerator.sendError(ResponseGenerator.UNAUTHORIZED, 'Token has expired. Please log in again.', 'TOKEN_EXPIRED'));
        }
        res.status(401).json(ResponseGenerator.sendError(ResponseGenerator.UNAUTHORIZED, 'Token is not valid', 'AUTH_ERROR'));
    }
};

export default authMiddleware;