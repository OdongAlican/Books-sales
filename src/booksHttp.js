class BooksHTTP {
  async getHttp(url) {
    const response = await fetch(url);
    const resData = await response.json();
    return resData;
  }

  async postHttp(url, data) {
    const response = await fetch(url, {
      method: "post",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const resData = await response.json();
    return resData;
  }

  async delete(url) {
    const response = await fetch(url, {
      method: "delete",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    });
    const resData = "Resource Deleted";
    return resData;
  }

  async put(url, data) {
    const response = await fetch(url, {
      method: "put",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });

    const resData = await response.json();
    return resData;
  }
}

class UI {
  constructor() {
    this.book = document.querySelector("#books");
    this.bookName = document.querySelector("#bookname");
    this.bookAuthor = document.querySelector("#author");
    this.bookPubYear = document.querySelector("#yearOfPublishment");
    this.id = document.querySelector("#id");
    this.bookSubmit = document.querySelector("#book-submit");
    this.forState = "add";
  }

  showBooks(books) {
    let output = "";
    books.forEach(book => {
      output += `
        <div class="card ml-3 mb-3" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title">${book.bookName}</h5>
          <p class="card-text">${book.authorName}</p>
          <p class="card-text">${book.yearOfPublishment}</p>
          <a href="#" class="btnEdit btn btn-secondary" data-id="${book._id}">Edit</a>
          <a href="#" class="btnDelete btn btn-danger" data-id="${book._id}">Delete</a>
        </div>
      </div>
        `;
    });

    this.book.innerHTML = output;
  }

  showAlert(massage, className) {
    this.clearAlert();
    const div = document.createElement("div");
    div.className = className;
    div.appendChild(document.createTextNode(massage));
    const mainSection = document.querySelector(".mainSection");
    const books = document.querySelector("#books");

    mainSection.insertBefore(div, books);

    setTimeout(() => {
      this.clearAlert();
    }, 2000);
  }
  clearAlert() {
    const currentAlert = document.querySelector(".alert");

    if (currentAlert) {
      currentAlert.remove();
    }
  }
  clearFields() {
    this.bookName.value = "";
    this.bookAuthor.value = "";
    this.bookPubYear.value = "";
    this.id.value = "";
  }

  fillForm(data) {
    this.id.value = data.id;
    this.bookName.value = data.bookName;
    this.bookAuthor.value = data.authorName;
    this.bookPubYear.value = data.yearOfPublishment;

    console.log(this.bookName.value);

    this.changeFormState("edit");
  }

  clearIdInput() {
    this.id.value = "";
  }

  changeFormState(type) {
    if (type === "edit") {
      this.bookSubmit.textContent = "Update Book";
      this.bookSubmit.className = "btn btn-info bg-info col-md-4";

      if (!document.querySelector(".book-cancel")) {
        const button = document.createElement("button");
        button.className =
          "book-cancel btn btn-light btn-block mt-1 col-md-4 mx-auto";
        button.appendChild(document.createTextNode("Cancel Edit"));

        const cardForm = document.querySelector(".card-form");
        const formEnd = document.querySelector(".form-end");

        cardForm.insertBefore(button, formEnd);
      }
    } else {
      this.bookSubmit.textContent = "Publish Book";
      this.bookSubmit.className = "btnNew btn btn-primary bg-info col-md-4";

      if (document.querySelector(".book-cancel")) {
        document.querySelector(".book-cancel").remove();
      }

      this.clearIdInput();
      this.clearFields();
    }
  }
}

const ui = new UI();

const http = new BooksHTTP();
document.addEventListener("DOMContentLoaded", getBooks);
document.querySelector("#book-submit").addEventListener("click", submitBook);
document.querySelector("#books").addEventListener("click", deleteBook);
document.querySelector("#books").addEventListener("click", editBook);
document.querySelector(".card-form").addEventListener("click", cancelEdit);

function getBooks() {
  http
    .getHttp("http://localhost:3000/api/books")
    .then(data => ui.showBooks(data))
    .catch(err => err);
}

function submitBook(event) {
  event.preventDefault();
  const bookName = document.querySelector("#bookname").value;
  const authorName = document.querySelector("#author").value;
  const yearOfPublishment = document.querySelector("#yearOfPublishment").value;
  const id = document.querySelector("#id").value;

  const data = {
    bookName,
    authorName,
    yearOfPublishment
  };

  if (bookName === "" || authorName === "" || yearOfPublishment === "") {
    ui.showAlert(
      "Please fill in all fields",
      "alert alert-danger col-md-3 mx-auto"
    );
  } else {
    if (id === "") {
      http
        .postHttp("http://localhost:3000/api/books", data)
        .then(data => {
          ui.showAlert("Book Added", "alert alert-success col-md-3 mx-auto");
          ui.clearFields();
          getBooks();
        })
        .catch(err => console.log(err));
    } else {
      console.log(id);
      http
        .put(`http://localhost:3000/api/books/${id}`, data)
        .then(data => {
          ui.showAlert("Book Updated", "alert alert-success col-md-3 mx-auto");
          getBooks();
          ui.changeFormState("add");
        })
        .catch(err => console.log(err));
    }
  }
}

function deleteBook(e) {
  if (e.target.classList.contains("btnDelete")) {
    const id = e.target.dataset.id;
    if (confirm("Are you Sure ?")) {
      http
        .delete(`http://localhost:3000/api/books/${id}`)
        .then(data => {
          ui.showAlert("Book Removed", "alert alert-success col-md-3 mx-auto");
          getBooks();
        })
        .catch(err => console.log(err));
    }
  }
}

function editBook(e) {
  if (e.target.classList.contains("btnEdit")) {
    const id = e.target.dataset.id;
    const yearOfPublishment = e.target.previousElementSibling.textContent;
    const authorName =
      e.target.previousElementSibling.previousElementSibling.textContent;
    const bookName =
      e.target.previousElementSibling.previousElementSibling
        .previousElementSibling.textContent;

    const data = {
      id,
      bookName,
      authorName,
      yearOfPublishment
    };
    ui.fillForm(data);
  }

  e.preventDefault();
}

function cancelEdit(e) {
  if (e.target.classList.contains("book-cancel")) {
    ui.changeFormState("add");
  }
  e.preventDefault();
}
