import { Router } from "express";
import { verifyAccessCode } from "../controllers/access/postRequests.controller.js";

const router = Router();

router.post("/verify", verifyAccessCode);

export default router;
