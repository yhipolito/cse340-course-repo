// Import any needed model functions
import { 
    getAllCategories, 
    getCategoryById, 
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory,
    getProjectsByCategoryId 
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};  

const showCategoryDetailsPage = async (req, res) => {
    const id = req.params.id;
    const category = await getCategoryById(id);
    const projects = await getProjectsByCategoryId(id);
    const title = category ? `${category.name} Projects` : 'Category Not Found';

    res.render('category-details', { title, category, projects });
};

const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', { title, projectId, projectDetails, categories, assignedCategories });
};

const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;
    const selectedCategoryIds = req.body.categoryIds || [];
    
    // Ensure selectedCategoryIds is an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds) ? selectedCategoryIds : [selectedCategoryIds];
    await updateCategoryAssignments(projectId, categoryIdsArray);
    req.flash('success', 'Categories updated successfully.');
    res.redirect(`/project/${projectId}`);
};

/**
 * GET: Display the empty create category form
 */
const showNewCategoryForm = async (req, res, next) => {
    res.render('new-category', {
        title: 'Create New Category'
    });
};

const categoryValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Category name is required.')
        .isLength({ min: 3 }).withMessage('Category name must be at least 3 characters long.')
        .isLength({ max: 100 }).withMessage('Category name cannot exceed 100 characters.')
];

/**
 * POST: Process the submitted new category data
 */
const processNewCategoryForm = async (req, res) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/new-category');
    }
    
    const { name } = req.body;

    // Execute the model insert function
    await createCategory(name);
    
    // Set a success flash message (centered NHK popup)
    req.flash('success', 'Category created successfully!');

    // Redirect the user to the complete categories listing page
    res.redirect('/categories');
};

/**
 * GET: Display the edit category form pre-populated with existing data
 */
const showEditCategoryForm = async (req, res, next) => {
    const categoryId = req.params.id;

    // Fetch the single category details by ID
    const category = await getCategoryById(categoryId);

    // If the category doesn't exist, pass a 404 error to the global handler
    if (!category) {
        const err = new Error('Category Not Found');
        err.status = 404;
        return next(err);
    }

    // Render the edit form view, passing the current category details
    res.render('edit-category', {
        title: `Edit ${category.name}`,
        category: category
    });
};

/**
 * POST: Process the submitted edit category data
 */
const processEditCategoryForm = async (req, res, next) => {
    // Check for validation errors
    const results = validationResult(req);
    if (!results.isEmpty()) {
        // Validation failed - loop through errors
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the edit category form
        return res.redirect('/edit-category/' + req.params.id);
    }
    
    const categoryId = req.params.id;
    const { name } = req.body;

    try {
        // Execute the model update function
        await updateCategory(categoryId, name);
        
        // Set a success flash message (centered NHK popup)
        req.flash('success', 'Category updated successfully!');

        // Redirect the user to the single category details page
        res.redirect(`/category/${categoryId}`);
    } catch (error) {
        console.error('Error updating category:', error);
        req.flash('error', 'There was an error updating the category.');
        res.redirect('/edit-category/' + categoryId);
    }
};


// Export any controller functions
export { 
    showCategoriesPage,
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm,
    categoryValidation
};
