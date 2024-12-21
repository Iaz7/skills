const isAuthenticated = (req, res, next, fromIsAdmin=false) => {
    if (req.session.user) {
        if (fromIsAdmin) return true;
        return next();
    } else {
        if (req.originalUrl === '/users/logout') return res.redirect('/users/login'); // Redirect to login page if user is logging out
        res.status(401).render('errors/401', { title: 'Unauthorized', message: 'You must be logged in to access this page', route: req.originalUrl });
    }
};

const isAdmin = (req, res, next) => {
    if (isAuthenticated(req, res, next, true) && req.session.user.admin) {
        return next();
    } else {
        res.status(403).render('errors/403', { title: 'Forbidden', message: 'You do not have permission to access this page', route: req.originalUrl });
    }
};

module.exports = { isAdmin, isAuthenticated };