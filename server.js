import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import { testConnection } from './src/models/db.js';
import { getAllOrganizations } from './src/models/organizations.js';
import { getAllProjects } from './src/models/projects.js';
import { getAllCategories } from './src/models/categories.js';

// Define the application environment
const NODE_ENV = process.env.NODE_ENV?.toLowerCase() || 'production';

// Define the port number the server will listen on
const PORT = process.env.PORT || 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

const app = express();

/**
  * Configure Express middleware
  */

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Tell Express where to find your templates
app.set('views', path.join(__dirname, 'src/views'));

// Middleware to log all incoming requests
app.use((req, res, next) => {
    if (NODE_ENV === 'development') {
        console.log(`${req.method} ${req.url}`);
    }
    next(); // Pass control to the next middleware or route
});

// Middleware to make NODE_ENV available to all templates
app.use((req, res, next) => {
    res.locals.NODE_ENV = NODE_ENV;
    next();
});

/**
 * Routes
 */
app.get('/', async (req, res) => {
    const title = 'Home';
    res.render('home', { title });
});

// use the getAllOrganizations function to get the list of organizations.
// this is a route handler.
app.get('/organizations', async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Our Partner Organizations';

    res.render('organizations', { title, organizations });
});

// Find this route in your server.js file and update it:
app.get('/projects', async (req, res) => {
    try {
        // 1. Fetch the data from your model
        const projects = await getAllProjects();
        const title = 'Service Projects';

        // 2. Pass the "projects" array variable into your EJS view
        res.render('projects', { title, projects });
    } catch (error) {
        console.error('Error loading projects view:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// use the getAllCategories function to get the list of categories.
// this is a route handler.
app.get('/categories', async (req, res) => {
    try {
        // 1. Fetch all categories from your database model
        const categories = await getAllCategories();
        const title = 'Categories';

        // 2. Pass the categories array into your categories.ejs view
        res.render('categories', { title, categories });
    } catch (error) {
        console.error('Error loading categories page:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

app.listen(PORT, async () => {
  try {
    await testConnection();
    console.log(`Server is running at http://127.0.0.1:${PORT}`);
    console.log(`Environment: ${NODE_ENV}`);
    // --- call getAllProjects() and display results to the console ---
    const projects = await getAllProjects();
    console.log('Verified Service Projects:', projects);
    // ------------------------------------------------
  } catch (error) {
    console.error('Error connecting to the database:', error);
  }
});