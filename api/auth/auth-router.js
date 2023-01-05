const router = require('express').Router();
const Auth = require('./auth-model')
const bcrypt = require('bcryptjs');
const checkUsernameAvailable = require('../middleware/checkUsernameAvailable')
const jwt = require('jsonwebtoken')
const JWT_SECRET = process.env.JWT_SECRET || 'shh'


router.post('/register', checkUsernameAvailable, (req, res, next) => {
  let {username, password} = req.body;
  if (typeof username != 'string' || username.trim() == '') {
        res.status(400).json({message: "username and password required"})
        return 
  } 
   if (typeof password != 'string' || password.trim() == '') {
    res.status(400).json({message: "username and password required"})
    return 
}

  username = username.trim();
  const hash = bcrypt.hashSync(password, 8);

    Auth.add({username, password: hash})
    .then(resp => {
      res.status(201).json(resp)
      return
    }).catch(err => {
      next(err)
    })
  });

  

router.post('/login', async (req, res, next) => {
  
   const {username, password} = req.body
 
  
   if (typeof username != 'string' || username.trim() == '') {
    res.status(400).json({message: "username and password are required"})
    return }  
    if (typeof password != 'string' || password.trim() == '') {
      res.status(400).json({message: "username and password are required"})
      return }  
    

  try{
    const [user] = await Auth.findBy({username: req.body.username})
    if (user==null) {
      next({status: 401, message: "invalid credentials"})
    } else {
      req.user = user
    if (bcrypt.compareSync(req.body.password, req.user.password)) {
      const token = buildToken(req.user)
      res.status(200).json({message: `welcome, ${req.user.username}`, token})
    } else {
      next({status:401, message: 'invalid credentials'})
    }
    
      }
    }catch (err){
      next(err)
    }


  function buildToken(user) {
    const payload = {
      subject: user.user_id, 
      role_name: user.role_name, 
      username: user.username
    }
    const options = {
      expiresIn: '1d', 
    }
    return jwt.sign(payload, JWT_SECRET, options)
  }
});


/*


    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */


module.exports = router;
