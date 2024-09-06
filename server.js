// server.js

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mysql = require("mysql2");

const app = express();
const port = process.env.PORT || 3003;

app.use(cors());
app.use(bodyParser.json());

const dbConfig = {
  host: "localhost",
  user: "root",
  password: "hammad",
  database: "mydb",
};

const pool = mysql.createPool(dbConfig);

function queryMySQL(query, values) {
  return new Promise((resolve, reject) => {
    pool.query(query, values, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
}

app.get("/api/books", async (req, res) => {
  const query = "SELECT * FROM books";
  try {
    const results = await queryMySQL(query);
    console.log("Query:", query);
    console.log("Results:", results);
    res.json(results);
  } catch (error) {
    console.error("Error fetching books from MySQL:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.post("/api/books", async (req, res) => {
  const { title, author, genre, rating, randomColor, timestamp } = req.body;
  const insertQuery =
    "INSERT INTO books (title, author, genre, rating, randomColor, timestamp) VALUES (?, ?, ?, ?, ?, ?)";
  const insertValues = [title, author, genre, rating, randomColor, timestamp];

  try {
    await queryMySQL(insertQuery, insertValues);
    res.status(201).send("Book added successfully");
  } catch (error) {
    console.error("Error adding book to MySQL:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.delete("/api/books/:title", async (req, res) => {
  const bookTitle = req.params.title.slice(3);
  console.log(bookTitle);
  console.log("Deleting book with title:", bookTitle);

  const deleteQuery = "DELETE FROM books WHERE author = ?";

  try {
    await queryMySQL(deleteQuery, [bookTitle]);
    console.log("Book deleted successfully");
    res.status(200).send("Book deleted successfully");
  } catch (error) {
    console.error("Error deleting book from MySQL:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

function queryMySQL(query, values) {
  console.log("Executing query:", query, "with values:", values);

  return new Promise((resolve, reject) => {
    const isSelectQuery = query.trim().toLowerCase().startsWith("select");

    if (isSelectQuery) {
      pool.query(query, (error, results) => {
        if (error) {
          console.error("Query execution error:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    } else {
      pool.query(query, values, (error, results) => {
        if (error) {
          console.error("Query execution error:", error);
          reject(error);
        } else {
          resolve(results);
        }
      });
    }
  });
}
