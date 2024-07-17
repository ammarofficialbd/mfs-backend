
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const  JWT_SECRET = `asdasfasdfsadfsda`;


exports.authenticate = async (req, res, next) => {
    const token =  req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).send({ error: 'Unauthorized. No token provided.' });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = await User.findById(decoded.id);
        next();
    } catch (err) {
        res.status(401).send({ error: 'Unauthorized. Invalid token.' });
    }
};


/* exports.unautthorize = async (req,res,next)=>{
      
    const id = new ObjectId(req.user._id)
    console.log(id , req.body.from);
    if(id !== req.body.from){
        return res.status(400).send({ error: 'Unauthorized User' });
    }
    next()
}
 */