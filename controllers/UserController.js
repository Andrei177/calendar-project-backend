const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { User } = require("../models");

const generateJWT = (id, email) => {
    console.log(process.env.SECRET_KEY);
    return jwt.sign({id, email}, process.env.SECRET_KEY, {expiresIn: "24h"});
}

class UserController{
    static async createUser(req, res){
        const {email, password} = req.body;

        const candidate = await User.findOne({where: {email}});
        if(candidate){
            return res.json({message: "Пользователь с таким email уже существует!"});
        }

        const hashPassword = await bcrypt.hash(password, 5);
        const newUser = await User.create({email, password: hashPassword});
        const token = generateJWT(newUser.id, newUser.email);

        res.json({token});
    }

    static async loginUser(req, res){
        const {email, password} = req.body;

        const user = await User.findOne({where: {email}})

        if(!user){
            return res.json({message: "Пользователя с таким email не найден"});
        }

        const compare = await bcrypt.compare(password, user.password);
        if(!compare){
            return res.json("Неверный пароль");
        }

        const token = generateJWT(user.id, user.email);

        res.json({token});
    }
    static async getAllUsers(req, res){
        const {id} = req.user;

        const users = await User.findAll();

        users.splice(id - 1, 1);

        res.json({users});
    }
}

module.exports = UserController;