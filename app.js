const bookForm = document.getElementById('newbook');
const bookTable = document.getElementById('booklist');
const booksApiUrl = 'https://bookstore-api-six.vercel.app/api/books';

const showToastSuccess = (message) => {
  Toastify({
    text: message,
    className: "success"
  }).showToast();
};

const showToastError = (message) => {
  Toastify({
    text: message,
    className: 'error'
  }).showToast();
};

const getBooks = async () => {
  try {
    const response = await fetch(`${booksApiUrl}?amount=10`);
    if (!response.ok) throw new Error('Failed to fetch books');
    const books = await response.json();
    books.forEach(book => addBookToTable(book));
  } catch (error) {
    showToastError(error.message);
  }
};

const addBookToTable = (book) => {
  const bookRow = document.createElement('section');
  bookRow.className = 'table-row';
  bookRow.dataset.id = book.id;
  
  bookRow.innerHTML = `
    <section class="table-item flex-1">${book.title || 'N/A'}</section>
    <section class="table-item item-borders flex-1">${book.author || 'N/A'}</section>
    <section class="table-item flex-1">${book.publisher || 'N/A'}</section>
    <section class="table-item flex-1">
      <button class="delete-button btn btn-danger">Delete</button>
    </section>
  `;
  bookTable.appendChild(bookRow);
};

document.addEventListener('DOMContentLoaded', () => {
  getBooks();

  bookForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    try {
      const payload = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        publisher: document.getElementById('publisher').value,
      };
      const response = await fetch(booksApiUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!response.ok) throw new Error('Failed to add book');
      const data = await response.json();
      addBookToTable(data);
      bookForm.reset();
      showToastSuccess('Book added successfully!');
    } catch (error) {
      showToastError(error.message);
    }
  });
});

document.addEventListener('click', async (event) => {
  if (event.target.classList.contains('delete-button')) {
    const bookRow = event.target.closest('.table-row');
    try {
      const response = await fetch(`${booksApiUrl}/${bookRow.dataset.id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete book');
      bookRow.remove();
      showToastSuccess('Book deleted successfully!');
    } catch (error) {
      showToastError(error.message);
    }
  }
});