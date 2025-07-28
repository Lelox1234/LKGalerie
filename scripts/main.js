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
const SUPABASE_KEY = 'sb_publishable_uv9fVifiGD7km2lEiT3kPg_XciX8eUr'; // <-- ersetzen!

async function updateVisitorCount() {
  // Hole aktuellen Wert
  const res = await fetch(`${SUPABASE_URL}/rest/v1/visits?select=count&id=eq.1`, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    }
  });

  if (!res.ok) {
    console.error('Fehler beim Abrufen des Zählerstands:', await res.text());
    return;
  }

  const data = await res.json();
  console.log('Aktueller Zählerstand:', data); // Debugging
  let count = data[0]?.count || 0;

  // Erhöhe um 1 und speichere
  const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/visits?id=eq.1`, {
    method: 'PATCH',
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation'
    },
    body: JSON.stringify({ count: count + 1 }) // Kein Array, sondern ein Objekt
  });

  if (!updateRes.ok) {
    console.error('Fehler beim Aktualisieren des Zählerstands:', await updateRes.text());
    return;
  }

  const updateData = await updateRes.json();
  console.log('Nach Update:', updateData); // Debugging

  // Zeige die Zahl an
  document.getElementById('visitor-count').textContent = count + 1;
}

updateVisitorCount();
