// ===== NEWS PAGE FUNCTIONALITY =====

let allNews = [];
let currentFilter = 'all';

// Load news data
async function loadNews() {
    try {
        const response = await fetch('data/news.json');
        const data = await response.json();
        allNews = data.news;
        renderNews(allNews);
        initializeFilters();
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

// Filter news by category
function filterNews(category, event) {
    currentFilter = category;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event) {
    event.target.classList.add('active');
}
    
    // Filter and render
    const filtered = category === 'all' ? allNews : allNews.filter(item => item.category === category);
    renderNews(filtered);
}

// Render news cards
function renderNews(newsArray) {
    const container = document.getElementById('newsContainer');
    
    if (newsArray.length === 0) {
        container.innerHTML = '<div class="empty-state"><i class="fas fa-inbox"></i><h3>ไม่มีข่าวสารในหมวดหมู่นี้</h3></div>';
        return;
    }
    
    container.innerHTML = newsArray.map(news => `
        <div class="news-card">
            <div class="news-card-image">
                ${news.image ? `<img src="${news.image}" alt="${news.title}" onerror="this.parentElement.innerHTML='<div class=news-card-image-placeholder><i class=fas fa-newspaper></i></div>'">` : '<div class="news-card-image-placeholder"><i class="fas fa-newspaper"></i></div>'}
            </div>
            <div class="news-card-content">
                <span class="news-card-category">${news.category}</span>
                <div class="news-card-date">
                    <i class="fas fa-calendar"></i>
                    ${formatDate(news.date)}
                </div>
                <h3 class="news-card-title">${news.title}</h3>
                <p class="news-card-description">${news.description}</p>
                ${news.files && news.files.length > 0 ? `
                    <div class="news-card-files">
                        <h4><i class="fas fa-download"></i> ไฟล์ดาวโหลด</h4>
                        ${news.files.map(file => `
                            <div class="file-item">
                                <div class="file-icon ${file.type}">${getFileIcon(file.type)}</div>
                                <div class="file-info">
                                    <div class="file-name">${file.name}</div>
                                    <div class="file-size">${file.size}</div>
                                </div>
                                <a href="${file.url}" download class="file-download" title="ดาวโหลด">
                                    <i class="fas fa-download"></i>
                                </a>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
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

