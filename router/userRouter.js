const Router = require("express");
const UserController = require("../controllers/UserController");
const validateToken = require("../middlewares/validateToken");

const userRouter = new Router();

userRouter.post("/create", UserController.createUser);
userRouter.post("/login", UserController.loginUser);
userRouter.get("/all", validateToken, UserController.getAllUsers);

module.exports = userRouter