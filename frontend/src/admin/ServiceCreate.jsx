import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import AdminNavbar from "./AdminNavbar";

function ServiceCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [category, setCategory] = useState("");

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleServiceCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);
    formData.append("image", image);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin.token;
    if (!token) {
      navigate("/admin/login");
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:4001/api/v1/services/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Service created successfully");
      navigate("/admin/our-services");

      // reset form
      setTitle("");
      setPrice("");
      setImage("");
      setDescription("");
      setImagePreview("");
      setCategory("");
    } catch (error) {
      toast.error(
        error.response?.data?.errors ||
          error.response?.data?.error ||
          "Something went wrong"
      );
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-white shadow-md">
        <AdminNavbar />
      </div>

      {/* Main Content */}
      <div className="flex-1 py-10 bg-gradient-to-br from-gray-100 to-gray-200 px-4">
        <div className="max-w-3xl mx-auto p-8 border rounded-2xl shadow-xl bg-white">
          {/* Heading */}
          <h3 className="text-3xl font-bold mb-10 text-center text-gray-800">
            Create New Service
          </h3>

          <form onSubmit={handleServiceCreate} className="space-y-8">
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                placeholder="Enter your service title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">
                Description
              </label>
              <textarea
                placeholder="Enter a detailed description of your service"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">
                Price (₹)
              </label>
              <input
                type="number"
                placeholder="Enter your service price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">
                Service Image
              </label>
              <div className="flex items-center justify-center">
                <img
                  src={imagePreview ? `${imagePreview}` : "/imgPL.webp"}
                  alt="Service Preview"
                  className="w-full max-w-sm h-56 rounded-lg object-cover shadow-md border"
                />
              </div>
              <input
                type="file"
                onChange={changePhotoHandler}
                className="mt-3 w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 transition"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white transition"
              >
                <option value="">Select a category</option>
                <option value="Home Cleaning">Home Cleaning</option>
                <option value="Electrician">Electrician</option>
                <option value="Carpenter">Carpenter</option>
                <option value="Motor Mechanic">Motor Mechanic</option>
                <option value="Salon">Salon</option>
                <option value="Any other">Any other</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg transition-transform transform hover:scale-[1.02]"
            >
              Create Service
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ServiceCreate;
