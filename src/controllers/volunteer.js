import * as volunteerModel from '../models/volunteer.js';

/**
 * Process a request to join a project as a volunteer
 */
const processJoinProject = async (req, res) => {
    const { id } = req.params;
    const projectId = id;
    const userId = req.session?.user?.user_id;

    try {
        // Double check session safety
        if (!userId) {
            req.flash('error', 'You must be logged in to volunteer for projects.');
            return res.redirect('/login');
        }

        const success = await volunteerModel.addVolunteer(userId, projectId);

        if (success) {
            req.flash('success', '🎉 You have successfully volunteered for this project!');
        } else {
            req.flash('error', 'You are already registered as a volunteer for this project.');
        }

        if (res.locals.NODE_ENV === 'development') {
            console.log(`User ${userId} successfully joined project ${projectId}`);
        }

        // Redirect back to the specific project details page view
        res.redirect(`/project/${projectId}`);
    } catch (error) {
        console.error('Error adding project volunteer:', error);
        req.flash('error', 'An error occurred while signing up. Please try again.');
        res.redirect(`/projects/${projectId}`);
    }
};

/**
 * Process a request to leave a project / cancel volunteer registration
 */
const processLeaveProject = async (req, res) => {
    // 1. Read 'id' because your route is /project/:id
    const { id } = req.params; 
    const projectId = id; // This fixes the undefined variable!
    const userId = req.session?.user?.user_id;

    try {
        if (!userId) {
            req.flash('error', 'You must be logged in.');
            return res.redirect('/login');
        }

        // 2. Pass the correct variable to your database model
        const success = await volunteerModel.removeVolunteer(userId, projectId);

        if (success) {
            req.flash('success', 'You have removed yourself as a volunteer.');
        }

        if (res.locals.NODE_ENV === 'development') {
            console.log(`User ${userId} left project ${projectId}`);
        }

        // 3. Update the redirect path: your route is singular (/project/:id)
        // Redirects back to dashboard cleanly instead of forcing them to view the project details page
        res.redirect('/dashboard');

    } catch (error) {
        console.error('Error removing project volunteer:', error);
        req.flash('error', 'An error occurred.');
        res.redirect('/dashboard');
    }
};

export { 
    processJoinProject, 
    processLeaveProject 
};
