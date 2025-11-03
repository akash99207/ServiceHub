import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Profile() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
  });

  const navigate = useNavigate();

  // Verify user token for access
  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;

  useEffect(() => {
    setIsLoggedIn(!!token);
  }, [token]);

  if (!token) {
    navigate("/login");
    return null;
  }

  // Fetch user profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4001/api/v1/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setUser(res.data.user);
        setFormData({
          firstName: res.data.user.firstName,
          lastName: res.data.user.lastName,
          password: "",
        });
      } catch (err) {
        toast.error("Failed to fetch profile");
      }
    };
    fetchProfile();
  }, [token]);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Update user profile
  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:4001/api/v1/user/profile",
        formData,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setUser(res.data.user);
      setEditMode(false);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4001/api/v1/user/logout`,
        {
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <Navbar />

      {/* Main Content */}
      <div className="min-h-screen bg-gray-100 py-6 flex items-center justify-center">
        <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center border-b pb-2">
            My Profile
          </h2>

          {!editMode ? (
            <div className="space-y-4">
              <p className="text-lg">
                <span className="font-medium text-gray-700">First Name:</span>{" "}
                {user.firstName}
              </p>
              <p className="text-lg">
                <span className="font-medium text-gray-700">Last Name:</span>{" "}
                {user.lastName}
              </p>
              <p className="text-lg">
                <span className="font-medium text-gray-700">Email:</span>{" "}
                {user.email}
              </p>
              <button
                onClick={() => setEditMode(true)}
                className="mt-6 w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit Profile
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="New Password (optional)"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex gap-4 mt-6">
                <button
                  onClick={handleUpdate}
                  className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditMode(false)}
                  className="w-full px-6 py-3 bg-gray-400 text-white font-medium rounded-lg hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Profile;
