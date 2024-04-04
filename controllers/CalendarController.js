const {Event, UserEvent} = require("../models");

class CalendarController{
    static async createEvent(req, res){
        const {description, date, author_id} = req.body;

        const createdEvent = await Event.create({description, date, author_id});

        res.json(createdEvent);
    }
    static async getEvent(req, res){
        //Получение события по id, просто для теста БД написал
        const {id} = req.query;
        console.log(id);

        const event = await Event.findOne({where: {id}});

        res.json(event);
    }
    static async getAllEventsForUser(req, res){
        const {id} = req.user;

        const events = await UserEvent.findAll({where: {user_id: id}});

        res.json({events});
    }
}

module.exports = CalendarController;