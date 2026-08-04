const Category = require("../models/category.model");


// CREATE CATEGORY
const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }


    const existingCategory = await Category.findOne({
      name: name.trim(),
    });


    if (existingCategory) {
      return res.status(400).json({
        success: false,
        message: "Category already exists",
      });
    }


    const category = await Category.create({
      name: name.trim(),
    });


    res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: category,
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });

  }
};



// GET ALL CATEGORIES
const getCategories = async (req, res) => {
  try {

    const categories = await Category.find()
      .sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });

  }
};



// GET SINGLE CATEGORY
const getCategoryById = async (req, res) => {
  try {

    const category = await Category.findById(req.params.id);


    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }


    res.status(200).json({
      success: true,
      data: category,
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch category",
      error: error.message,
    });

  }
};



// UPDATE CATEGORY
const updateCategory = async (req, res) => {
  try {

    const { name } = req.body;


    const category = await Category.findById(
      req.params.id
    );


    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }


    category.name = name || category.name;


    await category.save();


    res.status(200).json({
      success: true,
      message: "Category updated successfully",
      data: category,
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to update category",
      error: error.message,
    });

  }
};



// DELETE CATEGORY
const deleteCategory = async (req, res) => {
  try {


    const category = await Category.findById(
      req.params.id
    );


    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }


    await category.deleteOne();


    res.status(200).json({
      success: true,
      message: "Category deleted successfully",
    });


  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to delete category",
      error: error.message,
    });

  }
};



module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};