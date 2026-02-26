// ===== GALLERY PAGE FUNCTIONALITY =====

let allGalleries = [];
let currentGalleryIndex = 0;
let currentImageIndex = 0;
let currentImages = [];
async function loadImagesFromFolder(folderName) {
    const images = [];
    let i = 1;

    while (true) {
        const path = `gallery-images/${folderName}/${i}.jpg`;

        try {
            const res = await fetch(path, { method: "HEAD" });
            if (!res.ok) break;

            images.push({
                id: i,
                title: `ภาพที่ ${i}`,
                src: path,
                date: new Date().toISOString().split("T")[0]
            });

            i++;
        } catch {
            break;
        }
    }

    return images;
}


// Load gallery data
async function loadGallery() {
    try {
        const response = await fetch('data/gallery.json');
        const data = await response.json();
        allGalleries = data.galleries;
        renderGalleryTabs();
        showGallery(0);
    } catch (error) {
        console.error('Error loading gallery:', error);
        document.getElementById('galleryContainer').innerHTML = '<div class="gallery-empty"><i class="fas fa-exclamation-circle"></i><h3>ไม่สามารถโหลดแกลเลอรี่ได้</h3></div>';
    }
}

// Render gallery category tabs
function renderGalleryTabs() {
    const tabsContainer = document.getElementById('galleryTabs');
    
    if (tabsContainer) {
        tabsContainer.innerHTML = allGalleries.map((gallery, index) => `
            <button class="gallery-tab ${index === 0 ? 'active' : ''}" onclick="showGallery(${index})">
                ${gallery.category}
            </button>
        `).join('');
    }
}

// Show gallery by index
async function showGallery(index) {
    currentGalleryIndex = index;
    const gallery = allGalleries[index];

    // โหลดรูปจากโฟลเดอร์
    currentImages = await loadImagesFromFolder(gallery.folder);

    // Update active tab
    document.querySelectorAll('.gallery-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });

    // Update gallery info
    const infoContainer = document.getElementById('galleryInfo');
    if (infoContainer) {
        infoContainer.innerHTML = `
            <h2 class="gallery-category-title">${gallery.category}</h2>
            <p class="gallery-category-description">${gallery.description}</p>
        `;
    }

    renderGalleryImages();
}
// Render gallery images
function renderGalleryImages() {
    const container = document.getElementById('galleryContainer');
    
    if (!currentImages || currentImages.length === 0) {
        container.innerHTML = '<div class="gallery-empty"><i class="fas fa-inbox"></i><h3>ไม่มีรูปภาพในหมวดหมู่นี้</h3></div>';
        return;
    }
    
    container.innerHTML = currentImages.map((image, index) => `
        <div class="gallery-card" onclick="openLightbox(${index})">
            <img src="${image.src}" alt="${image.title}" class="gallery-card-image" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22300%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2218%22 fill=%22%23999%22 text-anchor=%22middle%22 dy=%22.3em%22%3EImage not found%3C/text%3E%3C/svg%3E'">
            <div class="gallery-card-overlay">
                <div class="gallery-card-overlay-icon">
                    <i class="fas fa-search-plus"></i>
                </div>
                <div class="gallery-card-overlay-text">${image.title}</div>
            </div>
        </div>
    `).join('');
}

// Open lightbox
function openLightbox(index) {
    currentImageIndex = index;
    const lightbox = document.getElementById('lightbox');
    const image = currentImages[index];
    
    document.getElementById('lightboxImage').src = image.src;
    document.getElementById('lightboxTitle').textContent = image.title;
    document.getElementById('lightboxCounter').textContent = `${index + 1} / ${currentImages.length}`;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Navigate lightbox images
function prevImage() {
    currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
    openLightbox(currentImageIndex);
}

function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % currentImages.length;
    openLightbox(currentImageIndex);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox || !lightbox.classList.contains('active')) return;
    
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') closeLightbox();
});

// Close lightbox when clicking outside image
document.addEventListener('click', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (lightbox && lightbox.classList.contains('active') && e.target === lightbox) {
        closeLightbox();
    }
});

// Load gallery when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('galleryContainer')) {
        loadGallery();
    }
});
