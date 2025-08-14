/**
 * Role-based authorization middleware
 * @param {string[]} allowedRoles - Roles permitted to access the route
 * @returns {function} Middleware function
 */
function roleAuth(allowedRoles = []) {
  if (!Array.isArray(allowedRoles)) {
    throw new Error("roleAuth: allowedRoles must be an array of strings");
  }

  return (req, res, next) => {
    try {
      const user = req.user; // assumes authentication middleware has set req.user

      if (!user || !user.role) {
        return res.status(401).json({ error: "Unauthorized: No user role found" });
      }

      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ error: "Forbidden: Insufficient permissions" });
      }

      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = roleAuth;
