import { BookService } from "../models/bookService.model.js";
import { Service } from "../models/service.model.js";
import { v2 as cloudinary } from "cloudinary";

export const createService = async (req, res) => {
  const adminId = req.adminId;
  const { title, description, price, category } = req.body;

  console.log(title, description, price);

  try {
    // Validation
    if (!title || !description || !price) {
      return res.status(400).json({ errors: "All fields are required" });
    }

    // ✅ Correct way to access file
    if (!req.files || !req.files.image) {
      return res.status(400).json({ errors: "No file uploaded" });
    }
    const image = req.files.image;

    // Validate file type
    const allowedFormat = ["image/png", "image/jpeg"];
    if (!allowedFormat.includes(image.mimetype)) {
      return res.status(400).json({
        errors: "Invalid file format. Only PNG and JPG are allowed",
      });
    }

    console.log("Cloudinary config:", {
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
        ? "Loaded ✅"
        : "Missing ❌",
    });

    // ✅ Upload to cloudinary
    const cloud_response = await cloudinary.uploader.upload(image.tempFilePath);

    if (!cloud_response || cloud_response.error) {
      return res
        .status(400)
        .json({ errors: "Error uploading file to cloudinary" });
    }

    // Save service
    const serviceData = {
      title,
      description,
      price,
      image: {
        public_id: cloud_response.public_id,
        url: cloud_response.secure_url, // use secure_url for https
      },
      category,
      creatorId: adminId,
    };

    const service = await Service.create(serviceData);

    res.json({
      message: "Service created successfully",
      service,
    });
  } catch (error) {
    console.error("Error creating service:", error);
    res.status(500).json({ error: "Error creating service" });
  }
};

export const updateServices = async (req, res) => {
  const adminId = req.adminId;
  const { serviceId } = req.params;
  const { title, description, price, image, category } = req.body;
  try {
    const serviceSearch = await Service.findById(serviceId);
    if (!serviceSearch) {
      return res.status(404).json({ errors: "Service not found" });
    }
    const service = await Service.findOneAndUpdate(
      {
        _id: serviceId,
        creatorId: adminId,
      },
      {
        title,
        description,
        price,
        image: {
          public_id: image?.public_id,
          url: image?.url,
        },
        category,
      }
    );
    if (!service) {
      return res
        .status(404)
        .json({ errors: "can't update, created by other admin" });
    }
    res.status(201).json({ message: "Service updated successfully", service });
  } catch (error) {
    res.status(500).json({ errors: "Error in service updating" });
    console.log("Error in service updating ", error);
  }
};

export const deleteServices = async (req, res) => {
  const adminId = req.adminId;
  const { serviceId } = req.params;
  try {
    const service = await Service.findOneAndDelete({
      _id: serviceId,
      creatorId: adminId,
    });
    if (!service) {
      return res
        .status(404)
        .json({ errors: "can't delete, created by other admin" });
    }
    res.status(200).json({ message: "service deleted successfully" });
  } catch (error) {
    res.status(500).json({ errors: "Error in service deleting" });
    console.log("Error in service deleting", error);
  }
};

export const getServices = async (req, res) => {
  try {
    const services = await Service.find({});
    res.status(200).json({ services });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting services" });
    console.log("error to get services", error);
  }
};

export const serviceDetails = async (req, res) => {
  const { serviceId } = req.params;
  try {
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ error: "service not found" });
    }
    res.status(200).json({ service });
  } catch (error) {
    res.status(500).json({ errors: "Error in getting service details" });
    console.log("Error in service details", error);
  }
};

import Stripe from "stripe";
import config from "../config.js";

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

export const bookServices = async (req, res) => {
  const { userId } = req;
  const { serviceId } = req.params;

  try {
    // Find the service
    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ errors: "Service not found" });
    }

    // Check if already booked
    const existingBookServices = await BookService.findOne({
      userId,
      serviceId,
    });
    if (existingBookServices) {
      return res.status(400).json({
        errors: "User has already booked this service",
      });
    }

    // Create a new booking (initially without payment info)
    const newBookingServices = new BookService({ userId, serviceId });
    await newBookingServices.save();

    // Create Stripe payment intent
    const amount = service.price * 100; // Convert to cents
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(201).json({
      message: "Service booking successful",
      service,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error in booking service:", error);
    res.status(500).json({
      errors: "Internal server error in service booking",
    });
  }
};
