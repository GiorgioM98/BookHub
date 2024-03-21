import _ from "lodash";
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/style.css";

// Main function to search the books
function getBooks() {
  // Function to search by genre
  function searchByGenre(event) {
    event.preventDefault();

    // Take genre from input
    const genere = _.toLower(document.querySelector(".inputSearch").value);

    if (_.isEmpty(genere)) {
      alert("Please enter something!");
      return;
    }

    // Some info with display none/inline
    const booksLayover = document.querySelector(".booksLayover");
    booksLayover.innerHTML = "";

    const spinner = document.querySelector(".spinner-grow");
    spinner.style.display = "inline-block";

    const footer = document.querySelector("footer");
    footer.style.display = "none";

  


    // Fetch api with genre
    fetch(`https://openlibrary.org/subjects/${genere}.json?details=true&limit=40`)
      .then(function (response) {
        if (response.status !== 200) {
          console.log(`error:${response.status}`);
          return;
        }

        response.json().then(function (data) {
          displayBooks(data);

          // Some info with display none/inline
          const genere = document.querySelector(".inputSearch");
          const rowScroll = document.querySelector(".rowScroll");
          // const btnLoadMore= document.querySelector(".btnLoadMore");
          // const rowBtn= document.querySelector(".rowBtn");
          genere.value = "";
          rowScroll.style.display = "inline-block";
          // btnLoadMore.style.display = "inline-block";
          // rowBtn.style.display = "block";
          spinner.style.display = "none";

          // Check if there are no works
          if (_.isEmpty(data.works) || data.works === undefined) {
            alert("Please enter a valid genre");
            rowScroll.style.display = "none";
            footer.style.display = "inline-block";
          }
        });
      })

       // Catch error 
      .catch(function (err) {
        console.log(`Fetch error${err}`);
      });
  }
  // Add Event Listener to search button
  const btnSearch = document.querySelector(".btnSearch");
  btnSearch.addEventListener("click", searchByGenre);
}


// Funzione per visualizzare i libri
function displayBooks(books) {
  const booksLayover = document.querySelector(".booksLayover");
  let rowBooks;


  // Check if need to create a new row
  books.works.forEach((book, index) => {
    if (index % 4 === 0) {

      // Create a new row
      rowBooks = document.createElement("div");
      rowBooks.classList.add("row");
      booksLayover.appendChild(rowBooks);
    }

    const colBooks = document.createElement("div");
    colBooks.classList.add(
      "col-md-6",
      "col-lg-3",
      "col-12",
      "my-3",
      "colBooks",
      "d-flex",
      "justify-content-center"
    );
    rowBooks.appendChild(colBooks);

    const card = document.createElement("div");

    // Create a card
    card.classList.add("card", "d-flex", "flex-column", "align-items-center");
    colBooks.appendChild(card);
    card.style.width = "15rem";
    card.style.height = "27rem";

    const img = document.createElement("img");
    img.classList.add("card-img-top");
    card.appendChild(img);
    img.src = `https://covers.openlibrary.org/b/id/${book.cover_id}-L.jpg`;
    img.style.width = "10rem";
    img.style.height = "12rem";

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");
    card.appendChild(cardBody);

    // Card title
    const h5 = document.createElement("h5");
    h5.classList.add("card-title");
    cardBody.appendChild(h5);
    h5.innerHTML = book.title;

    // Card authors
    const p = document.createElement("p");
    p.classList.add("card-text");
    cardBody.appendChild(p);
    p.innerHTML = `AUTORE: ${book.authors[0].name}`;


    // Card Description
    const btnDescrizione = document.createElement("a");
    btnDescrizione.classList.add("btn", "btn-primary", "btnDescrizione");
    cardBody.appendChild(btnDescrizione);
    btnDescrizione.innerHTML = "DESCRIPTION";


    // Add Event Listener to description button
    btnDescrizione.addEventListener("click", function () {
      getBooksDescription(book.key);
    });
  });
}


// Function to get books description
function getBooksDescription(key) {

  // Fetch api with genre
  fetch(`https://openlibrary.org${key}.json?`)
    .then(function (response) {
      if (response.status !== 200) {
        console.log(`error:${response.status}`);
        return;
      }

      response.json().then(function (data) {
        displayDescription(data);
      });
    })

    // Catch error 
    .catch(function (err) {
      console.log(`fetch error${err}`);
    });
}

// Function to display description
function displayDescription(info) {

  // Create alert
  const alertDiv = document.createElement("div");
  alertDiv.classList.add(
    "alert",
    "alert-primary",
    "position-fixed",
    "top-50",
    "start-50",
    "translate-middle",
    "text-center"
  );
  alertDiv.setAttribute("role", "alert");
  document.body.appendChild(alertDiv);


  // Check if there is no description
  if (
    typeof info.description !== "string" ||
    typeof info.description === "undefined"
  ) {
    alertDiv.innerHTML = `&#128712;<h3>TITLE:</h3><h4>${info.title}</h4><br><h3>DESCRIPTION:</h3><h4>Oops! Sorry, there is no description available for this book.</h4>`;
  } else {
    alertDiv.innerHTML = `&#128712;<h3>TITLE:</h3><h4>${info.title}</h4><br><h3>DESCRIPTION:</h3><h4>${info.description}</h4>`;
  }


  // Add Event Listener to close alert
  document.addEventListener("click", function (event) {
    if (event.target !== alertDiv && !alertDiv.contains(event.target)) {
      alertDiv.style.display = "none";
    }
  });


  // Add close button
  alertDiv.innerHTML +=
    '<button type="button" class="btn-close", data-bs-dismiss="alert" aria-label="Close"></button>';
}



getBooks();

