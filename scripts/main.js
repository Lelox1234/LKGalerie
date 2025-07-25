// This file is intentionally left blank.

// Liste deiner Bilder im src-Ordner
const images = [
     'src/bild1.jpg',
    'src/bild2.jpg',
    'src/bild3.jpg',
    'src/bild4.jpg',
    'src/bild5.jpg',
    'src/bild6.jpg',
    'src/bild7.jpg',
    'src/bild8.jpg',
    'src/bild9.jpg',
    'src/bild10.jpg',
    'src/bild11.jpg',
     'src/bild12.jpg',
     'src/bild13.jpg'
    // Füge weitere Bilddateien hier hinzu
];

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
