import { Router } from "express";
import { getAllResources } from "../controllers/resources/getRequests.controller.js";
import { createResource } from "../controllers/resources/postRequests.controller.js";
import { deleteResource } from "../controllers/resources/deleteRequest.controller.js";

const router = Router();

router.get("/", getAllResources);
router.post("/", createResource);
router.delete("/:resourceId", deleteResource);

export default router;
