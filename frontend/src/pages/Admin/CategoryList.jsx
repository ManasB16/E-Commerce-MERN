import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchAllCategoriesQuery,
} from "../../ReduxToolkit/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../Components/CategoryForm";
import Modal from "../../Components/Modal";

const CategoryList = () => {
  const [name, setName] = useState("");
  const [updatingName, setUpdatingName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { data: categories } = useFetchAllCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const handleCreateCategory = async (e) => {
    e.preventDefault();

    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      if (result.error) {
        toast.error(result.error);
      } else {
        setName("");
        toast.success(`${result.name} is created.`);
      }
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();

    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      console.log(updatingName);

      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updateCategory: {
          name: updatingName,
        },
      }).unwrap();

      if (result.error) {
        console.log(result);

        console.log("hi");

        toast.error(result.error);
      } else {
        toast.success(`${result.name} is updated`);
        setSelectedCategory(null);
        setUpdatingName("");
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async (e) => {
    e.preventDefault();
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      console.log(result);

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(`${result.name} is deleted.`);
        setSelectedCategory(null);
        setModalVisible(false);
      }
    } catch (error) {
      console.error(error);
      toast.error("Category delection failed. Try again.");
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <div className="md:w-3/4 p-3">
        <div className="h-12">Manage Categories</div>
        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />
        <br />
        <hr />

        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id}>
              <button
                className="bg-white border border-blue-500 text-blue-500 py-2 px-4 rounded-lg m-3 hover:bg-blue-500 hover:text-white focus:outline-none foucs:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(category);
                  setUpdatingName(category.name);
                }}
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
          <CategoryForm
            value={updatingName}
            setValue={(value) => setUpdatingName(value)}
            handleSubmit={handleUpdateCategory}
            buttonText="Update"
            handleDelete={handleDeleteCategory}
          />
        </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
