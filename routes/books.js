const express = require('express');
const mysql = require('mysql');
const multer = require('multer');

const router = express.Router()

//Upload Configs
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null,  Date.now() + '-' + file.originalname)
    }
})
   
var upload = multer({ storage: storage })


const connection = mysql.createConnection({
    host :'db4free.net',
    user:'darajqasim',
    password:'qasim111111',
    database:'darajqasim'

    });



// Routers 
router.post('/addBook',
        upload.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),
        (req,res) => {
            const {bookTitle, author , description} = req.body
              if (req.files.image && req.files.pdf && bookTitle !== "" && author !== "" && description !== "") {
                  let imagepath = "https://pydio-frs-n2.services.clever-cloud.com/index.php?secure_token=pU9ZgVNQkbcEVLsXgZ6JMahJmp4ujc6k&get_action=open_file&repository_id=predefined_ftp&file=%2F"+req.files.image[0].path
                const INSERT_BOOK = `INSERT INTO books (bookTitle, author, imageURL, pdfURL, description) 
                VALUES ('${bookTitle}', '${author}', 'file:///Users/Qasem/Desktop/daraj/${req.files.image[0].path}', 'file:///Users/Qasem/Desktop/daraj/${req.files.pdf[0].path}', '${description}')`
                    console.log(imagepath)
                connection.query(INSERT_BOOK, (err, results) => {
                    if (err) {
                        res.json({success : false , error : err})
                        console.log(err)
                    } else {
                        res.json({success : true})
                    }
                })

            } else {
                res.status(400).json({success : false })
            }
})


router.get('/books', (req,res)=> {
    const GET_BOOKS = `SELECT * from books`
    connection.query(GET_BOOKS, (err,results) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.send(results)
        }
    })
})



module.exports = router