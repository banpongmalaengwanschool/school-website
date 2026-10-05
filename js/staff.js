// ===== STAFF PAGE FUNCTIONALITY =====

let allStaff = [];
let filteredStaff = [];

function splitRole(position) {
    const text = position || '';
    const match = text.match(/^(.*?)\s*\((.*)\)\s*$/);
    if (match) {
        return { title: match[1].trim(), duty: match[2].trim() };
    }
    return { title: text, duty: '' };
}

async function loadStaff() {
    try {
        const response = await fetch('data/staff.json');
        const data = await response.json();
        allStaff = data.staff;
        filteredStaff = allStaff;
        renderStaffCards();
        renderStaffStats();
    } catch (error) {
        console.error('Error loading staff:', error);
        document.getElementById('staffGrid').innerHTML = '<div class="staff-empty"><i class="fas fa-exclamation-circle"></i><h3>ไม่สามารถโหลดข้อมูลบุคลากรได้</h3></div>';
    }
}

function renderStaffCards() {
    const container = document.getElementById('staffGrid');

    if (filteredStaff.length === 0) {
        container.innerHTML = '<div class="staff-empty" style="grid-column: 1/-1;"><i class="fas fa-search"></i><h3>ไม่พบข้อมูลบุคลากร</h3></div>';
        return;
    }

    container.innerHTML = filteredStaff.map(staff => {
        const role = splitRole(staff.position);
        const dutyLine = role.duty
            ? `<p><i class="fas fa-tasks"></i><span><span class="staff-label">หน้าที่การงาน</span>${role.duty}</span></p>`
            : '';
        return `
        <div class="staff-card">
            <div class="staff-card-header">
                <div class="staff-card-avatar">
                    <img src="images/staff/${staff.image}" alt="${staff.name}">
                </div>
                <div class="staff-card-name">${staff.name}</div>
                <div class="staff-card-position">${role.title}</div>
            </div>
            <div class="staff-card-body">
                <div class="staff-card-department">${staff.department}</div>
                <div class="staff-card-info">
                    <p><i class="fas fa-briefcase"></i><span><span class="staff-label">ตำแหน่ง</span>${role.title}</span></p>
                    ${dutyLine}
                    <p><i class="fas fa-building"></i><span><span class="staff-label">กลุ่มงาน</span>${staff.department}</span></p>
                </div>
            </div>
        </div>`;
    }).join('');
}

function renderStaffStats() {
    const totalStaff = allStaff.length;
    const teachers = allStaff.filter(s => s.department === 'การเรียนการสอน').length;
    const admin = allStaff.filter(s => s.department === 'บริหาร').length;
    const support = allStaff.filter(s => s.department === 'สนับสนุน').length;

    const statsContainer = document.getElementById('staffStats');
    if (statsContainer) {
        statsContainer.innerHTML = `
            <div class="stat-card">
                <div class="stat-card-icon"><i class="fas fa-users"></i></div>
                <div class="stat-card-number">${totalStaff}</div>
                <div class="stat-card-label">บุคลากรทั้งหมด</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-icon"><i class="fas fa-chalkboard-user"></i></div>
                <div class="stat-card-number">${teachers}</div>
                <div class="stat-card-label">ครูและอาจารย์</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-icon"><i class="fas fa-user-tie"></i></div>
                <div class="stat-card-number">${admin}</div>
                <div class="stat-card-label">ผู้บริหาร</div>
            </div>
            <div class="stat-card">
                <div class="stat-card-icon"><i class="fas fa-headset"></i></div>
                <div class="stat-card-number">${support}</div>
                <div class="stat-card-label">บุคลากรสนับสนุน</div>
            </div>
        `;
    }
}

function filterStaff(department, event) {
    if (department === 'all') {
        filteredStaff = allStaff;
    } else {
        filteredStaff = allStaff.filter(staff => staff.department === department);
    }

    document.querySelectorAll('.staff-filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    if (event) {
        event.target.classList.add('active');
    }

    renderStaffCards();
}

function searchStaff() {
    const searchInput = document.getElementById('staffSearchInput');
    const query = searchInput.value.toLowerCase();

    filteredStaff = allStaff.filter(staff =>
        staff.name.toLowerCase().includes(query) ||
        staff.position.toLowerCase().includes(query) ||
        staff.department.toLowerCase().includes(query)
    );

    renderStaffCards();
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('staffGrid')) {
        loadStaff();

        const searchBtn = document.getElementById('staffSearchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', searchStaff);
        }

        const searchInput = document.getElementById('staffSearchInput');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') searchStaff();
            });
        }
    }
});
