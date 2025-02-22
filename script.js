const habits = [
    "Tahajjud", "Salat e Hajat", "Fajar", "Zuhar", "Asar", "Magrib", "Isha", 
    "Surah Yaseen", "Surah Fajar", "Surah Rehman", "Surah Waqiya", "Surah Muzammil", "Surah Mulk", "Surah Kahf", 
    "سُبحَانَ اللّهِ وَ بِحَمْدِهِ ، سُبحَانَ اللّهِ الْعَظِيمِ", "Duroor Shareef", "Astagfar", "Allahu akbar", "SubhanAllah", "Alhamdulillah"
];

const date = new Date();
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const month = date.getMonth();
const year = date.getFullYear();
document.getElementById("monthTitle").textContent = `Habit Tracker - ${monthNames[month]} ${year}`;
const daysInMonth = new Date(year, month + 1, 0).getDate();

const storageKey = `habitTracker_${year}_${month + 1}`;

function saveProgress() {
    let progress = {};
    document.querySelectorAll("tbody tr").forEach((row, rowIndex) => {
        progress[rowIndex] = [];
        row.querySelectorAll("input[type='checkbox']").forEach((checkbox, colIndex) => {
            progress[rowIndex][colIndex] = checkbox.checked;
        });
    });
    localStorage.setItem(storageKey, JSON.stringify(progress));
    updateChart();
}

function loadProgress() {
    let savedProgress = localStorage.getItem(storageKey);
    if (savedProgress) {
        savedProgress = JSON.parse(savedProgress);
        document.querySelectorAll("tbody tr").forEach((row, rowIndex) => {
            row.querySelectorAll("input[type='checkbox']").forEach((checkbox, colIndex) => {
                checkbox.checked = savedProgress[rowIndex]?.[colIndex] || false;
            });
        });
    }
}

function generateTable() {
    const tbody = document.getElementById("habitTable");
    habits.forEach(habit => {
        let row = document.createElement("tr");
        let habitCell = document.createElement("td");
        habitCell.textContent = habit;
        row.appendChild(habitCell);
        
        for (let i = 1; i <= daysInMonth; i++) {
            let cell = document.createElement("td");
            let checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.addEventListener("change", saveProgress);
            cell.appendChild(checkbox);
            row.appendChild(cell);
        }
        tbody.appendChild(row);
    });
    loadProgress();
}

generateTable();

function updateChart() {
    let ctx = document.getElementById("habitChart").getContext("2d");
    let habitCounts = getHabitCounts();
    if (window.habitChartInstance) window.habitChartInstance.destroy();
    window.habitChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array.from({ length: daysInMonth }, (_, i) => i + 1),
            datasets: [{
                label: "Completed Habits Per Day",
                data: habitCounts,
                borderColor: "#d63384",
                backgroundColor: "rgba(214, 51, 132, 0.2)",
                borderWidth: 2,
                pointRadius: 4,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: { title: { display: true, text: "Days of Month" } },
                y: { beginAtZero: true, suggestedMax: 20, title: { display: true, text: "No of Habits Completed" } }
            }
        }
    });
}

function getHabitCounts() {
    let counts = Array(daysInMonth).fill(0);
    document.querySelectorAll("tbody tr").forEach(row => {
        row.querySelectorAll("input[type='checkbox']").forEach((checkbox, index) => {
            if (checkbox.checked) {
                counts[index]++;
            }
        });
    });
    return counts;
}

updateChart();