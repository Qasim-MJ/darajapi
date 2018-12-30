const express = require('express');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router()

const connection = mysql.createConnection({
    host :'db4free.net',
    user:'darajqasim',
    password:'qasim111111',
    database:'darajqasim'

    });


router.post('/register',(req,res) => {
    const {name, email, password} = req.body;

    bcrypt.genSalt(10).then(salt => {
        bcrypt.hash(password, salt)
        .then(hashedPassword =>{
            const INSERT_USER = `INSERT INTO users (name, email, password, admin) VALUES ('${name}', '${email}', '${hashedPassword}', ${0})`
            connection.query(INSERT_USER, (err, results) => {
                if(err) {
                    res.status(400).json({ success: false, message: err });
                } else {
                    const token = jwt.sign({_id: results.insertId, exp: Date.now() + 1000 * 60 }, 'key');
                    res.status(200).json({ success: true, message: 'Signed up' , token : token });
                }
            })
        })
    })
})


router.post('/login', (req,res) => {
    const {email, password} = req.body
    const FIND_USER = `SELECT * FROM users WHERE email='${email}'`
    connection.query(FIND_USER, (err, results) => {
        if (err) {
            res.send(err)
        } 
        else if (results[0]) {
            bcrypt.compare(password, results[0].password, (err, response) => {
                if (err) {
                    res.status(404).send(err)
                }
               else if (response) {
                    const token = jwt.sign({ "_id": results.id }, 'key');
                     //res.header({'x-auth-token': token}).send('Logged in');
                     res.status(200).json({ success: true, message: 'Logged in' , token : token , name : results[0].name });
                }
                else {
                    res.status(400).json({ success: false, message: 'Wrong Email or Password' });
                }
            })
        }
        else {
            res.status(400).json({ success: false, message: 'Wrong Email or Password' });
        }
    })
})
router.post('/checkLogin', (req, res) => {
    const token = req.body.token;
    if(token){
      try {
        let payload = jwt.verify(token, 'key');
        res.status(200).json({ success: true, message: 'You Are Logged in' });
      } catch (err) {
        res.status(400).json({ success: false, message: 'Invalid Token , Log in' });
      }
    }else{
        res.status(400).json({ success: false, message: 'You Need To Login' });
    }
  });

  router.post('/checkAdmin', (req, res) => {
    const email = req.body.email
    const FIND_USER = `SELECT * FROM users WHERE email='${email}'`
    connection.query(FIND_USER, (err, results) => {
        if (err) {
            res.send(err)
        } else if (results[0].admin === 1) {
            res.json({isAdmin : true})
        } else {
            res.json({isAdmin : false})
        }
  })
})
  module.exports = router