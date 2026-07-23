import { Router } from "express";
import { getAllContactMessages } from "../controllers/contact/getRequests.controller.js";
import { submitContactMessage } from "../controllers/contact/postRequests.controller.js";

const router = Router();

router.post("/", submitContactMessage);
router.get("/", getAllContactMessages);

export default router;
