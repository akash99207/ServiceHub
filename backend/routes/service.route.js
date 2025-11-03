import express from "express";
import { bookServices, createService, deleteServices, getServices, serviceDetails, updateServices } from "../controllers/service.controller.js";
import adminMiddleware from "../middlewares/admin.mid.js";


const router = express.Router();

router.post("/create", adminMiddleware ,createService);
router.put("/update/:serviceId", adminMiddleware ,updateServices);
router.delete("/delete/:serviceId", adminMiddleware , deleteServices);
router.get("/services", getServices);
router.get("/:serviceId", serviceDetails);

router.post("/bookServices/:serviceId", bookServices)

export default router;
