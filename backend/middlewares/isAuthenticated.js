import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ msg: 'Unauthorized' })
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (!decoded) {
            return res.status(401).json({
                msg: 'Invalid Token',
                success: false
            })
        }
        req.id = decoded.userId;
        next();

    } catch (err) {
        return res.status(500).json({ msg: err.message })
    }
}

export default isAuthenticated;