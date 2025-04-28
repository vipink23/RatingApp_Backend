const AutherisedRoles = (...allowedRoles) => {
    return (req, res, next) => {      
      if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: `Access Denied This Access only for ${req.user.role}` });
      }
      next();
    };
  };
  export default AutherisedRoles;
  