import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const MyServices = () => {
  const [myOrders, setMyOrder] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!token) return;
      try {
        const response = await axios.get(
          "http://localhost:4001/api/v1/user/book-services",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
        console.log(response.data); // for debugging
        setMyOrder(response.data.bookings || []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setErrorMessage(
          error.response?.data?.errors || "Failed to fetch orders"
        );
        toast.error(error.response?.data?.errors || "Failed to fetch orders");
      }
    };

    fetchMyOrders();
  }, [token]);

  return (
    <>
      <Navbar />
      <div
        className={`flex-1 p-8 bg-gray-50 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <h2 className="text-xl font-semibold mt-6 md:mt-0 mb-6">My Orders</h2>

        {/* Error message */}
        {errorMessage && (
          <div className="text-red-500 text-center mb-4">{errorMessage}</div>
        )}

        {/* Render Orders */}
        {myOrders.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {myOrders.map((order, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-md p-6 mb-6"
              >
                <div className="flex flex-col items-center space-y-4">
                  <img
                    className="rounded-lg w-full h-48 object-cover"
                    src={order.image?.url || "https://via.placeholder.com/200"}
                    alt={order.title}
                  />
                  <div className="text-center">
                    <h3 className="text-lg font-bold">{order.title}</h3>
                    <p className="text-gray-500">
                      {order.description?.length > 100
                        ? `${order.description.slice(0, 100)}...`
                        : order.description}
                    </p>
                    <span className="text-green-700 font-semibold text-sm">
                      ${order.price} only
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">You have not booked any services yet.</p>
        )}
      </div>
    </>
  );
};

export default MyServices;
