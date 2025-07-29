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

// Funktion, um den Benutzer manuell als Owner zu registrieren
function registerOwner() {
  localStorage.setItem("isOwner", "true");
  console.log("Du bist jetzt als Besitzer registriert. Dieser Status wird gespeichert.");
}

// Funktion, um zu prüfen, ob der Benutzer der Owner ist
function isOwner() {
  return localStorage.getItem("isOwner") === "true";
}

// Beispiel: Zähler nur erhöhen, wenn der Benutzer kein Owner ist
async function updateVisitorCount() {
  try {
    if (isOwner()) {
      console.log("Du bist der Besitzer. Der Zähler wird nicht erhöht.");
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

    // 1. Hole den aktuellen Zählerstand
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

    // 2. Hole den aktuellen Wert von count
    let count = data[0]?.count ?? 0; // Fallback auf 0, falls count null ist
    console.log('Wert von count vor Erhöhung:', count);

    // 3. Erhöhe den Zähler um 1
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

    // 4. Zeige die aktualisierte Zahl auf der Webseite an
    document.getElementById('visitor-count').textContent = count + 1;
  } catch (error) {
    console.error('Ein Fehler ist aufgetreten:', error);
  }
}

// Funktion, um den Besucherzähler zu reduzieren
async function removeCount(amount) {
  try {
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
    let count = data[0]?.count ?? 0;

    // Reduziere den Zähler
    count = Math.max(0, count - amount); // Verhindert, dass der Zähler negativ wird

    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/visits?id=eq.1`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({ count })
    });

    if (!updateRes.ok) {
      console.error('Fehler beim Reduzieren des Zählerstands:', await updateRes.text());
      return;
    }

    console.log(`Der Besucherzähler wurde um ${amount} reduziert. Neuer Stand: ${count}`);
    document.getElementById('visitor-count').textContent = count;
  } catch (error) {
    console.error('Ein Fehler ist aufgetreten:', error);
  }
}

// Funktion, um den Besucherzähler zu erhöhen
async function addCount(amount) {
  try {
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
    let count = data[0]?.count ?? 0;

    // Erhöhe den Zähler
    count += amount;

    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/visits?id=eq.1`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({ count })
    });

    if (!updateRes.ok) {
      console.error('Fehler beim Erhöhen des Zählerstands:', await updateRes.text());
      return;
    }

    console.log(`Der Besucherzähler wurde um ${amount} erhöht. Neuer Stand: ${count}`);
    document.getElementById('visitor-count').textContent = count;
  } catch (error) {
    console.error('Ein Fehler ist aufgetreten:', error);
  }
}

// Funktion, um den Besucherzähler auf einen bestimmten Wert zu setzen
async function setCount(value) {
  try {
    const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/visits?id=eq.1`, {
      method: 'PATCH',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify({ count: value })
    });

    if (!updateRes.ok) {
      console.error('Fehler beim Setzen des Zählerstands:', await updateRes.text());
      return;
    }

    console.log(`Der Besucherzähler wurde auf ${value} gesetzt.`);
    document.getElementById('visitor-count').textContent = value;
  } catch (error) {
    console.error('Ein Fehler ist aufgetreten:', error);
  }
}

// Aktualisiere den Besucherzähler
updateVisitorCount();

// Funktion in der Konsole verfügbar machen
window.registerOwner = registerOwner;

// Funktionen in der Konsole verfügbar machen
window.removeCount = removeCount;
window.addCount = addCount;
window.setCount = setCount;

//registerOwner(); 
//localStorage.setItem("isOwner", "true"); // Zum Testen, um den Owner-Status zu setzen
//localStorage.removeItem("isOwner"); // Zum Testen, um den Owner-Status zu entfernen
//removeCount(1); // Zum Testen, um den Zähler um 1 zu reduzieren
//addCount(1); // Zum Testen, um den Zähler um 1 zu
//setCount(100); // Zum Testen, um den Zähler auf 100 zu setzen
//console.log(isOwner()); // Zum Testen, ob der Benutzer der Owner ist
