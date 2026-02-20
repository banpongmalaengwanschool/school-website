// ===== STUDENTS PAGE FUNCTIONALITY =====

let allLevels = [];
let currentLevelIndex = 0;

// Load students data
async function loadStudents() {
    try {
        const response = await fetch('data/students.json');
        const data = response.json();
        return data;
    } catch (error) {
        console.error('Error loading students:', error);
        return null;
    }
}

// Initialize page
async function initStudentsPage() {
    const data = await loadStudents();
    if (!data) return;

    allLevels = data.levels;
    
    // Render summary
    renderSummary(data.summary);
    
    // Render level tabs
    renderLevelTabs();
    
    // Show first level
    showLevel(0);
}

// Render summary cards
function renderSummary(summary) {
    const container = document.getElementById('studentSummary');
    if (!container) return;

    const malePercentage = Math.round((summary.maleStudents / summary.totalStudents) * 100);
    const femalePercentage = Math.round((summary.femaleStudents / summary.totalStudents) * 100);

    container.innerHTML = `
        <div class="summary-card">
            <div class="summary-card-icon"><i class="fas fa-users"></i></div>
            <div class="summary-card-number">${summary.totalStudents}</div>
            <div class="summary-card-label">นักเรียนทั้งหมด</div>
        </div>
        <div class="summary-card">
            <div class="summary-card-icon"><i class="fas fa-mars" style="color: #4ECDC4;"></i></div>
            <div class="summary-card-number">${summary.maleStudents}</div>
            <div class="summary-card-label">นักเรียนชาย (${malePercentage}%)</div>
        </div>
        <div class="summary-card">
            <div class="summary-card-icon"><i class="fas fa-venus" style="color: #FF6B9D;"></i></div>
            <div class="summary-card-number">${summary.femaleStudents}</div>
            <div class="summary-card-label">นักเรียนหญิง (${femalePercentage}%)</div>
        </div>
        <div class="summary-card">
            <div class="summary-card-icon"><i class="fas fa-calendar"></i></div>
            <div class="summary-card-number">ปี ${summary.academicYear}</div>
            <div class="summary-card-label">ปีการศึกษา ภาค ${summary.semester}</div>
        </div>
    `;
}

// Render level tabs
function renderLevelTabs() {
    const container = document.getElementById('levelTabs');
    if (!container) return;

    container.innerHTML = allLevels.map((level, index) => `
        <button class="level-tab ${index === 0 ? 'active' : ''}" onclick="showLevel(${index})">
            <span style="font-size: 1.2rem; margin-right: 0.5rem;">${level.icon}</span>
            ${level.levelName}
        </button>
    `).join('');
}

// Show level by index
function showLevel(index) {
    currentLevelIndex = index;
    const level = allLevels[index];

    // Update active tab
    document.querySelectorAll('.level-tab').forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });

    // Render classes
    renderClasses(level);
}

// Render classes
function renderClasses(level) {
    const container = document.getElementById('classGrid');
    if (!container) return;

    const totalMale = level.classes.reduce((sum, c) => sum + c.male, 0);
    const totalFemale = level.classes.reduce((sum, c) => sum + c.female, 0);

    let html = level.classes.map(cls => `
        <div class="class-card">
            <div class="class-card-header">
                <div class="class-card-icon">${level.icon}</div>
                <div class="class-card-grade">${cls.grade}</div>
            </div>
            <div class="class-card-body">
                <div class="class-stats">
                    <div class="class-stat male">
                        <div class="class-stat-number">${cls.male}</div>
                        <div class="class-stat-label">ชาย</div>
                    </div>
                    <div class="class-stat female">
                        <div class="class-stat-number">${cls.female}</div>
                        <div class="class-stat-label">หญิง</div>
                    </div>
                    <div class="class-stat total">
                        <div class="class-stat-number">${cls.total}</div>
                        <div class="class-stat-label">รวม</div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add level summary
    html += `
        <div class="level-summary" style="grid-column: 1/-1;">
            <div class="level-summary-title">สรุป ${level.levelName}</div>
            <div class="level-summary-stats">
                <div class="level-summary-stat">
                    <div class="level-summary-stat-number">${totalMale}</div>
                    <div class="level-summary-stat-label">นักเรียนชาย</div>
                </div>
                <div class="level-summary-stat">
                    <div class="level-summary-stat-number">${totalFemale}</div>
                    <div class="level-summary-stat-label">นักเรียนหญิง</div>
                </div>
                <div class="level-summary-stat">
                    <div class="level-summary-stat-number">${level.subtotal}</div>
                    <div class="level-summary-stat-label">รวมทั้งสิ้น</div>
                </div>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// Load page when ready
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('classGrid')) {
        initStudentsPage();
    }
});
