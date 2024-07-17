const jwt = require('jsonwebtoken');

const  JWT_SECRET = `asdasfasdfsadfsda`;

//console.log(JWT_SECRET, "jwt");

exports.generateToken = (user) => {

    return jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });

};
