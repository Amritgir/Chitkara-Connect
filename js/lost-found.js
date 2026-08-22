const ITEMS_KEY = "cc_lost_found_items";

let currentFilter = "all";
let currentSearch = "";

document.addEventListener("DOMContentLoaded", function () {
  console.log("Lost & Found JS loaded successfully.");

  seedItems();
  renderItems();
  setupModal();
  setupFilters();
  setupSearch();
  setupForm();

  if (window.location.hash === "#add") {
    openAddModal();
  }
});

function seedItems() {
  const existingItems = localStorage.getItem(ITEMS_KEY);

  if (!existingItems) {
    const starterItems = typeof INITIAL_LOST_FOUND_ITEMS !== "undefined"
      ? INITIAL_LOST_FOUND_ITEMS
      : [];

    localStorage.setItem(ITEMS_KEY, JSON.stringify(starterItems));
  }
}

function getItems() {
  try {
    const items = JSON.parse(localStorage.getItem(ITEMS_KEY));
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("LocalStorage data error:", error);
    localStorage.setItem(ITEMS_KEY, JSON.stringify([]));
    return [];
  }
}

function saveItems(items) {
  localStorage.setItem(ITEMS_KEY, JSON.stringify(items));
}

function defaultImage() {
  return "https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=700&auto=format&fit=crop&q=70";
}

function renderItems() {
  const grid = document.getElementById("items-grid");

  if (!grid) {
    console.error("items-grid container not found.");
    return;
  }

  const currentUser = getCurrentUser();
  const items = getItems();

  const filteredItems = items.filter(function (item) {
    const matchesFilter = currentFilter === "all" || item.type === currentFilter;

    const query = currentSearch.toLowerCase();

    const matchesSearch =
      item.title.toLowerCase().includes(query) ||
      item.location.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query);

    return matchesFilter && matchesSearch;
  });

  if (filteredItems.length === 0) {
    grid.innerHTML = `
      <div class="card" style="grid-column: 1 / -1; text-align:center;">
        <div class="card-icon" style="margin:0 auto 15px;">
          <i class="fa-solid fa-box-open"></i>
        </div>
        <h3>No Items Found</h3>
        <p>No item matches your current search or filter criteria.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filteredItems.map(function (item) {
    const isOwner = currentUser && currentUser.email === item.ownerEmail;

    return `
      <div class="item-card">
        <div class="item-img">
          <img
            src="${item.imageUrl || defaultImage()}"
            onerror="this.src='${defaultImage()}'"
            alt="${item.title}"
          />

          <div class="badge-pos">
            <span class="badge ${item.type === "lost" ? "badge-lost" : "badge-found"}">
              <i class="fa-solid ${item.type === "lost" ? "fa-circle-exclamation" : "fa-circle-check"}"></i>
              ${item.type.toUpperCase()}
            </span>
          </div>
        </div>

        <div class="item-body">
          <p style="color:#e31e24; font-weight:900; text-transform:uppercase; font-size:0.75rem;">
            ${item.category}
          </p>

          <h3>${item.title}</h3>
          <p>${item.description}</p>

          <div class="meta">
            <span>
              <i class="fa-solid fa-location-dot" style="color:#e31e24;"></i>
              <b>Location:</b> ${item.location}
            </span>

            <span>
              <i class="fa-solid fa-calendar"></i>
              <b>Date:</b> ${item.date}
            </span>

            <span>
              <i class="fa-solid fa-user"></i>
              <b>Posted By:</b> ${item.contactName}
            </span>

            <span>
              <i class="fa-solid fa-envelope"></i>
              <b>Email:</b> ${item.ownerEmail}
            </span>

            <span>
              <i class="fa-solid fa-phone"></i>
              <b>Contact:</b> ${item.contactInfo}
            </span>
          </div>
        </div>

        <div class="item-footer">
          <a class="btn btn-sm btn-secondary" href="map.html?search=${encodeURIComponent(item.location)}">
            <i class="fa-solid fa-map"></i> View Map
          </a>

          ${
            isOwner
              ? `
                <button class="btn btn-sm btn-danger" type="button" onclick="removeItem('${item.id}')">
                  <i class="fa-solid fa-trash"></i> Remove
                </button>
              `
              : `
                <button class="btn btn-sm btn-secondary" type="button" disabled>
                  <i class="fa-solid fa-lock"></i> Owner Only
                </button>
              `
          }
        </div>
      </div>
    `;
  }).join("");
}

function setupModal() {
  const openBtn = document.getElementById("open-modal-btn");
  const closeBtn = document.getElementById("close-modal-btn");
  const modal = document.getElementById("item-modal");

  if (!openBtn || !closeBtn || !modal) {
    console.error("Modal elements not found.");
    return;
  }

  openBtn.addEventListener("click", function () {
    openAddModal();
  });

  closeBtn.addEventListener("click", function () {
    modal.classList.remove("open");
  });

  modal.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.classList.remove("open");
    }
  });
}

function openAddModal() {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    alert("Please login first to add an item.");
    window.location.href = "login.html?next=lost-found.html#add";
    return;
  }

  const modal = document.getElementById("item-modal");
  modal.classList.add("open");
}

function setupForm() {
  const form = document.getElementById("item-form");

  if (!form) {
    console.error("Item form not found.");
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const currentUser = getCurrentUser();

    if (!currentUser) {
      alert("Please login first to publish an item.");
      window.location.href = "login.html?next=lost-found.html#add";
      return;
    }

    const title = document.getElementById("title").value.trim();
    const description = document.getElementById("description").value.trim();
    const contact = document.getElementById("contact").value.trim();

    if (!title || !description || !contact) {
      alert("Please fill all required fields.");
      return;
    }

    const newItem = {
      id: "item-" + Date.now(),
      type: document.getElementById("type").value,
      title: title,
      category: document.getElementById("category").value,
      location: document.getElementById("location").value,
      description: description,
      contactName: currentUser.name,
      contactInfo: contact,
      imageUrl: document.getElementById("image").value.trim() || defaultImage(),
      date: new Date().toISOString().split("T")[0],
      ownerEmail: currentUser.email
    };

    const items = getItems();
    items.unshift(newItem);
    saveItems(items);

    form.reset();

    const modal = document.getElementById("item-modal");
    modal.classList.remove("open");

    alert("Your item has been published successfully.");
    renderItems();
  });
}

window.removeItem = function (id) {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    alert("Please login first.");
    return;
  }

  const items = getItems();
  const item = items.find(function (i) {
    return i.id === id;
  });

  if (!item) {
    alert("Item not found.");
    return;
  }

  if (item.ownerEmail !== currentUser.email) {
    alert("You cannot remove this item because you are not the owner of this post.");
    return;
  }

  const confirmDelete = confirm("Are you sure you want to remove this item from the portal?");

  if (!confirmDelete) return;

  const updatedItems = items.filter(function (i) {
    return i.id !== id;
  });

  saveItems(updatedItems);

  alert("Item removed successfully.");
  renderItems();
};

function setupFilters() {
  const buttons = document.querySelectorAll(".filter-btn");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      buttons.forEach(function (btn) {
        btn.classList.remove("active");
      });

      button.classList.add("active");
      currentFilter = button.dataset.type;
      renderItems();
    });
  });
}

function setupSearch() {
  const search = document.getElementById("item-search");

  if (!search) {
    console.error("Search input not found.");
    return;
  }

  search.addEventListener("input", function () {
    currentSearch = search.value.trim();
    renderItems();
  });
}