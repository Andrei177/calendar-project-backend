require("dotenv").config();
const express = require("express");
const sequelize = require("./db");
const cors = require("cors");
const router = require("./router/router");
const app = express();

const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/', (req, res) => {
    res.json("Привет! Всё работает!");
})


const start = async () => {
    try {
        await sequelize.authenticate();
        await sequelize.sync();
        app.listen(PORT, (err) => {
            err
            ?console.log(err, "Ошибка при прослушивании порта")
            :console.log(`Сервер стартовал на ${PORT} порту`);
        })
    } catch (error) {
        console.log("Ошибка при подключении к БД", error);
    }
}

start();