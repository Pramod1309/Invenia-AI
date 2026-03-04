import express from "express";
import userRoutes from "./users.js";
import jobRoutes from "./jobRoutes.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "API is working!" });
});

router.use("/users", userRoutes);
router.use("/jobs", jobRoutes);

export default router;
