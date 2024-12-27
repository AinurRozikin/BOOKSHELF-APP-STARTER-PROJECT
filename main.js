// Mendapatkan elemen DOM yang dibutuhkan
const bookForm = document.getElementById('bookForm');
const incompleteBookList = document.getElementById('incompleteBookList');
const completeBookList = document.getElementById('completeBookList');
const searchBookForm = document.getElementById('searchBook');
const bookFormTitle = document.getElementById('bookFormTitle');
const bookFormAuthor = document.getElementById('bookFormAuthor');
const bookFormYear = document.getElementById('bookFormYear');
const bookFormIsComplete = document.getElementById('bookFormIsComplete');

// Fungsi untuk menyimpan data ke localStorage dengan log
function saveBooksToLocalStorage(books) {
  try {
    localStorage.setItem('books', JSON.stringify(books));
    console.log('Data berhasil disimpan ke localStorage:', books);
  } catch (error) {
    console.error('Gagal menyimpan data ke localStorage:', error);
  }
}

// Fungsi untuk mengambil data buku dari localStorage dengan log
function loadBooksFromLocalStorage() {
  try {
    const books = JSON.parse(localStorage.getItem('books')) || [];
    console.log('Data berhasil dimuat dari localStorage:', books);
    return books;
  } catch (error) {
    console.error('Gagal memuat data dari localStorage:', error);
    return [];
  }
}

// Fungsi untuk menampilkan buku saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  console.log('Memuat data buku dari localStorage...');
  displayBooks();
});

// Fungsi untuk menampilkan buku pada rak yang sesuai
function displayBooks() {
  const books = loadBooksFromLocalStorage();
  
  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';
  
  books.forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');
    
    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div class="group">
        <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      </div>
    `;
    
    const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
    const completeButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
    
    deleteButton.addEventListener('click', () => deleteBook(book.id));
    completeButton.addEventListener('click', () => toggleComplete(book.id));

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });

  incompleteBookList.hidden = incompleteBookList.children.length === 0;
  completeBookList.hidden = completeBookList.children.length === 0;
}

// Fungsi untuk menambahkan buku baru
bookForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const title = bookFormTitle.value;
  const author = bookFormAuthor.value;
  const year = Number(bookFormYear.value);
  const isComplete = bookFormIsComplete.checked;
  const id = new Date().getTime();  // Menggunakan timestamp sebagai ID yang unik

  const newBook = {
    id,
    title,
    author,
    year,
    isComplete
  };

  const books = loadBooksFromLocalStorage();
  books.push(newBook);
  saveBooksToLocalStorage(books);

  bookForm.reset();
  displayBooks();
});

// Fungsi untuk menghapus buku
function deleteBook(id) {
  const books = loadBooksFromLocalStorage();
  const updatedBooks = books.filter(book => book.id !== id);
  saveBooksToLocalStorage(updatedBooks);
  displayBooks();
}

// Fungsi untuk memindahkan buku antar rak (belum selesai dibaca <-> selesai dibaca)
function toggleComplete(id) {
  const books = loadBooksFromLocalStorage();
  const updatedBooks = books.map(book => {
    if (book.id === id) {
      book.isComplete = !book.isComplete;
    }
    return book;
  });
  saveBooksToLocalStorage(updatedBooks);
  displayBooks();
}

// Fungsi untuk mencari buku
searchBookForm.addEventListener('submit', function(event) {
  event.preventDefault();

  const searchTitle = document.getElementById('searchBookTitle').value.toLowerCase();
  const books = loadBooksFromLocalStorage();

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTitle)
  );

  incompleteBookList.innerHTML = '';
  completeBookList.innerHTML = '';

  filteredBooks.forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.setAttribute('data-bookid', book.id);
    bookElement.setAttribute('data-testid', 'bookItem');
    
    bookElement.innerHTML = `
      <h3 data-testid="bookItemTitle">${book.title}</h3>
      <p data-testid="bookItemAuthor">Penulis: ${book.author}</p>
      <p data-testid="bookItemYear">Tahun: ${book.year}</p>
      <div class="group">
        <button data-testid="bookItemIsCompleteButton">${book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca'}</button>
        <button data-testid="bookItemDeleteButton">Hapus Buku</button>
      </div>
    `;
    
    const deleteButton = bookElement.querySelector('[data-testid="bookItemDeleteButton"]');
    const completeButton = bookElement.querySelector('[data-testid="bookItemIsCompleteButton"]');
    
    deleteButton.addEventListener('click', () => deleteBook(book.id));
    completeButton.addEventListener('click', () => toggleComplete(book.id));

    if (book.isComplete) {
      completeBookList.appendChild(bookElement);
    } else {
      incompleteBookList.appendChild(bookElement);
    }
  });

  incompleteBookList.hidden = incompleteBookList.children.length === 0;
  completeBookList.hidden = completeBookList.children.length === 0;
});

// Menampilkan buku saat halaman dimuat
document.addEventListener('DOMContentLoaded', displayBooks);
