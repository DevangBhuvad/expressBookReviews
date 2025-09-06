const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const axios = require("axios");


// ✅ Register new user
public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    let userExists = users.filter((user) => user.username === username).length > 0;
    if (!userExists) {
      users.push({ "username": username, "password": password });
      return res.status(200).json({ message: "User successfully registered. Now you can login" });
    } else {
      return res.status(404).json({ message: "User already exists!" });
    }
  }

  return res.status(404).json({ message: "Unable to register user." });
});


// ✅ Task 1 - Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
});

// ✅ Task 2 - Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn]);
});
  
// ✅ Task 3 - Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author;
  let filteredBooks = Object.values(books).filter((book) => book.author === author);
  return res.send(filteredBooks);
});

// ✅ Task 4 - Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title;
  let filteredBooks = Object.values(books).filter((book) => book.title === title);
  return res.send(filteredBooks);
});

// ✅ Task 5 - Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  return res.send(books[isbn].reviews);
});


// ======================
// 📘 Task 10 → 13 using Axios
// ======================

// Task 10: Get book list
public_users.get("/async/books-promise", function (req, res) {
  axios
    .get("http://localhost:5000/")
    .then((response) => res.status(200).json(response.data))
    .catch((error) => res.status(500).json({ message: "Error fetching books", error: error.message }));
});

public_users.get("/async/books-async", async function (req, res) {
  try {
    const response = await axios.get("http://localhost:5000/");
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books", error: error.message });
  }
});


// Task 11: Get book details by ISBN
public_users.get("/async/isbn-promise/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  axios
    .get(`http://localhost:5000/isbn/${isbn}`)
    .then((response) => res.status(200).json(response.data))
    .catch((error) => res.status(500).json({ message: "Error fetching book by ISBN", error: error.message }));
});

public_users.get("/async/isbn-async/:isbn", async function (req, res) {
  try {
    const isbn = req.params.isbn;
    const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching book by ISBN", error: error.message });
  }
});


// Task 12: Get book details by Author
public_users.get("/async/author-promise/:author", function (req, res) {
  const author = req.params.author;
  axios
    .get(`http://localhost:5000/author/${author}`)
    .then((response) => res.status(200).json(response.data))
    .catch((error) => res.status(500).json({ message: "Error fetching books by author", error: error.message }));
});

public_users.get("/async/author-async/:author", async function (req, res) {
  try {
    const author = req.params.author;
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by author", error: error.message });
  }
});


// Task 13: Get book details by Title
public_users.get("/async/title-promise/:title", function (req, res) {
  const title = req.params.title;
  axios
    .get(`http://localhost:5000/title/${title}`)
    .then((response) => res.status(200).json(response.data))
    .catch((error) => res.status(500).json({ message: "Error fetching books by title", error: error.message }));
});

public_users.get("/async/title-async/:title", async function (req, res) {
  try {
    const title = req.params.title;
    const response = await axios.get(`http://localhost:5000/title/${title}`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching books by title", error: error.message });
  }
});


module.exports.general = public_users;
