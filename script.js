
document.addEventListener("DOMContentLoaded", function () {
  const yearContainer = document.getElementById("years");
  const eventContainer = document.getElementById("events");
  const ficheContent = document.getElementById("fiche-content");
  const ficheTitre = document.getElementById("fiche-titre");
  const message = document.getElementById("message-attente");

  let allEvents = [];

  fetch('evenements.json')
    .then(res => res.json())
    .then(data => {
      allEvents = data;
      const yearsSet = new Set();
      data.forEach(ev => {
        for (let y = parseInt(ev.annee_debut); y <= parseInt(ev.annee_fin); y++) {
          yearsSet.add(y);
        }
      });

      const sortedYears = Array.from(yearsSet).sort((a, b) => a - b);
      sortedYears.forEach(year => {
        const div = document.createElement("div");
        div.className = "year";
        div.dataset.year = year;
        div.textContent = year;
        yearContainer.appendChild(div);
      });

      document.querySelectorAll(".year").forEach(yr => {
        yr.addEventListener("click", () => {
          document.querySelectorAll(".year").forEach(el => el.classList.remove("active"));
          yr.classList.add("active");
          const selected = parseInt(yr.dataset.year);
          showEventsForYear(selected);
        });
      });
    });

  function showEventsForYear(selected) {
    eventContainer.innerHTML = "";
    let count = 0;
    allEvents.forEach(ev => {
      const range = Array.from({ length: ev.annee_fin - ev.annee_debut + 1 }, (_, i) => parseInt(ev.annee_debut) + i);
      if (range.includes(selected) || range.some(y => Math.abs(y - selected) <= 3)) {
        const div = document.createElement("div");
        div.className = "event";
        div.classList.toggle("nearby", !range.includes(selected));
        div.innerHTML = `
          <div class="event-date">${range.includes(selected) ? '' : selected}</div>
          <div>
            <span class="theme-${ev.theme.replace(/\s+/g, '-').toLowerCase()}" style="width:10px;height:10px;border-radius:50%;display:inline-block;margin-right:6px;"></span>
            <strong>${ev.titre}</strong>
            ${ev.annee_fin !== ev.annee_debut ? '<span class="pluriannuel-badge">Pluriannuel</span>' : ''}
            <div class="range-info" style="font-style:italic;color:gray;">${!range.includes(selected) ? selected : ''}</div>
          </div>
        `;
        div.addEventListener("click", () => {
          ficheTitre.textContent = ev.titre;
          ficheContent.innerHTML = `
            <p><strong>📅</strong> ${ev.annee_debut}${ev.annee_debut !== ev.annee_fin ? ' – ' + ev.annee_fin : ''}</p>
            <p><strong>🗂️</strong> ${ev.categorie_principale}</p>
            <p><strong>🎨</strong> ${ev.theme}</p>
            <p><strong>🔖</strong> ${(ev.mots_cles || []).join(', ')}</p>
            <p><strong>📝</strong> ${ev.description}</p>
            ${ev.sources ? `<p><strong>🔗</strong> ${ev.sources.join(', ')}</p>` : ''}
            ${ev.en_savoir_plus ? `<p><a href="${ev.en_savoir_plus}" target="_blank">📚 En savoir plus</a></p>` : ''}
          `;
        });
        eventContainer.appendChild(div);
        count++;
      }
    });

    if (message) message.style.display = count === 0 ? "block" : "none";
  }
});
