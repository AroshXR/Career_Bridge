import jwt from 'jsonwebtoken';
import ResponseGenerator from '../utils/ResponseGenerator.js';
import User from '../Models/User.js';

const adminAuthMiddleware = async (req, res, next) => {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json(ResponseGenerator.sendError(ResponseGenerator.UNAUTHORIZED, 'No token, authorization denied', 'AUTH_ERROR'));
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        // Check database for role
        const user = await User.findById(req.user.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json(ResponseGenerator.sendError(ResponseGenerator.FORBIDDEN, 'Access denied. Admin role required.', 'AUTH_ERROR'));
        }

        // Attach full user object for admin routes
        req.adminUser = user;
        next();
    } catch (err) {
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json(ResponseGenerator.sendError(ResponseGenerator.UNAUTHORIZED, 'Token has expired. Please log in again.', 'TOKEN_EXPIRED'));
        }
        res.status(401).json(ResponseGenerator.sendError(ResponseGenerator.UNAUTHORIZED, 'Token is not valid', 'AUTH_ERROR'));
    }
};

export default adminAuthMiddleware;
