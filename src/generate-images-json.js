const fs = require('fs');
const path = require('path');

const dir = __dirname;
const files = fs.readdirSync(dir)
  .filter(f => /^bild\d+\.(jpg|jpeg|png|gif)$/i.test(f))
  .sort((a, b) => {
    const numA = parseInt(a.match(/\d+/)[0], 10);
    const numB = parseInt(b.match(/\d+/)[0], 10);
    return numB - numA;
  })
  .map(f => 'src/' + f);

fs.writeFileSync(
  path.join(dir, 'images.json'),
  JSON.stringify(files, null, 2)
);