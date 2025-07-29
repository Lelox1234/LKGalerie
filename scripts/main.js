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
    // Prüfe, ob der Benutzer als Besitzer markiert ist
    const isOwner = localStorage.getItem("isOwner") === "true";

    if (!isOwner) {
      // 1. Frage den Benutzer, ob er der Besitzer ist
      const confirmOwner = confirm("Bist du der Besitzer dieser Webseite?");
      if (confirmOwner) {
        localStorage.setItem("isOwner", "true");
        console.log("Du bist jetzt als Besitzer markiert. Der Zähler wird nicht erhöht.");
      } else {
        console.log("Du bist kein Besitzer. Der Zähler wird erhöht.");
      }
    }

    // 2. Wenn der Benutzer der Besitzer ist, erhöhe den Zähler nicht
    if (localStorage.getItem("isOwner") === "true") {
      console.log("Das ist dein Besuch. Der Zähler wird nicht erhöht.");
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

    // 3. Wenn der Benutzer kein Besitzer ist, erhöhe den Zähler
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