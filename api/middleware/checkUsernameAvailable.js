const Auth = require('../auth/auth-model')

module.exports  = async (req, res, next) => {
        try{
          const [user] = await Auth.findBy({username: req.body.username})
          if (user) {
            res.status(401).json({message: "username is unavailable"})
          } else {
            next()
          }
        }catch (err){
          next(err)
        }

}
