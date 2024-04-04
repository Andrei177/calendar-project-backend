const jwt = require("jsonwebtoken");

module.exports = function validateToken(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if(!token){
            return res.json({message: "Необходимо авторизоваться"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        req.user = decoded;
        next();
    } catch (error) {
        console.log(error);
    }
}