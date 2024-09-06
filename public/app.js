// app.js

let books = [];

document.addEventListener("DOMContentLoaded", () => {
  const apiUrl = "http://localhost:3003/api/books";

  // Function to fetch all books from the server
  async function fetchBooks() {
    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.statusText}`);
      }

      books = await response.json(); // Update the global variable
      console.log("Fetched books:", books);
      return books;
    } catch (error) {
      console.error("Error fetching books:", error);
      throw error;
    }
  }

  // Initial fetch and display of books
  fetchBooks()
    .then((books) => displayBooks(books))
    .catch((error) => console.error("Error initializing books:", error));

  // Function to display books on the page
  function displayBooks(books) {
    const extendedContent = document.querySelector(".extended-content");
    extendedContent.innerHTML = ""; // Clear existing content

    books.forEach((book) => {
      const bookDiv = document.createElement("div");
      bookDiv.className = "individual-component";

      const bookCoverDiv = document.createElement("div");
      bookCoverDiv.className = "book-cover";
      bookCoverDiv.style.backgroundColor = book.randomColor; // Set the background color

      const bookContentDiv = document.createElement("div");
      bookContentDiv.className = "book-content";

      const bookNameH1 = document.createElement("h1");
      bookNameH1.className = "name";
      bookNameH1.textContent = book.title;

      const authorP = document.createElement("p");
      authorP.className = "author";
      authorP.textContent = `by ${book.author}`;

      const genreBtn = document.createElement("button");
      genreBtn.className = "genre-btn";
      genreBtn.textContent = book.genre;

      const reviewP = document.createElement("p");
      reviewP.className = "review";
      reviewP.textContent = `${book.rating}/5`;

      const deleteBtn = document.createElement("button");
      deleteBtn.className = "delete-btn";
      deleteBtn.textContent = "Delete";

      bookContentDiv.appendChild(bookNameH1);
      bookContentDiv.appendChild(authorP);
      bookContentDiv.appendChild(genreBtn);
      bookContentDiv.appendChild(reviewP);
      bookContentDiv.appendChild(deleteBtn);

      bookDiv.appendChild(bookCoverDiv);
      bookDiv.appendChild(bookContentDiv);

      extendedContent.appendChild(bookDiv);
    });
  }

  // Add this function to your app.js
  function resetForm() {
    // Replace these selectors with the actual selectors for your form fields
    document.querySelector(".name-input").value = "";
    document.querySelector(".author-input").value = "";
    document.querySelector(".select").value = "None";
    document.querySelector(".rating").style = "--value : 2.5;";
  }

  // Function to add a book to the server
  async function addBook(book) {
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(book),
      });

      if (!response.ok) {
        throw new Error(`Failed to add book: ${response.statusText}`);
      }

      // Reset form fields after successfully adding a new book
      resetForm();

      // Refresh the book list after adding a new book
      const books = await fetchBooks();
      displayBooks(books);
    } catch (error) {
      console.error("Error adding book:", error);
    }
  }

  // Getting random colour function
  function getRandomColor() {
    // Generate a random color in the format #RRGGBB
    const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    return randomColor;
  }

  // Event listener for the "Completed" button
  const submitBtn = document.querySelector(".complete-btn");
  submitBtn.addEventListener("click", async (e) => {
    // Your existing logic to get book details
    const nameInp = document.querySelector(".name-input").value;
    const authorInp = document.querySelector(".author-input").value;
    const select = document.querySelector(".select").value;
    const newVal = document.querySelector(".rating-input").value;

    const randomColor = getRandomColor();

    if (nameInp === "" || authorInp === "" || select === "None") {
      // Your existing alert logic
    } else {
      const newBook = {
        title: nameInp,
        author: authorInp,
        genre: select,
        rating: newVal,
        randomColor: randomColor,
        timestamp: Date.now(),
      };

      // Add the new book to the server
      await addBook(newBook);
    }
  });
  async function deleteBook(bookTitle) {
    try {
      const response = await fetch(
        `${apiUrl}/${encodeURIComponent(bookTitle)}`,
        {
          method: "DELETE",
        }
      );

      console.log("Delete response:", response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Failed to delete book: ${response.statusText}`);
      }

      // Assuming that response.ok means the book was successfully deleted
      console.log("Book deleted successfully");

      // Refresh the book list after deleting a book
      await fetchBooks(); // Fetch the updated books
      displayBooks(books); // Use the updated books array
    } catch (error) {
      console.error("Error deleting book:", error);
    }
  }

  // Event listener for deleting individual components
  const extendedContent = document.querySelector(".extended-content");
  extendedContent.addEventListener("click", async (e) => {
    if (e.target.classList.contains("delete-btn")) {
      const bookName =
        e.target.parentElement.firstChild.nextSibling.textContent;

      // Delete the book from the server
      await deleteBook(bookName);
    }
  });

  // Initial fetch and display of books
  fetchBooks()
    .then((books) => displayBooks(books))
    .catch((error) => console.error("Error initializing books:", error));
});
