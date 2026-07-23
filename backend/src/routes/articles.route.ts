import { Router } from "express";
import { getAllArticles, getArticleById } from "../controllers/articles/getRequests.controller.js";
import { createArticle } from "../controllers/articles/postRequests.controller.js";
import { updateArticle } from "../controllers/articles/updateRequests.controller.js";
import { deleteArticle } from "../controllers/articles/deleteRequest.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

router.get("/", getAllArticles);
router.get("/:articleId", getArticleById);
router.post("/", upload.array("files", 5), createArticle);
router.patch("/:articleId", updateArticle);
router.delete("/:articleId", deleteArticle);

export default router;
