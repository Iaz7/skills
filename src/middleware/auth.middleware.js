const isAuthenticated = (req, res, next) => {
    if (req.session.user || req.user) return next();

    const redirectUrl = req.originalUrl !== '/users/logout' ? `/users/login?redirect=${encodeURIComponent(req.originalUrl)}` : '/users/login';
    return res.redirect(redirectUrl);
};

const isAdmin = (req, res, next) => {
    if (req.session.user?.admin || req.user?.admin) return next();

    return res.status(403).render('errors/403', { title: 'Forbidden', message: 'You do not have permission to access this page', route: req.originalUrl });
};

module.exports = { isAdmin, isAuthenticated };