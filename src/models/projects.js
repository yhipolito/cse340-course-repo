import db from './db.js'

const getAllProjects = async() => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o USING (organization_id)
        ORDER BY p.date ASC;
    `;

    const result = await db.query(query);

    return result.rows;
}

export {getAllProjects}
