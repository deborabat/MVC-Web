module.exports = {
  ensureAdmin: (req, res, next) => {
    if (req.session && req.session.studentId && req.session.isAdmin) return next();
    // opcional: redirecionar para /login ou mostrar 403
    return res.status(403).send('Forbidden - admin only');
  }
};