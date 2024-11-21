const jwt = require("jsonwebtoken");
const keys = require("../config/keys");

const validateToken = (req, res, next) =>{
    const inputToken = req.headers["authorization"]?.split(" ")[1];
    if(!inputToken)
    {
        return res.status(401).json({errorCode: "Token Missing"});
    }

    try {
        const decToken = jwt.verify(inputToken, keys.jwtSecret);
        req.user = decToken;
        next();
    }
    catch (error) {
        log.error("error");
        return res.status(403).json({errorCode: "Token Invalid"});
    }
};
module.exports = validateToken;