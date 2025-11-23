import express from "express";
import userAuth from "../middleware/userAuth.js";
import {
  deleteUser,
  getUserData,
  updateUser,
  users,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/data", userAuth, getUserData);
userRouter.put("/update-user/:id", updateUser);
userRouter.delete("/delete-user/:id", deleteUser);
userRouter.get("/all-users", users);

export default userRouter;
