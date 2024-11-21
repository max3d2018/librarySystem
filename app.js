class UI {
  author = document.querySelector("#author");
  title = document.querySelector("#title");
  bookId = document.querySelector("#id");
  isReadCb = document.querySelector("#isRead");
  searchField = document.querySelector("#search");
  addBtn = document.querySelector("#add-btn");
  searchBtn = document.querySelector("#search-btn");
  sectionBooks = document.querySelector("#books");

  constructor() {
    this.addBtn.addEventListener("click", this.addBookUI.bind(this));

    this.searchBtn.addEventListener("click", function () {
      if (!searchField.value) return;

      const result = bookManger.searchBook(searchField.value);
      console.log(result);
    });
  }

  addBookUI() {
    const authorVal = this.author.value;
    const titleVal = this.title.value;
    const bookIdVal = this.bookId.value;
    const isRead = this.isReadCb.checked;

    console.log(isRead);

    if (!authorVal || !titleVal || !bookIdVal) return;

    const book = new Book(authorVal, titleVal, bookIdVal, isRead);

    bookManger.addBook(book);
    console.log(bookManger);
    this.addBookToUI(book);
  }

  addBookToUI(book) {
    const bookUi = ` <div
        class="p-2 border border-2 border-slate-900 p-4 rounded-lg space-y-2"
      >
        <p class="w-25">
          <span
            class="bg-gray-300 text-sm p-1 inline-block w-16 text-red-400 text-center font-medium"
            >نام
          </span>
          ${book.title}
        </p>
        <p class="">
          <span
            class="bg-gray-300 p-1 text-sm inline-block w-16 text-red-400 text-center font-medium"
            >نویسنده
          </span>
          ${book.author}
        </p>
        <p class="">
          <span
            class="bg-gray-300 p-1 text-sm inline-block w-16 text-red-400 text-center font-medium"
            >شناسه
          </span>
          ${book.bookId}
        </p>
        <p class="">
          <span
            class="bg-gray-300 p-1 text-sm inline-block w-16 text-red-400 text-center font-medium"
            >خوانده
          </span>
           ${book.isRead ? "بله" : "خیر"}
        </p>
      </div>`;
    this.sectionBooks.insertAdjacentHTML("afterbegin", bookUi);
  }
}

class Book {
  constructor(author, title, bookId, isRead) {
    this.author = author;
    this.title = title;
    this.bookId = bookId;
    this.isRead = isRead;
  }
}

class BooksManager {
  books = [];

  addBook(book) {
    this.books.push(book);
  }

  searchBook(titleOrAuthor) {
    console.log(titleOrAuthor);
    const book = this.books.find((el) => {
      console.log(el);
      if (el.title === titleOrAuthor || el.author === titleOrAuthor)
        return true;
    });

    if (book) return book;

    return "not Found";
  }
}

const ui = new UI();
const bookManger = new BooksManager();
