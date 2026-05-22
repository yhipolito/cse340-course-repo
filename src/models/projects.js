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

const getProjectsByOrganizationId = async (organizationId) => {
      const query = `
        SELECT
          project_id,
          organization_id,
          title,
          description,
          location,
          date
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY date;
      `;
      
      const queryParams = [organizationId];
      const result = await db.query(query, queryParams);

      return result.rows;
};

const getUpcomingProjects = async (number_of_projects) => {
    const currentDate = new Date().toISOString().split('T');

    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o USING (organization_id)
        WHERE p.date >= $1
        ORDER BY p.date ASC
        LIMIT $2;
    `;

    const result = await db.query(query, [currentDate, number_of_projects]);

    return result.rows;
};

const getProjectDetails = async (id) => {
    const query = `
        SELECT 
            p.project_id,
            p.title,
            p.description,
            p.location,
            p.date,
            p.organization_id,
            o.name AS organization_name
        FROM public.service_project p
        JOIN public.organization o USING (organization_id)
        WHERE p.project_id = $1;
    `;

    const result = await db.query(query, [id]);

    // Return the single project object if found, otherwise return null
    return result.rows.length > 0 ? result.rows[0] : null;
};

// Export the model functions
export { getAllProjects, 
  getProjectsByOrganizationId, 
  getUpcomingProjects, 
  getProjectDetails 
};

