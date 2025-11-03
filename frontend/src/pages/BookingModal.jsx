import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";

const BookingModal = ({ show, onClose, service }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    date: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  if (!show) {
    return null;
  }

  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  if (!token) {
    navigate("/login");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName.trim() ||
      !formData.lastName.trim() ||
      !formData.email.trim() ||
      !formData.address.trim() ||
      !formData.date.trim()
    ) {
      toast.error("Please fill in all required fields!");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `http://localhost:4001/api/v1/services/bookServices/${service._id}`,
        {
          ...formData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      toast.success("Booking successful!");
      onClose();
      navigate("/my-order");
    } catch (error) {
      console.error("Booking error:", error);
      toast.error(error.response?.data?.errors || "Booking failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Book {service.title}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            placeholder="First Name"
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            placeholder="Last Name"
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="Address"
            required
            className="w-full border px-3 py-2 rounded-md"
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded-md"
          />

          <div className="flex justify-between mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
            >
              Cancel
            </button>
            <Link to={`/book-services/${service._id}`}>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                {loading ? "Booking..." : "Book Now"}
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;
