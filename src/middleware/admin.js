module.exports = {
  ensureAdmin: (req, res, next) => {
    if (req.session && req.session.studentId && req.session.isAdmin) return next();
    return res.status(403).send('Forbidden - admin only');
  }
};