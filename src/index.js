let addToy = false;

document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");
  const toyCollection = document.getElementById("toy-collection");

  const baseURL = "http://localhost:3000/toys";

  // Toggle toy form visibility
  addBtn.addEventListener("click", () => {
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });

  // Function to create a toy card
  function createToyCard(toy) {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;

    // Add event listener for likes
    const likeButton = card.querySelector(".like-btn");
    likeButton.addEventListener("click", () => {
      increaseLikes(toy);
    });

    toyCollection.appendChild(card);
  }

  // Fetch all toys and render them
  function fetchToys() {
    fetch(baseURL)
      .then((response) => response.json())
      .then((toys) => {
        toys.forEach(createToyCard);
      });
  }

  // Add a new toy
  toyForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const newToy = {
      name: event.target.name.value,
      image: event.target.image.value,
      likes: 0,
    };

    fetch(baseURL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(newToy),
    })
      .then((response) => response.json())
      .then((toy) => {
        createToyCard(toy); // Add the new toy to the DOM
        toyForm.reset(); // Clear the form
      });
  });

  // Increase toy likes
  function increaseLikes(toy) {
    const newLikes = toy.likes + 1;

    fetch(`${baseURL}/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ likes: newLikes }),
    })
      .then((response) => response.json())
      .then((updatedToy) => {
        // Update likes in the DOM
        const card = document.getElementById(updatedToy.id).parentElement;
        card.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      });
  }

  // Initial fetch of toys
  fetchToys();
});
