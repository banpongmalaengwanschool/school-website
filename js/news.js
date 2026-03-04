// ===== NEWS PAGE FUNCTIONALITY =====

let allNews = [];
let currentFilter = 'all';
let currentPage = 1;
const newsPerPage = 6;

// Load news data
async function loadNews() {
    try {
        const response = await fetch('data/news.json');
        const data = await response.json();
        allNews = data.news.slice().reverse();
        renderNews(allNews);
        
    } catch (error) {
        console.error('Error loading news:', error);
        document.getElementById('newsContainer').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>ไม่สามารถโหลดข่าวสารได้</h3></div>';
    }
}

// Initialize filter buttons
function initializeFilters() {
    const categories = ['all', ...new Set(allNews.map(item => item.category))];
    const filterContainer = document.getElementById('filterButtons');
    
    if (filterContainer) {
        filterContainer.innerHTML = categories.map(cat => `
            <button class="filter-btn ${cat === 'all' ? 'active' : ''}" onclick="filterNews('${cat}', event)">
                ${cat === 'all' ? 'ทั้งหมด' : cat}
            </button>
        `).join('');
    }
}


// Render news cards
function renderNews(newsArray) {
    const container = document.getElementById('newsContainer');
    const paginationContainer = document.getElementById('pagination');

    if (newsArray.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>ไม่มีข่าวสาร</h3></div>';
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }

    const totalPages = Math.ceil(newsArray.length / newsPerPage);
    if (currentPage > totalPages) currentPage = 1;

    const start = (currentPage - 1) * newsPerPage;
    const end = start + newsPerPage;
    const paginatedNews = newsArray.slice(start, end);

   container.innerHTML = paginatedNews.map(news => {

    const cardContent = `
    <div class="news-card">
        <div class="news-card-image">
            ${
                news.facebook
                ? `<div style="width:100%">
                     <iframe 
                       src="${news.facebook}"
                       style="width:100%; border:none; overflow:hidden;"
                       height="550"
                       scrolling="no"
                       frameborder="0"
                       allowfullscreen="true"
                       allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share">
                     </iframe>
                   </div>`
                
                    : news.video
                    ? `<div class="video-wrapper">
                        <iframe 
                            src="https://www.youtube.com/embed/${news.video}?playsinline=1"
                            allowfullscreen>
                        </iframe>
                       </div>`
                    : news.image
                        ? `<img src="${news.image}" alt="${news.title}">`
                        : '<div class="news-card-image-placeholder"><i class="fas fa-newspaper"></i></div>'
                }
            </div>

            <h3 class="news-card-title">${news.title}</h3>
            <p class="news-card-description">${news.description}</p>
        </div>
    `;

    // ถ้ามีลิงก์ → ครอบด้วย <a>
    if (news.link) {
        return `
            <a href="${news.link}" target="_blank" class="news-link">
                ${cardContent}
            </a>
        `;
    }

    // ถ้าไม่มีลิงก์ → แสดงปกติ
    return cardContent;

}).join('');

    renderPagination(totalPages, newsArray);
}
function renderPagination(totalPages, newsArray) {
    const paginationContainer = document.getElementById('pagination');
    if (!paginationContainer) return;

    let html = '';

    if (currentPage > 1) {
        html += `<button class="page-btn" onclick="changePage(1)">หน้าสุดท้าย &lt;&lt;</button>`;
        html += `<button class="page-btn" onclick="changePage(${currentPage - 1})">หน้าก่อนหน้า &lt;</button>`;
    }

    const maxVisible = 7;
    let startPage = Math.max(1, currentPage - 3);
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
        startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        html += `
            <button class="page-btn ${i === currentPage ? 'active' : ''}" 
                onclick="changePage(${i})">
                ${i}
            </button>
        `;
    }

    if (currentPage < totalPages) {
        html += `<button class="page-btn" onclick="changePage(${currentPage + 1})">หน้าถัดไป &gt;</button>`;
        html += `<button class="page-btn" onclick="changePage(${totalPages})">หน้าสุดท้าย &gt;&gt;</button>`;
    }

    paginationContainer.innerHTML = html;
}

