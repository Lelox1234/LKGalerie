// This file is intentionally left blank.

fetch('src/images.json')
  .then(res => res.json())
  .then(images => {
    const imageGrid = document.querySelector('.image-grid');
    images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Painting';
      img.className = 'gallery-image';
      imageGrid.appendChild(img);
    });

    // Lightbox-Funktionalität
    document.querySelectorAll('.image-grid img').forEach(img => {
      img.addEventListener('click', function() {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        const bigImg = document.createElement('img');
        bigImg.src = this.src;
        bigImg.alt = this.alt;
        overlay.appendChild(bigImg);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', function() {
          overlay.remove();
        });
      });
    });
  });

const SUPABASE_URL = 'https://hjdxlbytltnjaikckhlw.supabase.co'; // <-- ersetzen!
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhqZHhsYnl0bHRuamFpa2NraGx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM3MDAyODEsImV4cCI6MjA2OTI3NjI4MX0.P5sgJj-vMTaXYeBKFonhJ49YrhI3E_xTrZZ4rtZ9ajQ'; // <-- ersetzen!

async function updateVisitorCount() {
  // Hole aktuellen Wert
  const res = await fetch(`${SUPABASE_URL}/rest/v1/visits?select=count`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    }
  });
  const data = await res.json();
  let count = data[0]?.count || 0;

  // Erhöhe um 1 und speichere
  await fetch(`${SUPABASE_URL}/rest/v1/visits`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify([{ count: count + 1 }])
  });

  // Zeige die Zahl an
  document.getElementById('visitor-count').textContent = count + 1;
}

updateVisitorCount();
