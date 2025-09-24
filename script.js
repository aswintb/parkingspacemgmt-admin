document.addEventListener('DOMContentLoaded', () => {
    // --- MOCK DATA STORE ---
    const bookingData = {
        "A-01": { status: "Occupied", vehicle: "KL-01-CV-1989", type: "Car", startTime: new Date('2025-09-24T10:00:00'), endTime: new Date('2025-09-24T13:00:00') },
        "A-03": { status: "Occupied", vehicle: "KL-07-BN-2023", type: "Car", startTime: new Date('2025-09-24T11:30:00'), endTime: new Date('2025-09-24T12:30:00') },
        "A-06": { status: "Reserved", vehicle: "KA-05-MJ-1995", type: "Car", arrival: "1:00 PM" },
        "A-07": { status: "Occupied", vehicle: "TN-22-X-4455", type: "Car", startTime: new Date('2025-09-24T09:15:00'), endTime: new Date('2025-09-24T12:15:00') },
        "B-02": { status: "Occupied", vehicle: "KL-10-AD-7788", type: "Car", startTime: new Date('2025-09-24T11:00:00'), endTime: new Date('2025-09-24T15:00:00') },
        "B-05": { status: "Reserved", vehicle: "MH-12-PQ-4321", type: "Car", arrival: "2:30 PM" },
        "B-06": { status: "Occupied", vehicle: "KL-08-TT-9001", type: "Car", startTime: new Date('2025-09-24T08:00:00'), endTime: new Date('2025-09-24T12:00:00') },
        "B-08": { status: "Occupied", vehicle: "KL-18-Z-1234", type: "Car", startTime: new Date('2025-09-24T11:35:00'), endTime: new Date('2025-09-24T13:35:00') },
        "M-02": { status: "Occupied", vehicle: "KL-32-F-5555", type: "Bike", startTime: new Date('2025-09-24T11:10:00'), endTime: new Date('2025-09-24T14:10:00') },
        "M-03": { status: "Reserved", vehicle: "TN-37-Y-9876", type: "Bike", arrival: "12:45 PM" },
        "M-06": { status: "Occupied", vehicle: "KL-11-G-4321", type: "Bike", startTime: new Date('2025-09-24T11:00:00'), endTime: new Date('2025-09-24T12:00:00') },
        "M-08": { status: "Reserved", vehicle: "KA-01-H-8765", type: "Bike", arrival: "1:15 PM" },
        "M-12": { status: "Occupied", vehicle: "KL-05-I-1122", type: "Bike", startTime: new Date('2025-09-24T10:50:00'), endTime: new Date('2025-09-24T13:50:00') },
        "M-15": { status: "Reserved", vehicle: "TN-02-J-3344", type: "Bike", arrival: "2:00 PM" }
    };
    const historyData = [
        { id: 'BK-001', vehicle: 'KL-01-AB-1234', slot: 'A-02', checkIn: '2025-09-24T09:05:00', checkOut: '2025-09-24T11:00:00', cost: 100 },
        { id: 'BK-002', vehicle: 'KA-03-XY-5678', slot: 'B-01', checkIn: '2025-09-24T10:30:00', checkOut: '2025-09-24T11:45:00', cost: 75 },
    ];

    // --- GLOBAL ELEMENTS ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const navItems = document.querySelectorAll('.nav-item');
    const pages = document.querySelectorAll('.page');
    const pageTitle = document.getElementById('page-title');
    const detailsPanel = document.querySelector('.details-panel');
    const panelOverlay = document.getElementById('panel-overlay');
    const closePanelBtn = document.getElementById('close-panel-btn');
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const mainNav = document.querySelector('.main-nav');
    const closeNavBtn = document.getElementById('close-nav-btn');

    // --- THEME SWITCHER LOGIC ---
    const applyTheme = (theme) => {
        document.body.classList.toggle('light-theme', theme === 'light');
        themeSwitcher.querySelector('.material-icons').textContent = theme === 'light' ? 'dark_mode' : 'light_mode';
        localStorage.setItem('theme', theme);
    };
    applyTheme(localStorage.getItem('theme') || 'dark');
    themeSwitcher.addEventListener('click', () => applyTheme(document.body.classList.contains('light-theme') ? 'dark' : 'light'));

    // --- TAB NAVIGATION ---
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.dataset.target;
            const targetTitle = item.textContent.replace(/[a-z_]/g, '').trim();
            navItems.forEach(nav => nav.classList.remove('active'));
            pages.forEach(page => page.classList.remove('active'));
            item.classList.add('active');
            document.getElementById(targetId).classList.add('active');
            pageTitle.textContent = targetTitle;
            if (window.innerWidth <= 768) closeMobileNav();
        });
    });

    // --- MOBILE NAVIGATION LOGIC ---
    function openMobileNav() {
        panelOverlay.classList.remove('hidden');
        setTimeout(() => panelOverlay.style.opacity = '1', 10);
        mainNav.classList.add('open');
    }
    function closeMobileNav() {
        mainNav.classList.remove('open');
        if (!detailsPanel.classList.contains('open')) {
            panelOverlay.style.opacity = '0';
            setTimeout(() => panelOverlay.classList.add('hidden'), 400);
        }
    }
    hamburgerMenu.addEventListener('click', openMobileNav);
    closeNavBtn.addEventListener('click', closeMobileNav);
    
    // --- DETAILS PANEL LOGIC ---
    function openPanel() {
        panelOverlay.classList.remove('hidden');
        setTimeout(() => panelOverlay.style.opacity = '1', 10);
        detailsPanel.classList.add('open');
    }
    function closePanel() {
        detailsPanel.classList.remove('open');
        if (!mainNav.classList.contains('open')) {
            panelOverlay.style.opacity = '0';
            setTimeout(() => panelOverlay.classList.add('hidden'), 400);
        }
    }
    closePanelBtn.addEventListener('click', closePanel);
    panelOverlay.addEventListener('click', () => { // Smart overlay closes whichever panel is open
        if (mainNav.classList.contains('open')) closeMobileNav();
        if (detailsPanel.classList.contains('open')) closePanel();
    });

    // --- DASHBOARD LOGIC ---
    function updateDashboardStats() {
        const totalSlots = document.querySelectorAll('#layout-page .slot:not(.maintenance)').length;
        const occupiedSlots = Object.values(bookingData).filter(b => b.status === 'Occupied').length;
        document.getElementById('live-occupancy-value').textContent = `${Math.round((occupiedSlots / totalSlots) * 100)}%`;
        document.getElementById('available-slots-value').textContent = totalSlots - occupiedSlots;
        document.getElementById('todays-checkins-value').textContent = Object.values(bookingData).filter(b => b.startTime).length;
        document.getElementById('todays-checkouts-value').textContent = historyData.length;
    }

    // --- HISTORY PAGE LOGIC ---
    function populateHistoryTable(filter = '') {
        const historyTableBody = document.getElementById('history-table-body');
        const filteredData = historyData.filter(item => item.vehicle.toLowerCase().includes(filter.toLowerCase()));
        historyTableBody.innerHTML = ''; // Clear previous entries
        if(filteredData.length === 0) {
            historyTableBody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-secondary);">No records found.</td></tr>`;
            return;
        }
        filteredData.forEach(item => {
            const checkIn = new Date(item.checkIn);
            const checkOut = new Date(item.checkOut);
            const durationMs = checkOut - checkIn;
            const hours = Math.floor(durationMs / 3600000);
            const minutes = Math.round((durationMs % 3600000) / 60000);
            const row = document.createElement('tr');
            row.innerHTML = `<td>${item.id}</td><td>${item.vehicle}</td><td>${item.slot}</td><td>${checkIn.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td><td>${checkOut.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td><td>${hours}h ${minutes}m</td><td>₹${item.cost}</td>`;
            historyTableBody.appendChild(row);
        });
    }
    document.getElementById('history-search').addEventListener('input', (e) => populateHistoryTable(e.target.value));

    // --- LAYOUT PAGE LOGIC ---
    const slots = document.querySelectorAll('#layout-page .slot');
    const panelContent = document.getElementById('panel-content');
    function initializeLayoutPage() {
        slots.forEach(slot => {
            const slotId = slot.dataset.slotId;
            const data = bookingData[slotId];
            if (data && data.status === 'Occupied') {
                const progressContainer = document.createElement('div');
                progressContainer.className = 'progress-container';
                progressContainer.innerHTML = `<div class="progress-fill"></div>`;
                slot.appendChild(progressContainer);
            }
            slot.addEventListener('click', () => handleSlotClick(slot));
        });
        updateAllProgressBars();
        setInterval(updateAllProgressBars, 5000);
    }
    function handleSlotClick(slot) {
        if (slot.classList.contains('maintenance')) return;
        slots.forEach(s => s.classList.remove('selected'));
        slot.classList.add('selected');
        updatePanelContent(slot);
        openPanel();
    }
    function updatePanelContent(slot) {
        const slotId = slot.dataset.slotId;
        const slotData = bookingData[slotId];
        let html = '';
        if (slot.classList.contains('available')) html = getBookingForm(slotId);
        else if (slotData) html = getSlotDetails(slotId, slotData);
        else html = `<p class="placeholder">This slot is under maintenance.</p>`;
        panelContent.innerHTML = html;
        if (slot.classList.contains('available')) {
            const durationInput = document.getElementById('duration-input');
            document.querySelectorAll('.quick-select-btn').forEach(btn => {
                btn.addEventListener('click', () => { durationInput.value = btn.dataset.hours; });
            });
        }
    }
    function getBookingForm(slotId) { return `<form class="booking-form"><h3>New Booking: Slot ${slotId}</h3><div class="form-group"><label>Vehicle Number</label><input type="text" placeholder="e.g., KL-01-XX-1234" required></div><div class="form-group"><label>Duration (hours)</label><input type="number" id="duration-input" value="1" min="1"><div class="quick-select"><button type="button" class="quick-select-btn" data-hours="1">1 hr</button><button type="button" class="quick-select-btn" data-hours="3">3 hrs</button><button type="button" class="quick-select-btn" data-hours="5">5 hrs</button><button type="button" class="quick-select-btn" data-hours="8">All Day</button></div></div><button type="submit" class="confirm-btn">Confirm Booking</button></form>`; }
    function getSlotDetails(slotId, data) {
        let timeInfo = '';
        if (data.status === 'Occupied') timeInfo = `<p><strong>Time Left:</strong> <span class="time-remaining">${formatTimeRemaining(data.endTime - new Date())}</span></p>`;
        else if (data.status === 'Reserved') timeInfo = `<p><strong>Expected At:</strong> ${data.arrival}</p>`;
        return `<div class="details-view"><h3>Slot ${slotId}</h3><p><strong>Status:</strong> ${data.status}</p><p><strong>Vehicle:</strong> ${data.vehicle}</p><p><strong>Type:</strong> ${data.type}</p>${timeInfo}</div>`;
    }
    function formatTimeRemaining(ms) {
        if (ms <= 0) return "Booking Expired";
        let s = Math.floor(ms / 1000), h = Math.floor(s / 3600); s %= 3600; let m = Math.floor(s / 60); s %= 60;
        return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}m ${String(s).padStart(2, '0')}s`;
    }
    function updateAllProgressBars() {
        slots.forEach(slot => {
            if (slot.classList.contains('occupied')) {
                const data = bookingData[slot.dataset.slotId];
                if (data && data.startTime && data.endTime) {
                    const total = data.endTime - data.startTime, elapsed = new Date() - data.startTime;
                    let percentage = Math.min(100, Math.max(0, (elapsed / total) * 100));
                    const fill = slot.querySelector('.progress-fill');
                    if (fill) fill.style.width = `${percentage}%`;
                }
            }
        });
    }

    // --- INITIAL APP LOAD ---
    updateDashboardStats();
    populateHistoryTable();
    initializeLayoutPage();
});
