import bcrypt from 'bcrypt';
import { 
    createUser, 
    authenticateUser,
    getAllUsersWithRoles 
} from '../models/users.js';

const showUserRegistrationForm = (req, res) => {
    res.render('register', { title: 'Register' });
};

const processUserRegistrationForm = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Hash the password before storing it
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create the user in the database
        const userId = await createUser(name, email, passwordHash);

        // Redirect to the home page after successful registration
        req.flash('success', 'Registration successful! Please log in.');
        res.redirect('/');
    } catch (error) {
        console.error('Error registering user:', error);
        req.flash('error', 'An error occurred during registration. Please try again.');
        res.redirect('/register');
    }
};

const showLoginForm = (req, res) => {
    res.render('login', { title: 'Login' });
};

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await authenticateUser(email, password);
        if (user) {
            // Store user info in session
            req.session.user = user;
            req.flash('success', 'Login successful!');

            if (res.locals.NODE_ENV === 'development') {
                console.log('User logged in:', user);
            }

            res.redirect('/dashboard');
        } else {
            req.flash('error', 'Invalid email or password.');
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error during login:', error);
        req.flash('error', 'An error occurred during login. Please try again.');
        res.redirect('/login');
    }
};

const processLogout = async (req, res, next) => {
    try {
        // 1. Explicitly clear any lingering flash data first
        if (req.flash) {
            req.flash('success');
            req.flash('error');
        }

        // 2. Completely wipe out the session container on the server
        req.session.destroy((err) => {
            if (err) {
                console.error('Error destroying session during logout:', err);
                return next(err);
            }

            // 3. Force the user's browser to instantly delete its session cookie
            res.clearCookie('connect.sid', { path: '/' });

            // 4. Redirect cleanly (use a query parameter if you still want a message)
            // Example: res.redirect('/login?logout=success');
            res.redirect('/login');
        });
    } catch (error) {
        console.error('Error during logout process:', error);
        res.redirect('/login');
    }
};

const requireLogin = (req, res, next) => {
    if (!req.session || !req.session.user) {
        req.flash('error', 'You must be logged in to access that page.');
        return res.redirect('/login');
    }
    next();
};

// 1. Show Dashboard Controller
const showDashboard = (req, res) => {
    // Pass the user object so the view can check if they are an admin
    res.render('dashboard', { 
        title: 'Dashboard', 
        user: req.session.user 
    });
};

/**
 * Middleware factory to require specific role for route access
 * Returns middleware that checks if user has the required role
 * 
 * @param {string} role - The role name required (e.g., 'admin', 'user')
 * @returns {Function} Express middleware function
 */
const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }

        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/dashboard');
        }

        // User has required role, continue
        next();
    };
};

// 2. Show All Users Controller (Admin Only)
const showAllUsers = async (req, res, next) => {
    try {
        // Fetch users from the database model
        const usersList = await getAllUsersWithRoles();
        
        // Render the users.ejs template view
        res.render('users', { 
            title: 'Registered Users', 
            users: usersList 
        });
    } catch (error) {
        console.error('Error fetching users for admin view:', error);
        req.flash('error', 'Unable to load the users directory.');
        res.redirect('/dashboard');
    }
};

export { 
    showUserRegistrationForm, 
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showAllUsers
};