class UI {
  author = document.querySelector("#author");
  title = document.querySelector("#title");
  bookId = document.querySelector("#id");
  isReadCb = document.querySelector("#isRead");
  searchField = document.querySelector("#search");
  addBtn = document.querySelector("#add-btn");
  searchBtn = document.querySelector("#search-btn");
  sectionBooks = document.querySelector("#books");
  bookFilterSelect = document.querySelector("#bookFilter");
  body = document.querySelector("body");
}

class AlertUI extends UI {
  showAlert(message) {
    const alertHTML = `
      <div id="alert" class="fixed top-0 left-0 right-0 w-full transform duration-300 ease-in-out translate-y-0 z-50">
        <div class="max-w-full mx-auto p-4">
          <div class="bg-gradient-to-r from-red-500 to-pink-500 rounded-lg shadow-lg overflow-hidden">
            <div class="p-4">
              <div class="flex items-center justify-between">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 4.75L19.25 9L12 13.25L4.75 9L12 4.75Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                      <path d="M4.75 15L12 19.25L19.25 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                    </svg>
                  </div>
                  <div class="mr-3">
                    <h3 class="text-white text-lg font-medium">خطا در ثبت کتاب</h3>
                    <div class="text-red-100 text-sm mt-1">${message}</div>
                  </div>
                </div>
                <div>
                  <button type="button" class="text-white hover:text-red-100 focus:outline-none" onclick="this.closest('#alert').remove()">
                    <svg class="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            <div class="h-1 w-full bg-red-200">
              <div class="h-full bg-white w-full animate-shrink"></div>
            </div>
          </div>
        </div>
      </div>
      <style>
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
        .animate-shrink {
          animation: shrink 3s linear forwards;
        }
      </style>`;

    // حذف alert قبلی اگر وجود داشته باشد
    const existingAlert = document.querySelector("#alert");
    if (existingAlert) {
      existingAlert.remove();
    }

    // اضافه کردن alert جدید
    this.body.insertAdjacentHTML("afterbegin", alertHTML);

    // اضافه کردن کلاس برای انیمیشن ورود
    const alert = document.querySelector("#alert");
    setTimeout(() => {
      alert?.classList.add("translate-y-0");
    }, 1);

    // حذف alert بعد از 3 ثانیه
    setTimeout(() => {
      const alert = document.querySelector("#alert");
      if (alert) {
        alert.classList.add("opacity-0", "-translate-y-full");
        setTimeout(() => alert.remove(), 300);
      }
    }, 3000);
  }
}

// بقیه کدها بدون تغییر می‌مانند...
class BookFilterUI extends UI {
  fitlerOnBooks = "all";
  constructor() {
    super();
    this.bookFilterSelect.addEventListener("change", this.filter.bind(this));
  }

  filter(e) {
    this.fitlerOnBooks = e.target.value;
    bookUI.showBooks(bookManger.getBooks());
  }
}

class SearchUI extends UI {
  constructor() {
    super();
    this.searchBtn.addEventListener("click", this.search.bind(this));
  }

  search() {
    if (!this.searchField.value) return;
    const result = bookManger.searchBook(this.searchField.value);
    modal.showModal(result, true);
  }
}

class NewBookUI extends UI {
  constructor(books) {
    super();
    this.showBooks(books);
    this.addBtn.addEventListener("click", this.addBookUI.bind(this));
    this.alert = new AlertUI();
  }

  addBookUI() {
    const authorVal = this.author?.value;
    const titleVal = this.title?.value;
    const bookIdVal = this.bookId?.value;
    const isRead = this.isReadCb?.checked;

    if (!authorVal || !titleVal || !bookIdVal) {
      this.alert.showAlert("همه موارد باید تکمیل شوند ");
      return;
    }

    const book = new Book(authorVal, titleVal, bookIdVal, isRead);

    if (bookManger.addBook(book)) {
      this.eraseFields();
      modal.showModal(book);
      this.addBookToUI(book);
      bookManger.save();
    } else {
      // نمایش پیغام خطا در صورت تکراری بودن کتاب
      this.alert.showAlert("این کتاب قبلاً در سیستم ثبت شده است!");
    }
  }

  eraseFields() {
    this.author.value = "";
    this.title.value = "";
    this.bookId.value = "";
    this.isReadCb.checked = "";
  }

  getCreatedBookHtml({ title, author, bookId, isRead }) {
    const bookHtml = `<div class="bg-white rounded-lg shadow-lg p-4 space-y-4 border border-gray-200">
  <div class="flex items-center justify-between">
    <h3 class="text-lg font-bold text-indigo-600">${title}</h3>
    <span class="text-sm text-gray-500">شناسه: ${bookId}</span>
  </div>
  <div class="text-gray-700">
    <p class="flex items-center space-x-2">
      <span class="font-medium text-gray-600">نویسنده:</span>
      <span>${author}</span>
    </p>
    <p class="flex items-center space-x-2">
      <span class="font-medium text-gray-600">وضعیت:</span>
      <span class="${
        isRead ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
      }">
        ${isRead ? "خوانده شده" : "خوانده نشده"}
      </span>
    </p>
  </div>
  ${
    !isRead
      ? `<button id='bookReadState' data-bookId="${bookId}" 
          class="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-center font-medium transition duration-150">
          علامت خوانده شده
        </button>`
      : ""
  }
</div>
`;

    return bookHtml;
  }

