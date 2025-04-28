import express from "express";
import multer from "multer";
import FeedbackController from "../Controller/Feedback.js";
import verifyToken from "../MiddleWare/AuthMiddleware.js";
import AutherisedRoles from "../MiddleWare/RoleMiddleWare.js";

const routes = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage }).single("image");
routes.post(
  "/AddFeedback",
  upload,
  verifyToken,
  AutherisedRoles("User"),
  FeedbackController.AddFeedBack
);
routes.get(
  "/GetallFeedback",
  verifyToken,
  AutherisedRoles("manager"),
  FeedbackController.GetAllFeedBack
);
routes.put("/UpdateFeedback/:id", upload , FeedbackController.UpdateFeedBack);
routes.get("/GetFeedbackById/:id", upload , FeedbackController.GetFeedbackById);

routes.delete("/DeleteFeedback/:id",verifyToken, AutherisedRoles("manager"), FeedbackController.deleteFeedback)

export default routes;
