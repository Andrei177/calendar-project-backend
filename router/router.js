const Router = require("express");
const userRouter = require("./userRouter");
const calendarRouter = require("./calendarRouter");

const router = new Router();

router.use("/user", userRouter);
router.use("/calendar", calendarRouter);

module.exports = router;