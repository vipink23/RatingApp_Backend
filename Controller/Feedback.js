import FeedbackModel from "../Model/Feedback.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { response } from "express";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT;

const AddFeedBack = async (req, res) => {
  const { feedback, user, date, response } = req.body;
  const image = req.file;
  let RatingArray = req.body.rating;
  console.log(image, "imagessssssss");

  console.log(RatingArray);

  // Ensure products is an array (handles JSON string case)
  if (typeof RatingArray === "string") {
    try {
      RatingArray = JSON.parse(RatingArray); // Convert JSON string to array
    } catch (err) {
      return res.status(400).json({ msg: "Invalid products format" });
    }
  }
  // Validate that productsArray is actually an array
  if (!Array.isArray(RatingArray)) {
    return res.status(400).json({ msg: "Products should be an array" });
  }
  try {
    const fd = {
      feedback: feedback,
      rating: RatingArray,
      user: user,
      image: image ? image.filename : "",
      date: date,
      response: response,
    };
    console.log(fd, "fddd");
    await FeedbackModel.create(fd);
    res
      .status(200)
      .json({ status: "OK", message: "FeedBack Added Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetAllFeedBack = async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find({}).populate("user").exec();
    const newfeedbacks = feedbacks.map((fd) => ({
      Id: fd._id,
      Feedback: fd.feedback,
      rating: fd.rating,
      UserId: fd.user._id,
      User: fd.user.firstname + " " + fd.user.lastname,
      ratingDate: fd.date,
      image:
        fd.image === ""
          ? ""
          : `http://localhost:${port}/uploads/${fd?.image ?? ""}`,
    }));
    return res.status(200).json(newfeedbacks);
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
const UpdateFeedBack = async (req, res) => {
  try {
    const { feedback, response, date } = req.body;
    console.log(req.body);

    const image = req.file;
    const { id } = req.params;
    const existfeedback = await FeedbackModel.findById(id);
    if (!existfeedback)
      return res.status(404).json({ message: "No feedback with this ID" });
    let RatingArray = req.body.rating;
    if (!RatingArray || RatingArray.trim() === "") {
      RatingArray = existfeedback.rating;
    } else {
      if (typeof RatingArray === "string") {
        try {
          RatingArray = JSON.parse(RatingArray);
        } catch (err) {
          return res.status(400).json({ msg: "Invalid rating format" });
        }
      }
      if (!Array.isArray(RatingArray)) {
        return res.status(400).json({ msg: "Rating should be an array" });
      }
    }
    const updatedFeedback = {
      feedback: feedback,
      rating: RatingArray,
      image: image ? image.filename : existfeedback.image,
      response: response,
      date: date,
    };

    const fd = await FeedbackModel.findByIdAndUpdate(id, updatedFeedback, {
      new: true,
    });
    return res
      .status(200)
      .json({ message: "Feedback updated successfully", status: true });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const existingFeedback = await FeedbackModel.findById(id);
    if (!existingFeedback)
      return res.status(404).json("No data found in this ID");

    // const imagePath = path.join(
    //   __dirname,
    //   "../uploads",
    //   existingFeedback.image
    // );
    // const paath = path.join(__dirname, "../uploads")

    // if (imagePath === paath) {
    //   console.log(imagePath, "pathh     h");
    //   await FeebackModel.findByIdAndDelete(id);

    // } else {
    //   console.log("hiiii");
    // }

    // fs.unlink(imagePath, async (err) => {
    //   if (err) {
    //     console.error("Error deleting file:", err);
    //     return res.status(500).json({ resText: "Failed to delete image file" });
    //   }
    //   await FeebackModel.findByIdAndDelete(id);
    //   return res
    //     .status(200)
    //     .json({ resText: "Feedback deleted successfully", status: true });
    // });
    const imagePath = path.join(
      __dirname,
      "../uploads",
      existingFeedback.image
    );

    if (existingFeedback.image) {
      // Check if file exists
      if (fs.existsSync(imagePath)) {
        // Delete the image
        fs.unlinkSync(imagePath);
      } else {
        console.log("Image file does not exist, skipping file deletion.");
      }
    }

    // Now delete the feedback
    await FeedbackModel.findByIdAndDelete(id);

    return res
      .status(200)
      .json({ resText: "Feedback deleted successfully", status: true });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const GetFeedbackById = async (req, res) => {
  const { id } = req.params;
  try {
    const feedback = await FeedbackModel.findById(id);
    const fdback = {
      Id: feedback._id,
      Feedback: feedback.feedback,
      rating: feedback.rating,
      UserId: feedback.user._id,
      reviewDate: feedback.date,
      response: feedback.response,
      image:
        feedback.image === ""
          ? ""
          : `http://localhost:${port}/uploads/${feedback?.image ?? ""}`,
    };
    // console.log(feedback);
    res.status(200).json(fdback);
  } catch (error) {
    console.log(error, "err");
  }
};

export default {
  AddFeedBack,
  GetAllFeedBack,
  UpdateFeedBack,
  deleteFeedback,
  GetFeedbackById,
};
