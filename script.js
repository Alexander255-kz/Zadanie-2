const SUPABASE_URL = "https://coimqydotznckkoeyfyg.supabase.co";

const SUPABASE_KEY = "sb_publishable_Hk1E0M9Kyh_pyMI_3KqHYg_BKEfKGnX";

const client = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

let allBooks = [];

const booksContainer = document.getElementById("books");
const searchInput = document.getElementById("search");
const sortSelect = document.getElementById("sort");
const statusText = document.getElementById("status");

async function loadBooks() {

    const { data, error } = await client
        .from("books")
        .select("*");

    console.log("DATA:", data);
    console.log("ERROR:", error);

    if (error) {
        console.error(error);
        statusText.textContent =
            "Ошибка: " + error.message;
        return;
    }

    allBooks = data || [];

    statusText.textContent = "";

    displayBooks();
}

function displayBooks() {

    let books = [...allBooks];

    const searchText =
        searchInput.value.toLowerCase();

    books = books.filter(book => {

        const title =
            (book.title || "")
            .toLowerCase();

        return title.includes(searchText);

    });

    const sort = sortSelect.value;

    if (sort === "title-asc") {

        books.sort((a, b) =>
            (a.title || "")
            .localeCompare(b.title || "")
        );

    }

    if (sort === "title-desc") {

        books.sort((a, b) =>
            (b.title || "")
            .localeCompare(a.title || "")
        );

    }

    if (sort === "price-asc") {

        books.sort((a, b) =>
            Number(a.peice || 0) -
            Number(b.peice || 0)
        );

    }

    if (sort === "price-desc") {

        books.sort((a, b) =>
            Number(b.peice || 0) -
            Number(a.peice || 0)
        );

    }

    booksContainer.innerHTML = "";

    if (books.length === 0) {

        booksContainer.innerHTML =
            "<p>Книги не найдены</p>";

        return;
    }

    books.forEach(book => {

        const div =
            document.createElement("div");

        div.className = "book";

        div.innerHTML = `
            <h2>${book.title}</h2>

            <p class="author">
                Автор ID: ${book.author_id}
            </p>

            <p class="price">
                ${book.peice} ₸
            </p>
        `;

        booksContainer.appendChild(div);

    });

}

searchInput.addEventListener(
    "input",
    displayBooks
);

sortSelect.addEventListener(
    "change",
    displayBooks
);

loadBooks();
