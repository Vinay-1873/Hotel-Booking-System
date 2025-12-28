import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getUserData, storeRecentSearchedCities } from "../controllers/userController.js";

const userRouter = express.Router();

// Get user data
userRouter.get("/", protect, getUserData);
userRouter.post('/store-recent-cities', protect, storeRecentSearchedCities);

export default userRouter;