function changePage(page) {
    currentPage = page;

    const filtered = currentFilter === 'all'
        ? allNews
        : allNews.filter(item => item.category === currentFilter);

    renderNews(filtered);

    window.scrollTo({
        top: document.getElementById('newsContainer').offsetTop - 100,
        behavior: 'smooth'
    });
}
// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('th-TH', options);
}

// Get file icon
function getFileIcon(type) {
    const icons = {
        'pdf': 'PDF',
        'word': 'DOC',
        'excel': 'XLS',
        'zip': 'ZIP'
    };
    return icons[type] || 'FILE';
}

// Search functionality
function searchNews() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = allNews.filter(news => 
        news.title.toLowerCase().includes(searchTerm) ||
        news.description.toLowerCase().includes(searchTerm) ||
        news.category.toLowerCase().includes(searchTerm)
    );
    renderNews(filtered);
}

// ===== DOWNLOADS PAGE FUNCTIONALITY =====

let allDownloads = [];

// Load downloads data
async function loadDownloads() {
    try {
        const response = await fetch('data/downloads.json');
        const data = await response.json();
        allDownloads = data.downloads;
        renderDownloads(allDownloads);
        initializeDownloadFilters();
    } catch (error) {
        console.error('Error loading downloads:', error);
        document.getElementById('downloadsContainer').innerHTML = '<div class="empty-state"><i class="fas fa-exclamation-circle"></i><h3>ไม่สามารถโหลดไฟล์ดาวโหลดได้</h3></div>';
    }
}

// Initialize download filter buttons
function initializeDownloadFilters() {
    const categories = ['all', ...new Set(allDownloads.map(item => item.category))];
    const filterContainer = document.getElementById('downloadFilterButtons');
    
    if (filterContainer) {
        filterContainer.innerHTML = categories.map(cat => `
            <button class="filter-btn ${cat === 'all' ? 'active' : ''}" onclick="filterDownloads('${cat}', event)">
                ${cat === 'all' ? 'ทั้งหมด' : cat}
            </button>
        `).join('');
    }
}

// Filter downloads by category
function filterDownloads(category, event) {
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event) {
    event.target.classList.add('active');
}
    
    // Filter and render
    const filtered = category === 'all' ? allDownloads : allDownloads.filter(item => item.category === category);
    renderDownloads(filtered);
}

// Render downloads
function renderDownloads(downloadsArray) {
    const container = document.getElementById('downloadsContainer');
    
    if (downloadsArray.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>ไม่มีไฟล์ดาวโหลดในหมวดหมู่นี้</h3></div>';
        return;
    }
    
    container.innerHTML = downloadsArray.map(download => `
        <div class="download-card">
            <span class="download-category">${download.category}</span>
            <h3 class="download-title">${download.title}</h3>
            <p class="download-description">${download.description}</p>
            <div class="download-file">
                <div class="download-file-icon ${download.file.type}">
                    ${getFileIcon(download.file.type)}
                </div>
                <div class="download-file-info">
                    <div class="download-file-name">${download.file.name}</div>
                    <div class="download-file-size">${download.file.size}</div>
                </div>
            </div>
            <a href="${download.file.url}" download class="download-btn">
                <i class="fas fa-download"></i> ดาวโหลด
            </a>
        </div>
    `).join('');
}

// Search downloads
function searchDownloads() {
    const searchTerm = document.getElementById('downloadSearchInput').value.toLowerCase();
    const filtered = allDownloads.filter(download => 
        download.title.toLowerCase().includes(searchTerm) ||
        download.description.toLowerCase().includes(searchTerm) ||
        download.category.toLowerCase().includes(searchTerm) ||
        download.file.name.toLowerCase().includes(searchTerm)
    );
    renderDownloads(filtered);
}

// Load data when page loads
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('newsContainer')) {
        loadNews();
    }
    if (document.getElementById('downloadsContainer')) {
        loadDownloads();
    }
});


