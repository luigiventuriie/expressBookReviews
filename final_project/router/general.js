const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




public_users.post("/register", (req,res) => {
    console.log(users)
    const username = req.body.username;
    const password = req.body.password;
    if(users.find(user=>user.username === username)){
        return res.status(300).json({message: `User ${username} already exists.`});
    }else{
        users.push({username:username, password:password})
        res.status(200).json({message: `User ${username} was registered.`})
    }
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(books)
  res.send(books)
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  res.send(books[isbn]);
 });
 
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const filtered = []
    Object.keys(books).forEach(key=>{
        if(books[key].author === author){
            filtered.push(books[key])
        }
    })

    res.send(filtered);
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    console.log(title)
    const filtered = []
    Object.keys(books).forEach(key=>{
        if(books[key].title === title){
            filtered.push(books[key])
        }
    })

    res.send(filtered);
});


//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
});


module.exports.general = public_users;
