const quoteList = document.getElementById("quote-list");
const submit = document.getElementById("submit");
const newQuote = document.getElementById("new-quote");
const newAuthor = document.getElementById("author");

//last quote id variable
let lastId = 0;

//last like id variable
let lastLikeId = 0;

//Getting the last Id in the likes data
fetch("http://localhost:3000/likes").then(res => res.json()).then(data => {
    lastLikeId = data[data.length - 1].id;
})

//Creating a new quote block that assigns an ID based on the last ID from db.json
submit.addEventListener("click", (e) => {
    e.preventDefault();
    lastId++;

    fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers : {
            "Content-Type" : "application/json",
            "Accept" : "application/json"
        },
        body : JSON.stringify({
            "id": lastId,
            "quote": newQuote.value,
            "author" : newAuthor.value
        })
    }).then(res => res.json()).then(data => console.log(data))
})

fetch("http://localhost:3000/quotes?_embed=likes").then(res => res.json()).then(data => {

    //Getting the last ID
    lastId = data[data.length - 1].id;

    //Mapping through the data and creating each quote block
    data.map(({id, quote, author, likes}) => {
        const li = document.createElement("li");
        const blockquote = document.createElement("blockquote");
        const p = document.createElement("p");
        const footer = document.createElement("footer");
        const br = document.createElement("br");
        const likeButton = document.createElement("button");
        const deleteButton = document.createElement("button");
        const span = document.createElement("span");

        li.classList.add("quote-card");
        blockquote.classList.add("blockquote");
        p.classList.add("mb-0");
        footer.classList.add("blockquote-footer");
        likeButton.classList.add("btn-success");
        deleteButton.classList.add("btn-danger");

        p.textContent = quote;
        footer.textContent = author;
        span.textContent = likes.length;
        likeButton.textContent = `Likes: `;
        deleteButton.textContent = "Delete";

        blockquote.appendChild(p);
        blockquote.appendChild(footer);
        blockquote.appendChild(br);
        blockquote.appendChild(likeButton);
        likeButton.appendChild(span);
        blockquote.appendChild(deleteButton);

        li.appendChild(blockquote);
        quoteList.appendChild(li);

        //Liking a quote
        likeButton.addEventListener("click", () => {
            lastLikeId++;

            const day = new Date();
            const now = Math.floor(day.getTime() / 1000);

            fetch("http://localhost:3000/likes", {
                method:"POST",
                headers: {
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                },
                body: JSON.stringify({
                    "quoteId" : id,
                    "id" : lastLikeId,
                    "createdAt" : now
                })
            }).then(res => res.json()).then(data => console.log(data));
        })

        //Deleting a quote
        deleteButton.addEventListener("click", (e) => {
            e.preventDefault();

            fetch(`http://localhost:3000/quotes/${id}`, {
                method:"DELETE",
                headers: {
                    "Content-Type" : "application/json",
                    "Accept": "application/json"
                }
            }).then(res => res.json()).then(data => console.log(data));
        })
    })
})