  addBookToUI(book, fromShowBooks = false) {
    const bookUIHtml = this.getCreatedBookHtml(book);
    if (fromShowBooks) return bookUIHtml;
    this.sectionBooks.insertAdjacentHTML("afterbegin", bookUIHtml);
  }

  showBooks(books) {
    let html = "";
    for (let book of books) {
      html += this.addBookToUI(book, true);
    }
    this.sectionBooks.innerHTML = html;
  }
}

class ModalUI extends UI {
  constructor() {
    super();
    this.body.addEventListener("click", this.closeModal.bind(this));
  }

  createModalHtml(book, searched = false) {
    let showingContent;
    if (typeof book === "string") {
      showingContent = `<h1 class="text-xl">کتابی یافت نشد</h1>`;
    } else {
      showingContent = `<h1 class="text-xl">${
        searched ? "کتاب با مشخصات زیر موجود است" : "کتاب با مشخصات زیر ثبت شد"
      }</h1> <div class="space-y-2">
                  <p>نام : ${book?.title}</p>
                  <p>نویسنده : ${book?.author}</p>
                  <p>${book?.bookId}: 23413</p>
                  <p>خوانده؟ : ${book?.isRead ? "بله" : "خیر"}</p>
                </div>`;
    }

    const modalHTML = `<div
  id="modal"
  class="fixed inset-0 flex items-center justify-center bg-black/50 z-50 backdrop-blur-md transition-opacity"
  role="dialog"
  aria-labelledby="modal-title"
  aria-modal="true"
>
  <!-- Background Overlay -->
  <div
    class="absolute inset-0 bg-black opacity-40 transition-opacity"
    aria-hidden="true"
  ></div>

  <!-- Modal Content -->
  <div
    class="relative bg-white rounded-lg shadow-lg transform transition-all w-full max-w-md mx-4 sm:mx-auto"
  >
    <!-- Modal Header -->
    <div class="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
      <h2 id="modal-title" class="text-lg font-semibold text-gray-800">
      </h2>
      <button
        id="closeModalBtn"
        type="button"
        class="text-gray-500 hover:text-gray-800 focus:outline-none"
      >
        ✕
      </button>
    </div>

    <!-- Modal Body -->
    <div class="px-6 py-4">
      <div class="space-y-4 text-gray-700">
        ${showingContent || "جزئیات در اینجا نمایش داده می‌شود."}
      </div>
    </div>

    <!-- Modal Footer -->
    <div class="px-6 py-3 bg-gray-50 flex justify-end space-x-2">
      <button
        id="closeModalBtn"
        type="button"
        class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 focus:ring-2 focus:ring-indigo-500"
      >
        تایید
      </button>
    </div>
  </div>
</div>
`;

    return modalHTML;
  }

  showModal(book, searched) {
    const modalHTML = this.createModalHtml(book, searched);
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

class SectionBooksUI extends UI {
  constructor() {
    super();
    this.sectionBooks.addEventListener(
      "click",
      this.changeReadState.bind(this)
    );
  }

  changeReadState(e) {
    if (e.target.id === "bookReadState") {
      const id = e.target?.getAttribute("data-bookid");
      const book = bookManger.getBook(id);
      book.isRead = true;
      bookUI.showBooks(bookManger.getBooks());
      bookManger.save();
    }
  }
}

class BooksManager {
  books = [];

  constructor() {
    this.load();
  }

  save() {
    localStorage.setItem("books", JSON.stringify(this.books));
  }

  load() {
    this.books = JSON.parse(localStorage.getItem("books")) || [];
  }

  getBooks() {
    let books = [...this.books];
    switch (bookFilterUI.fitlerOnBooks) {
      case "all":
        books = this.books;
        break;
      case "read":
        books = this.books.filter(({ isRead }) => isRead === true);
        break;
      case "notRead":
        books = this.books.filter(({ isRead }) => isRead !== true);
        break;
    }

    return books;
  }

  getBook(id) {
    const book = this.books.find(({ bookId }) => {
      if (String(bookId) === id) return true;
      return false;
    });
    return book;
  }

  isRepeated(book) {
    return this.books.find((bookEl) => {
      if (
        bookEl.title === book.title &&
        bookEl.author === book.author &&
        bookEl.bookId === book.bookId
      )
        return bookEl;
    });
  }

  addBook(book) {
    if (!this.isRepeated(book)) {
      this.books.push(book);
      return true;
    }

    return false;
  }

  searchBook(titleOrAuthor) {
    const book = this.books.find(({ title, author }) => {
      if (title === titleOrAuthor || author === titleOrAuthor) return true;
    });

    if (book) return book;

    return "not Found";
  }
}

// Initialization

const bookManger = new BooksManager();
const modal = new ModalUI();
const bookFilterUI = new BookFilterUI();
const bookUI = new NewBookUI(bookManger.getBooks());
const searchUI = new SearchUI();
const sectionBookUI = new SectionBooksUI();
