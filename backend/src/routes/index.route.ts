import { Router } from "express";
import departmentRoutes from "./departments.route.js";
import articleRoutes from "./articles.route.js";
import resourceRoutes from "./resources.route.js";
import contactRoutes from "./contact.route.js";
import accessRoutes from "./access.route.js";

const router = Router();

router.get("/", (_req, res) => res.json({ ok: true, service: "cc-knowledgebase-backend" }));
router.use("/departments", departmentRoutes);
router.use("/articles", articleRoutes);
router.use("/resources", resourceRoutes);
router.use("/contact", contactRoutes);
router.use("/access", accessRoutes);

export default router;
