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

const SUPABASE_URL = 'https://hjdxlbytltnjaikckhlw.supabase.co'; // Deine Supabase-URL
const SUPABASE_KEY = 'sb_publishable_uv9fVifiGD7km2lEiT3kPg_XciX8eUr'; // Dein API-Key
const MY_IP = '149.249.67.61'; // Ersetze dies durch deine eigene IP-Adresse

async function updateVisitorCount() {
  try {
    // 1. Hole die IP-Adresse des Besuchers
    const ipRes = await fetch('https://api.ipify.org?format=json');
    const ipData = await ipRes.json();
    const visitorIp = ipData.ip;
    console.log('Besucher-IP:', visitorIp);
    console.log('Deine IP:', MY_IP);
    console.log('Vergleich:', visitorIp === MY_IP);

    // 2. Prüfe, ob es deine eigene IP ist
    if (visitorIp.trim() === MY_IP.trim()) {
      console.log('Das ist deine eigene IP. Der Zähler wird nicht erhöht.');
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
      const count = data[0]?.count ?? 0;
      document.getElementById('visitor-count').textContent = count;
      return; // Beende die Funktion hier
    }

    // 3. Hole den aktuellen Zählerstand
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
    console.log('Aktueller Zählerstand:', data);

    // 4. Hole den aktuellen Wert von count
    let count = data[0]?.count ?? 0; // Fallback auf 0, falls count null ist
    console.log('Wert von count vor Erhöhung:', count);

    // 5. Erhöhe den Zähler um 1
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/visits?id=eq.1`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({ count: count + 1 })
    });

    if (!updateRes.ok) {
      console.error('Fehler beim Aktualisieren des Zählerstands:', await updateRes.text());
      return;
    }

    const updateData = await updateRes.json();
    console.log('Nach Update:', updateData);

    // 6. Zeige die aktualisierte Zahl auf der Webseite an
    document.getElementById('visitor-count').textContent = count + 1;
  } catch (error) {
    console.error('Ein Fehler ist aufgetreten:', error);
  }
}

updateVisitorCount();

// Bilder aus images.json laden
fetch('src/images.json')
  .then(res => res.json())
  .then(images => {
    const gallery = document.querySelector('.image-grid');

    // Galerie-Bilder hinzufügen
    images.forEach(src => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Galeriebild';
      gallery.appendChild(img);

      // Klick-Event für Lightbox (optional)
      img.addEventListener('click', () => {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox-overlay';
        const bigImg = document.createElement('img');
        bigImg.src = src;
        bigImg.alt = 'Großansicht';
        overlay.appendChild(bigImg);
        document.body.appendChild(overlay);

        overlay.addEventListener('click', () => {
          overlay.remove();
        });
      });
    });
  });

// Spotlight-Menü ein- und ausklappen
const toggleSpotlightButton = document.getElementById('toggle-spotlight-menu');
const spotlightContent = document.getElementById('spotlight-content');
const toggleText = document.getElementById('toggle-text');
const toggleIcon = document.getElementById('toggle-icon');

toggleSpotlightButton.addEventListener('click', () => {
  if (spotlightContent.style.display === 'none') {
    spotlightContent.style.display = 'block';
    toggleText.textContent = 'Einklappen';
    toggleIcon.textContent = '▼';
  } else {
    spotlightContent.style.display = 'none';
    toggleText.textContent = 'Ausklappen';
    toggleIcon.textContent = '▲';
  }
});

