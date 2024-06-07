const Router = require("express");
const CalendarController = require("../controllers/CalendarController");
const validateToken = require("../middlewares/validateToken");

const calendarRouter = new Router();

calendarRouter.get("/", validateToken, CalendarController.getAllEventsForUser)
calendarRouter.post("/create", validateToken, CalendarController.createEvent);
calendarRouter.get("/someevent", CalendarController.getEvent);
calendarRouter.post("/users", CalendarController.getUsersByEvent);

module.exports = calendarRouter;