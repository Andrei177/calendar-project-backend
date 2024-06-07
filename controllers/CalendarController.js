const { Op } = require("sequelize");
const {Event, UserEvent} = require("../models");

class CalendarController{
    static async createEvent(req, res){
        const {description, date, author_id, invitedUsers} = req.body;

        const createdEvent = await Event.create({description, date, author_id});

        if(!createdEvent){
            return res.status(500).json({message: "Произошла ошибка при создании мероприятия"});
        }

        // const recordUserEvent = [];
        // recordUserEvent.length = invitedUsers.length;

        // for (let i = 0; i < recordUserEvent.length; i++) {
        //     recordUserEvent[i] = {userId: invitedUsers[i].id, eventId: createdEvent.id}
        // }
        //Вот этот код написать вместо кусочка, который выше (чтобы добавить ещё запись userID: {author_id, eventId: createdEvent.id})
        const recordUserEvent = [];
        recordUserEvent.push({userId: author_id, eventId: createdEvent.id})

        for (let i = 0; i < invitedUsers.length; i++) {
            recordUserEvent.push({userId: invitedUsers[i].id, eventId: createdEvent.id});
        }

        const newRecordUserEvent = await UserEvent.bulkCreate(recordUserEvent);

        if(!newRecordUserEvent){
            return res.status(500).json({message: "Произошла ошибка при присвоении мероприятий пользователям"})
        }

        return res.status(200).json({message: "Мероприятия для пользоватлей успешно созданы!"});
    }
    static async getEvent(req, res){ // написано для теста
        //Получение события по id, просто для теста БД написал
        const {id} = req.query;
        console.log(id);

        const event = await Event.findOne({where: {id}});

        res.json(event);
    }
    static async getAllEventsForUser(req, res){ // вроде дописано
        const {id} = req.user;

        const usersEventsInfo = await UserEvent.findAll({where: {userId: id}}); // тут приходят массив id ивентов, на которые приглашён данный user, а чтобы дальше получить сами ивенты нужно сделать еще один запрос в БД к ивентам

        const eventsIds = [];
        for (let i = 0; i < usersEventsInfo.length; i++) {
            eventsIds.push(usersEventsInfo[i].eventId);
        }

        const events = await Event.findAll({
                where: {
                    id:{
                        [Op.in]: eventsIds
                    }
                }
            }
        )

        res.json({events});
    }
    static async getUsersByEvent(req, res){
        const {eventsIds} = req.body;
        console.log(eventsIds, "dsfsfdsfsgsaAAAAAAAAa");

        const usersByEvent = await UserEvent.findAll({
            where: {
                eventId:{
                    [Op.in]: eventsIds
                }
            }
        }
    )

        if(!usersByEvent){
            return res.status(404).json({message: "Не удалось найти пользователей, приглашённых на это мероприятие"});
        }

        return res.json(usersByEvent);
    }
}

module.exports = CalendarController;