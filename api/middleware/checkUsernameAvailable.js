const Auth = require('../auth/auth-model')

module.exports  = async (req, res, next) => {
  let {username, password} = req.body;
  username = username.replace(/[^a-zA-Z0-9 ]/g, ' ')
  username = username.trim()
        try{
          const [user] = await Auth.findBy({username})
          if (user) {
            res.status(401).json({message: "username taken"})
          } else {
            next()
          }
        }catch (err){
          next(err)
        }

}
