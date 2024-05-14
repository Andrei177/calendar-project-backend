const jwt = require("jsonwebtoken");

module.exports = function validateToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            return res.status(403).json({message: "Необходимо авторизоваться"})
        }
        //const decoded = 
        jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
            if(err){
                return res.status(403).json({message: "Необходимо авторизоваться"}) // токен не прошёл проверку на подлинность
            }
            else{
                req.user = decoded; // добавляем к запросу поле user
                next(); // переходим к следующему обработчику
            }
        });
    } catch (error) {
        console.log(error, "Ошибка при валидации токена");
    }
}