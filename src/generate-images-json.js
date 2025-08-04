const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir)
  .filter(f => /^bild\d+(\.\d+)?\.(jpg|jpeg|png|gif)$/i.test(f)) // Erkenne Dezimalzahlen
  .sort((a, b) => {
    const numA = parseFloat(a.match(/\d+(\.\d+)?/)[0]); // Extrahiere die Zahl (inkl. Dezimalstellen)
    const numB = parseFloat(b.match(/\d+(\.\d+)?/)[0]); // Extrahiere die Zahl (inkl. Dezimalstellen)
    return numB - numA; // Sortiere absteigend
  })
  .map(f => 'src/' + f);

fs.writeFileSync(
  path.join(dir, 'images.json'),
  JSON.stringify(files, null, 2)
);

//strg ö = terminal und dann node src/generate-images-json.js
// dann wird die Datei images.json im src Ordner erstellt