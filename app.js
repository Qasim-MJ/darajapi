//Requiring Dependencies
const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersRoutes = require('./routes/user.js');
const booksRoutes = require('./routes/books.js');


const PORT = process.env.PORT || 5000




//App Configurations & Database Connection

    const app = express();
    app.use(cors());
    app.use(express.static('public'));


    const connection = mysql.createConnection({
    host :'db4free.net',
    user:'darajqasim',
    password:'qasim111111',
    database:'darajqasim'

    });

    connection.connect((err) => {
        if(err) {
            console.log(err);
        } else {
            console.log('\x1b[35m', 'Connected to MySQL Successfully')
        }
    });


//Middleware 
app.use(express.json({limit:'50mb'})); 
app.use(express.urlencoded({extended:true, limit:'50mb'}));

app.get('/', (req,res) => {
    res.send("Hello From Daraj")
})

app.use('/api/user', usersRoutes);
app.use('/api/books', booksRoutes);

  
app.listen(PORT, ()=>{
    console.log(`Server Started Running On Port ${PORT}`)
})