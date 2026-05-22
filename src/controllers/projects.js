// Import any needed model functions
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';

// Configuration constants
const NUMBER_OF_UPCOMING_PROJECTS = 5;

// Define any controller functions
const showProjectsPage = async (req, res) => {
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};  

const showProjectDetailsPage = async (req, res) => {
    const id = req.params.id;
    const project = await getProjectDetails(id);
    const title = 'Project Details';

    res.render('project', { title, project });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };