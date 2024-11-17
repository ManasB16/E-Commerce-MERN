import Category from "../models/categoryModel.js";

const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.json({ error: "Invalid category" });
    }
    const category = await Category.findOne({ name });
    if (category) return res.json({ error: "Category already exists" });
    const newCategory = await Category.create({ name });
    res.json(newCategory);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
};

const updateCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    const { categoryId } = req.params;
    console.log(req.body, categoryId);

    if (!name) {
      return res.json({ error: "Invalid category" });
    }
    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );
    res.json(updatedCategory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const deletedCategory = await Category.findByIdAndDelete(categoryId);
    res.json(deletedCategory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const listCategories = async (req, res, next) => {
  try {
    const allCategories = await Category.find({});
    res.json(allCategories);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

const readCategory = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    const specificCategory = await Category.findById(categoryId);
    res.json(specificCategory);
  } catch (err) {
    console.log(err);
    res.status(500).json(err.message);
  }
};

export {
  createCategory,
  updateCategory,
  deleteCategory,
  listCategories,
  readCategory,
};
