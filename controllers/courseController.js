import Course from "../models/courseModel.js";
import asyncHandler from "express-async-handler";

const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
});

const getCourseById = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error("Course not Found");
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    await course.remove();
    res.json({
      message: "Products removed",
    });
  } else {
    res.status(404);
    throw new Error("Course not Found");
  }
});

export { getCourseById, getCourses, deleteProduct };
