import db from './db.js';

/**
 * Add a user as a volunteer to a project
 * @param {number} userId 
 * @param {number} projectId 
 * @returns {Promise<boolean>} True if added, false if already volunteering
 */
const addVolunteer = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING
        RETURNING *
    `;
    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`User ${userId} requested to volunteer for project ${projectId}`);
    }

    // Returns true if a row was inserted, false if ON CONFLICT was triggered
    return result.rows.length > 0;
};

/**
 * Remove a user from a project's volunteer list
 * @param {number} userId 
 * @param {number} projectId 
 * @returns {Promise<boolean>} True if removed, false if relationship didn't exist
 */
const removeVolunteer = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteer
        WHERE user_id = $1 AND project_id = $2
        RETURNING *
    `;
    const queryParams = [userId, projectId];
    const result = await db.query(query, queryParams);

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log(`User ${userId} requested removal from project ${projectId}`);
    }

    // Returns true if a row was deleted, false if nothing was matched
    return result.rows.length > 0;
};

/**
 * Retrieve all service projects a specific user has volunteered for
 * @param {number} userId 
 * @returns {Promise<Array>} List of project objects
 */
const getProjectsByUser = async (userId) => {
    const query = `
        SELECT sp.project_id, sp.title, sp.description, sp.location, sp.date, o.name AS organization_name
        FROM project_volunteer pv
        JOIN service_project sp ON pv.project_id = sp.project_id
        JOIN organization o ON sp.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.date ASC
    `;
    const queryParams = [userId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

export {
    addVolunteer,
    removeVolunteer,
    getProjectsByUser
};
