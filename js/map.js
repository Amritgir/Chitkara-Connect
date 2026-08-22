let map;
let markersLayer = L.layerGroup();

const CAMPUS_CENTER = [30.5161, 76.6593];

document.addEventListener("DOMContentLoaded", () => {
  initMap();
  renderBlocks(CHITKARA_BLOCKS);
  plotMarkers(CHITKARA_BLOCKS);
  setupSearch();
  setupCategoryFilters();
  checkURLSearch();
});

function initMap() {
  map = L.map("campus-map").setView(CAMPUS_CENTER, 17);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap | Chitkara Connect"
  }).addTo(map);

  markersLayer.addTo(map);
}

function plotMarkers(blocks) {
  markersLayer.clearLayers();

  blocks.forEach(block => {
    const icon = L.divIcon({
      className: "",
      html: `
        <div style="
          width:34px;
          height:34px;
          background:#e31e24;
          color:white;
          border-radius:50%;
          border:3px solid white;
          display:grid;
          place-items:center;
          box-shadow:0 5px 15px rgba(0,0,0,0.3);
        ">
          <i class="fa-solid ${block.icon}"></i>
        </div>
      `,
      iconSize: [34, 34],
      iconAnchor: [17, 34],
      popupAnchor: [0, -32]
    });

    const marker = L.marker([block.lat, block.lng], { icon });

    marker.bindPopup(`
      <div>
        <span class="badge ${block.category === "Academic" ? "badge-lost" : "badge-found"}">
          ${block.category}
        </span>

        <h3 class="popup-title">${block.name}</h3>

        <p class="popup-text">
          <strong><i class="fa-solid fa-building-columns"></i> Branch/Department:</strong>
          ${block.branch}
        </p>

        <p class="popup-text">
          <strong><i class="fa-solid fa-location-arrow"></i> Landmark:</strong>
          ${block.landmark}
        </p>
      </div>
    `);

    markersLayer.addLayer(marker);
    block.marker = marker;
  });
}

function renderBlocks(blocks) {
  const list = document.getElementById("block-list");

  if (!blocks.length) {
    list.innerHTML = `
      <div class="block-card">
        <h3>No Result Found</h3>
        <p>Please try another block name or branch.</p>
      </div>
    `;
    return;
  }

  list.innerHTML = blocks.map(block => `
    <div class="block-card" onclick="focusBlock('${block.id}')">
      <h3>
        <i class="fa-solid ${block.icon}" style="color:#e31e24;"></i>
        ${block.name}
      </h3>
      <p><strong>${block.tag}</strong></p>
      <p>${block.branch}</p>
    </div>
  `).join("");
}

function focusBlock(id) {
  const block = CHITKARA_BLOCKS.find(b => b.id === id);
  if (!block) return;

  map.flyTo([block.lat, block.lng], 18, {
    duration: 1.2
  });

  setTimeout(() => {
    block.marker.openPopup();
  }, 1000);
}

function setupSearch() {
  const input = document.getElementById("map-search");

  input.addEventListener("input", () => {
    const query = input.value.trim().toLowerCase();

    const filtered = CHITKARA_BLOCKS.filter(block =>
      block.name.toLowerCase().includes(query) ||
      block.category.toLowerCase().includes(query) ||
      block.branch.toLowerCase().includes(query) ||
      block.tag.toLowerCase().includes(query) ||
      block.landmark.toLowerCase().includes(query)
    );

    renderBlocks(filtered);
    plotMarkers(filtered);
  });
}

function setupCategoryFilters() {
  const chips = document.querySelectorAll(".chip");

  chips.forEach(chip => {
    chip.addEventListener("click", () => {
      chips.forEach(c => c.classList.remove("active"));
      chip.classList.add("active");

      const category = chip.dataset.category;

      const filtered = category === "all"
        ? CHITKARA_BLOCKS
        : CHITKARA_BLOCKS.filter(block => block.category === category);

      renderBlocks(filtered);
      plotMarkers(filtered);
    });
  });
}

function checkURLSearch() {
  const params = new URLSearchParams(window.location.search);
  const search = params.get("search");

  if (!search) return;

  const input = document.getElementById("map-search");
  input.value = search;
  input.dispatchEvent(new Event("input"));
}