import Users from '../models/user.model.js';

const authorize = (...roles) => {
    return async (req, res, next) => {
        try {
            const user = await Users.findById(req.id).select('role');
            if (!user) {
                return res.status(401).json({ msg: 'User not found', success: false });
            }
            if (!roles.includes(user.role)) {
                return res.status(403).json({ msg: 'Access denied. Insufficient permissions.', success: false });
            }
            req.role = user.role;
            next();
        } catch (err) {
            return res.status(500).json({ msg: 'Authorization check failed', success: false });
        }
    };
};

export default authorize;
