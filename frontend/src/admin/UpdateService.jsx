import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";

function UpdateService() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState(null); // Only for File
  const [imagePreview, setImagePreview] = useState(""); // For preview URL
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ✅ Fetch service data
  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:4001/api/v1/services/${id}`,
          { withCredentials: true }
        );

        setTitle(data.service.title);
        setDescription(data.service.description);
        setPrice(data.service.price);
        setImagePreview(data.service.image?.url || "");
        setCategory(data.service.category);
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch service data");
      } finally {
        setLoading(false);
      }
    };
    fetchServiceData();
  }, [id]);

  // ✅ Handle new image upload
  const changePhotoHandler = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(selectedFile);
      setImage(selectedFile);
    }
  };

  // ✅ Update service
  const handleUpdateService = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("category", category);

    if (image) {
      formData.append("image", image); // Only append new file
    }

    const admin = localStorage.getItem("admin")
      ? JSON.parse(localStorage.getItem("admin"))
      : null;

    const token = admin?.token;
    if (!token) {
      toast.error("Please login to admin");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:4001/api/v1/services/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Service updated successfully ✅");
      navigate("/admin/our-services");
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message ||
          error.response?.data?.errors ||
          "Update failed, try again!"
      );
    }
  };

  if (loading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  return (
    <>
      <AdminNavbar />

      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-50 via-white to-blue-100">
        <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-2xl border border-gray-200">
          <h3 className="text-3xl font-bold mb-8 text-center text-gray-800">
            ✨ Update Service
          </h3>

          <form onSubmit={handleUpdateService} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter your service title"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none 
                transition duration-200"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter your service description"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none 
                transition duration-200 resize-none"
              ></textarea>
            </div>

            {/* Price */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter your service price"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none 
                transition duration-200"
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-3">
                Service Image
              </label>
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <img
                  src={imagePreview || "/imgPL.webp"}
                  alt="Service"
                  className="w-40 h-40 rounded-lg object-cover border shadow-md"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={changePhotoHandler}
                  className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-lg 
                  focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-lg font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm 
                focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none 
                transition duration-200 bg-white"
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

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 px-6 text-lg font-semibold bg-gradient-to-r 
              from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 
              text-white rounded-lg shadow-md hover:shadow-lg 
              transition-all duration-300"
            >
              Update Service 🚀
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default UpdateService;
