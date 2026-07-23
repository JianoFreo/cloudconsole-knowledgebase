import { Router } from "express";
import { getAllDepartments, getDepartmentBySlug } from "../controllers/departments/getRequests.controller.js";
import { createDepartment } from "../controllers/departments/postRequests.controller.js";

const router = Router();

router.get("/", getAllDepartments);
router.get("/:slug", getDepartmentBySlug);
router.post("/", createDepartment);

export default router;
