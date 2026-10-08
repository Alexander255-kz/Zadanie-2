const SUPABASE_URL = "https://coimqydotznckkoeyfyg.supabase.co";

const SUPABASE_KEY = "sb_publishable_Hk1E0M9Kyh_pyMI_3KqHYg_BKEfKGnX";

const client = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

const booksContainer = document.getElementById("books");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const statusText = document.getElementById("status");

let allBooks = [];

async function loadBooks() {

    const { data, error } = await client
        .from("books")
        .select(`
            id,
            title,
            peice,
            authors(name)
        `);

    if (error) {
        console.error(error);
        statusText.textContent = error.message;
        return;
    }

    allBooks = data;
    statusText.textContent = "";

    displayBooks();
}

function displayBooks() {

    let books = [...allBooks];

    const searchText = searchInput.value.toLowerCase();

    books = books.filter(book =>
        book.title.toLowerCase().includes(searchText) ||
        (book.authors?.name || "")
            .toLowerCase()
            .includes(searchText)
    );

    switch (sortSelect.value) {
        case "title-asc":
            books.sort((a,b) => a.title.localeCompare(b.title));
            break;

        case "title-desc":
            books.sort((a,b) => b.title.localeCompare(a.title));
            break;

        case "price-asc":
            books.sort((a,b) => a.peice - b.peice);
            break;

        case "price-desc":
            books.sort((a,b) => b.peice - a.peice);
            break;
    }

    booksContainer.innerHTML = "";

    books.forEach(book => {

        booksContainer.innerHTML += `
            <div class="book">
                <h2>${book.title}</h2>

                <p class="author">
                    Автор:
                    ${book.authors?.name ?? "Не указан"}
                </p>

                <p class="price">
                    ${book.peice} ₸
                </p>
            </div>
        `;
    });
}

searchInput.addEventListener("input", displayBooks);
sortSelect.addEventListener("change", displayBooks);

loadBooks();
