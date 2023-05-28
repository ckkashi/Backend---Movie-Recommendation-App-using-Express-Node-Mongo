const jwt = require('jsonwebtoken');

const getUser = (req,res,next)=>{
    try{
        const token = req.header('auth-token');
        if(!token){
            res.status(401).json({ msg: "Authentication failed." });
        }
        const {id} = jwt.verify(token,process.env.ENKEY);
        req.userid = id;
        next();
    }catch(e){
        return res.status(500).send({msg:"Internal server error.",error:e});
    }
}

module.exports = getUser;