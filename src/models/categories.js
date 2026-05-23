import db from './db.js'

const getAllCategories = async() => {
    const query = `
        SELECT category_id, name
        FROM public.category
        ORDER BY name ASC;
    `;

    const result = await db.query(query);

    return result.rows;
}

// Retrieve a single category by its ID.
const getCategoryById = async (categoryId) => {
    const query = `
        SELECT 
            category_id,
            name
        FROM public.category
        WHERE category_id = $1;
    `;

    const result = await db.query(query, [categoryId]);

    // Return the single category object if found, otherwise return null
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Retrieve all categories for a given service project.
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT 
            c.category_id,
            c.name
        FROM public.project_category pc
        JOIN public.category c USING (category_id)
        WHERE pc.project_id = $1
        ORDER BY c.name ASC;
    `;

    const result = await db.query(query, [projectId]);

    return result.rows;
};

// Retrieve all service projects for a given category.
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name
        FROM public.project_category pc
        JOIN public.service_project p USING (project_id)
        JOIN public.organization o USING (organization_id)
        WHERE pc.category_id = $1
        ORDER BY p.date ASC;
    `;

    const result = await db.query(query, [categoryId]);

    return result.rows;
};

export { 
    getAllCategories,
    getCategoryById, 
    getCategoriesByProjectId, 
    getProjectsByCategoryId 
};

