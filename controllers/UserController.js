const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");
const { Sequelize } = require("../db");

const generateJWT = (id, email) => {
    return jwt.sign({id, email}, process.env.SECRET_KEY, {expiresIn: "24h"});
}

class UserController{
    static async createUser(req, res){
        const {email, password} = req.body;

        const candidate = await User.findOne({where: {email}});
        if(candidate){
            return res.status(405).json({message: "Пользователь с таким email уже существует!"});
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const newUser = await User.create({email, password: hashPassword});
        const token = generateJWT(newUser.id, newUser.email);

        res.status(200).json({token});
    }

    static async loginUser(req, res){
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}});

        if(!user){
            return res.status(404).json({message: "Пользователя с таким email не найден"});
        }

        const compare = await bcrypt.compare(password, user.password);
        if(!compare){
            return res.status(403).json({message: "Неверный пароль"});
        }

        const token = generateJWT(user.id, user.email);

        res.status(200).json({token});
    }

    static async getAllUsers(req, res){
        const {id} = req.user;

        const users = await User.findAll({
            where: {
                id:{
                    [Sequelize.Op.not]: id
                }
            }
        });

        res.status(200).json({users});
    }
    static async recoveryPassword(req, res){

        const {email} = req.body;

        const candidate = await User.findOne({where: {email}});

        if(!candidate){
            return res.status(403).json({message: "Вы не зарегистрированы!"})
        }

        const newPassword = uuidv4();
        const newHashPassword = await bcrypt.hash(newPassword, 5);

        const transporter = nodemailer.createTransport({
            host: 'smtp.mail.ru',
            port: 465,
            secure: true,
            auth: {
                user: 'andryusha_lyapin04@mail.ru',
                pass: process.env.PASSWORD_FOR_SEND_LETTER
            }
        });
        const mailOptions = {
            from: "andryusha_lyapin04@mail.ru",
            to: email,
            subject: "Новый пароль для приложения с календарём",
            text: "Ваш новый пароль " + newPassword,
          };
        transporter.sendMail(mailOptions, async (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({message: 'Ошибка при отправке письма'});
            } else {

                const chekUpdate = await User.update({password: newHashPassword},{where: {id: candidate.id}});

                if(chekUpdate){
                console.log('Письмо успешно отправлено: ' + info.response);
                res.status(200).json({
                    message: "Письмо успешно отправлено! Ваш пароль изменён на тот, что в письме",
                });
                }else{
                    res.status(500).json({
                        message: "Пароль выслан, но в системе произошла ошибка при изменении пароля на новый, просим обновить страницу и попробовать ещё раз запросить новый пароль",
                    });
                }
            }
        })
    }
}

module.exports = UserController;