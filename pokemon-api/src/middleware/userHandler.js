const fs = require('fs');
const path = require('path');

module.exports.userHandler = (req, res, next) => {
    const username = req.headers.username ? req.headers.username : req.body.headers.username ? req.body.headers.username : null;
    if(!username) {
        next({status: 401, message: "unauthenticated user request!"});
    } else {
        const userPath = path.resolve(path.join("./src/static-files/users", username));
        if(!fs.existsSync(userPath)) fs.mkdirSync(userPath);
        req.username = username;
        next();
    }
}