
document.addEventListener("DOMContentLoaded", () => {
  const yearCol = document.getElementById("years");
  const eventCol = document.getElementById("events");
  const ficheTitle = document.getElementById("fiche-titre");
  const ficheContent = document.getElementById("fiche-content");
  const messageAttente = document.getElementById("message-attente");

  fetch("evenements.json")
    .then(res => res.json())
    .then(data => {
      const events = data;
      const allYears = new Set();

      events.forEach(ev => {
        const start = parseInt(ev.annee_debut);
        const end = parseInt(ev.annee_fin || ev.annee_debut);
        for (let y = start; y <= end; y++) allYears.add(y);
      });

      const sortedYears = Array.from(allYears).sort((a, b) => a - b);

      sortedYears.forEach(year => {
        const div = document.createElement("div");
        div.className = "year";
        div.textContent = year;
        div.dataset.year = year;
        yearCol.appendChild(div);
      });

      function showEventsFor(year) {
        document.querySelectorAll(".year").forEach(el => el.classList.remove("active"));
        document.querySelector(`.year[data-year="${year}"]`).classList.add("active");

        eventCol.querySelectorAll(".event").forEach(e => e.remove());

        const shownEvents = [];

        events.forEach(ev => {
          const start = parseInt(ev.annee_debut);
          const end = parseInt(ev.annee_fin || start);
          if (year >= start && year <= end) {
            for (let y = start; y <= end; y++) {
              const div = document.createElement("div");
              div.className = "event";
              if (y !== year) div.classList.add("nearby");

              const title = document.createElement("strong");
              title.textContent = ev.titre;

              const dateEl = document.createElement("div");
              dateEl.className = "event-date";
              dateEl.textContent = y;

              div.appendChild(dateEl);
              div.appendChild(title);
              div.addEventListener("click", () => {
                ficheTitle.textContent = ev.titre;
                ficheContent.innerHTML = `
                  <p><strong>Année(s):</strong> ${start}${start !== end ? ' – ' + end : ''}</p>
                  <p><strong>Catégorie:</strong> ${ev.categorie_principale}</p>
                  <p><strong>Thème:</strong> ${ev.theme}</p>
                  <p>${ev.description}</p>`;
              });
              eventCol.appendChild(div);
            }
          }
        });

        messageAttente.style.display = "none";
      }

      yearCol.addEventListener("click", e => {
        if (e.target.classList.contains("year")) {
          showEventsFor(parseInt(e.target.dataset.year));
        }
      });
    });
});
