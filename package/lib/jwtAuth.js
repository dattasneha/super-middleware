const jwt = require('jsonwebtoken');

/**
 * Middleware to verify JWT token and authenticate the user.
 * Checks cookies or Authorization header.
 * 
 * @param {string} secret - JWT secret key
 * @param {function} getUser - Async function to fetch user by ID
 * @returns {function} Express middleware
 */
function jwtAuth(secret, getUser) {
    if (!secret) throw new Error('JWT secret is required');
    if (typeof getUser !== 'function') throw new Error('getUser callback is required');

    return async (req, res, next) => {
        try {
            // Extract token from cookies or Authorization header
            const token =
                req.cookies?.accessToken ||
                req.header("Authorization")?.replace("Bearer ", "");

            if (!token) {
                return res.status(401).json({ error: 'Missing token' });
            }

            // Verify the token
            const decodedToken = jwt.verify(token, secret);
            const userId = decodedToken?.id;

            // Fetch user from database
            const user = await getUser(userId);
            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            req.user = user;
            next();
        } catch (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expired' });
            }
            res.status(401).json({ error: 'Invalid token' });
        }
    };
}

module.exports = jwtAuth;
