const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if(users.find(user=>user.username === username)){
        return res.status(300).json({message: `User ${username} already exists.`});
    }else{
        users.push({username:username, password:password})
        res.status(200).json({message: `User ${username} was registered.`})
    }
});

const getBooksWithPromise = () => {
    return new Promise((resolve, reject) => {
        resolve(books);
    });
};

// Get the book list available in the shop
// public_users.get('/',function (req, res) {
//   res.send(books)
// });

// Get the book list async
public_users.get('/', async function (req, res) {
    try {
      const bookList = await getBooksWithPromise(); 
      res.json(bookList);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error fetching book list" });
    }
  });


const getBookByIsbn = (isbn) => {
    return new Promise((resolve, reject) => {
        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject({ status: 404, message: `ISBN ${isbn} not found` });
        }
    });
};

// Get book details based on ISBN
// public_users.get('/isbn/:isbn',function (req, res) {
//   const isbn = req.params.isbn;
//   res.send(books[isbn]);
//  });

public_users.get('/isbn/:isbn',async function (req, res) {
    getBookByIsbn(req.params.isbn)
    .then(
        result => res.send(result),
        error => res.status(error.status).json({message: error.message})
    );
 });
 
// Get book details based on author
// public_users.get('/author/:author',function (req, res) {
//     const author = req.params.author;
//     res.send(Object.values(books).filter(book=> {return book.author === author}))
// });
public_users.get('/author/:author',async function (req, res) {
    const author = req.params.author;
    getBooksWithPromise()
    .then((books)=>Object.values(books)
    .filter(book=> {return book.author === author}))
    .then((filtered)=> res.send(filtered))
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
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
