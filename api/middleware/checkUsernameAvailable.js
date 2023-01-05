const Auth = require('../auth/auth-model')

module.exports  = async (req, res, next) => {
  username = req.body.username.replace(/[^a-zA-Z0-9 ]/g, '').trim();
        try{
          const [user] = await Auth.findBy({username: req.body.username})
          if (user) {
            res.status(401).json({message: "username taken"})
          } else {
            next()
          }
        }catch (err){
          next(err)
        }

}
