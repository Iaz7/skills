const isAuthenticated = (req, res, next, fromIsAdmin=false) => {
    if (req.session.user) {
        if (fromIsAdmin) return true;
        return next();
    } else {
        if (req.originalUrl === '/users/logout') return res.redirect('/users/login'); // Redirect to login page if user is logging out
        return res.redirect(`/users/login?redirect=${encodeURIComponent(req.originalUrl)}`);
    }
};

const isAdmin = (req, res, next) => {
    // Verificar que el usuario está autenticado
    if (!req.session.user) {
        return res.status(401).render('errors/401', { title: 'Unauthorized', message: 'You must be logged in to access this page', route: req.originalUrl });
    }

    // Verificar que el usuario autenticado tiene rol de admin
    if (req.session.user.admin) {
        return next(); // Permite el acceso al siguiente middleware o ruta
    } else {
        // Si el usuario no es admin, redirige a una página de acceso prohibido
        return res.status(403).render('errors/403', { title: 'Forbidden', message: 'You do not have permission to access this page', route: req.originalUrl });
    }
};

module.exports = { isAdmin, isAuthenticated };