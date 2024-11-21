class UI {
  author = document.querySelector("#author");
  title = document.querySelector("#title");
  bookId = document.querySelector("#id");
  isReadCb = document.querySelector("#isRead");
  searchField = document.querySelector("#search");
  addBtn = document.querySelector("#add-btn");
  searchBtn = document.querySelector("#search-btn");
  sectionBooks = document.querySelector("#books");
  body = document.querySelector("body");
}

class SearchUI extends UI {
  constructor() {
    super();
    this.searchBtn.addEventListener("click", this.search.bind(this));
  }

  search() {
    if (!this.searchField.value) return;

    const result = bookManger.searchBook(this.searchField.value);
    console.log(result);
  }
}

class NewBookUI extends UI {
  constructor() {
    super();
    this.addBtn.addEventListener("click", this.addBookUI.bind(this));
  }
  addBookUI() {
    const authorVal = this.author.value;
    const titleVal = this.title.value;
    const bookIdVal = this.bookId.value;
    const isRead = this.isReadCb.checked;

    if (!authorVal || !titleVal || !bookIdVal) return;

    const book = new Book(authorVal, titleVal, bookIdVal, isRead);

    bookManger.addBook(book);
    this.eraseFields();
    modal.showModalOfCreatedBook(book);
    this.addBookToUI(book);
  }

  eraseFields() {
    this.author.value = "";
    this.title.value = "";
    this.bookId.value = "";
    this.isReadCb.checked = "";
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

class ModalUI extends UI {
  constructor() {
    super();
    this.body.addEventListener("click", this.closeModal.bind(this));
  }

  createModalHtml(book) {
    const modalHTML = `<div
    id='modal'
    class="relative z-10 "
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div
      class="fixed inset-0 bg-gray-500/75 transition-opacity"
      aria-hidden="true"
    ></div>

    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div
        class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0"
      >
        <div
          class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
            <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left space-y-2 text-center"
              >
                <h1 class="text-xl">کتاب با مشخصات زیر ثبت شد</h1>
                <div class="space-y-2">
                  <p>نام : ${book.title}</p>
                  <p>نویسنده : ${book.author}</p>
                  <p>${book.bookId}: 23413</p>
                  <p>خوانده؟ : ${book.isRead ? "بله" : "خیر"}</p>
                </div>
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6"
          >
            <button
              id = 'closeModalBtn'
              type="button"
              class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
            >
              بستن
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>`;

    return modalHTML;
  }

  showModalOfCreatedBook(book) {
    const modalHTML = this.createModalHtml(book);
    this.body.insertAdjacentHTML("afterbegin", modalHTML);
  }

  closeModal(e) {
    if (e.target.id === "closeModalBtn") {
      e.target.closest("#modal").remove();
    }
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

// Initialization

const modal = new ModalUI();
const bookUI = new NewBookUI();
const searchUI = new SearchUI();
const bookManger = new BooksManager();
