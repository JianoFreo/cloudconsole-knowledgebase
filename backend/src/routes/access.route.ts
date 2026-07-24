import { Router } from "express";
import { postIpAddress, verifyAccessCode } from "../controllers/access/postRequests.controller.js";

const router = Router();

router.post("/verify", verifyAccessCode);
router.post("/log-ip", postIpAddress);

export default router;
