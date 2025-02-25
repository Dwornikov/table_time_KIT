// Инициализация данных из localStorage или дефолтные данные
let schedules = JSON.parse(localStorage.getItem('schedules')) || {
    group: {
        "КСИБ 9/21-2": [
            { day: "Понедельник", time: "08:45-10:20", subject: "Математика" },
            { day: "Вторник", time: "10:35-12:10", subject: "Программирование" },
            { day: "Среда", time: "12:25-14:00", subject: "Физика" },
            { day: "Четверг", time: "14:45-16:20", subject: "Информатика" },
            { day: "Пятница", time: "16:35-18:10", subject: "Английский язык" }
        ],
        "КПО 9/21-1": [
            { day: "Понедельник", time: "10:35-12:10", subject: "Физика" },
            { day: "Вторник", time: "14:45-16:20", subject: "История" },
            { day: "Среда", time: "08:45-10:20", subject: "Математика" },
            { day: "Четверг", time: "12:25-14:00", subject: "Программирование" },
            { day: "Пятница", time: "18:25-20:00", subject: "Физическая культура" }
        ],
        "КПО 9/21-2": [
            { day: "Понедельник", time: "12:25-14:00", subject: "Информатика" },
            { day: "Вторник", time: "08:45-10:20", subject: "Программирование" },
            { day: "Среда", time: "16:35-18:10", subject: "Физика" },
            { day: "Четверг", time: "10:35-12:10", subject: "Математика" },
            { day: "Пятница", time: "14:45-16:20", subject: "Английский язык" }
        ]
    },
    teacher: {
        "Иванов И.И.": [
            { day: "Понедельник", time: "08:45-10:20", subject: "Математика (КСИБ 9/21-2)" },
            { day: "Среда", time: "08:45-10:20", subject: "Математика (КПО 9/21-1)" },
            { day: "Четверг", time: "10:35-12:10", subject: "Математика (КПО 9/21-2)" }
        ],
        "Петров П.П.": [
            { day: "Вторник", time: "10:35-12:10", subject: "Программирование (КСИБ 9/21-2)" },
            { day: "Четверг", time: "12:25-14:00", subject: "Программирование (КПО 9/21-1)" },
            { day: "Пятница", time: "16:35-18:10", subject: "Физика (КПО 9/21-2)" }
        ]
    }
};

// Сохранение данных в localStorage
function saveSchedules() {
    localStorage.setItem('schedules', JSON.stringify(schedules));
}

// Показать/скрыть секции
function showSection(section) {
    const sections = document.querySelectorAll('.section');
    const buttons = document.querySelectorAll('.tab-button');
    sections.forEach(s => s.classList.add('hidden'));
    buttons.forEach(b => b.classList.remove('active'));
    document.getElementById(section).classList.remove('hidden');
    document.querySelector(`.tab-button[onclick*="showSection('${section}')"]`).classList.add('active');
}

// Выход из админ-панели (перенаправление на главную страницу)
function logout() {
    window.location.href = 'index.html';
}

// Управление группами
document.getElementById('addGroupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const groupName = document.getElementById('groupName').value.trim();
    if (groupName && !schedules.group[groupName]) {
        schedules.group[groupName] = [];
        saveSchedules();
        updateGroupTable();
        document.getElementById('groupName').value = '';
    }
});

function updateGroupTable() {
    const tbody = document.querySelector('#groupTable tbody');
    tbody.innerHTML = '';
    for (let group in schedules.group) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${group}</td>
            <td>
                <button class="action-btn delete" onclick="confirmDelete('group', '${group}')">Удалить</button>
            </td>
        `;
        tbody.appendChild(row);
    }
}

function confirmDelete(category, name) {
    if (confirm(`Вы уверены, что хотите удалить ${category === 'group' ? 'группу' : 'преподавателя'} ${name}?`)) {
        if (category === 'group') {
            delete schedules.group[name];
        } else if (category === 'teacher') {
            delete schedules.teacher[name];
        }
        saveSchedules();
        updateGroupTable();
        updateTeacherTable();
        updateScheduleTable();
        updateOptionSelect();
    }
}

// Управление преподавателями
document.getElementById('addTeacherForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const teacherName = document.getElementById('teacherName').value.trim();
    if (teacherName && !schedules.teacher[teacherName]) {
        schedules.teacher[teacherName] = [];
        saveSchedules();
        updateTeacherTable();
        document.getElementById('teacherName').value = '';
    }
});

function updateTeacherTable() {
    const tbody = document.querySelector('#teacherTable tbody');
    tbody.innerHTML = '';
    for (let teacher in schedules.teacher) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${teacher}</td>
            <td>
                <button class="action-btn delete" onclick="confirmDelete('teacher', '${teacher}')">Удалить</button>
            </td>
        `;
        tbody.appendChild(row);
    }
}

// Управление расписанием
document.getElementById('addScheduleForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const category = document.getElementById('category').value;
    const option = document.getElementById('option').value;
    const day = document.getElementById('day').value;
    const time = document.getElementById('time').value;
    const subject = document.getElementById('subject').value.trim();

    if (category && option && day && time && subject) {
        // Удаляем существующее занятие для этой комбинации
        schedules[category][option] = schedules[category][option].filter(item =>
            !(item.day === day && item.time === time)
        );
        // Добавляем новое занятие
        schedules[category][option].push({ day, time, subject });
        saveSchedules();
        updateScheduleTable();
        document.getElementById('subject').value = '';
    }
});

function updateOptionSelect() {
    const category = document.getElementById('category').value;
    const optionSelect = document.getElementById('option');
    optionSelect.innerHTML = '<option value="">Выберите...</option>';
    if (category && schedules[category]) {
        for (let key in schedules[category]) {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = key;
            optionSelect.appendChild(option);
        }
    }
}

function updateScheduleTable() {
    const tbody = document.querySelector('#scheduleTable tbody');
    tbody.innerHTML = '';
    const validDays = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];
    for (let category in schedules) {
        for (let option in schedules[category]) {
            schedules[category][option].forEach(item => {
                if (validDays.includes(item.day)) { // Фильтруем только рабочие дни (пн-пт)
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td>${category === 'group' ? 'Группа' : 'Преподаватель'}</td>
                        <td>${option}</td>
                        <td>${item.day}</td>
                        <td>${item.time}</td>
                        <td>${item.subject}</td>
                        <td>
                            <button class="action-btn delete" onclick="confirmDeleteSchedule('${category}', '${option}', '${item.day}', '${item.time}')">Удалить</button>
                        </td>
                    `;
                    tbody.appendChild(row);
                }
            });
        }
    }
}

function confirmDeleteSchedule(category, option, day, time) {
    if (confirm(`Вы уверены, что хотите удалить занятие (${day}, ${time}, ${schedules[category][option].find(item => item.day === day && item.time === time).subject})?`)) {
        schedules[category][option] = schedules[category][option].filter(item =>
            !(item.day === day && item.time === time)
        );
        saveSchedules();
        updateScheduleTable();
    }
}

// Инициализация при загрузке
window.onload = function() {
    updateGroupTable();
    updateTeacherTable();
    updateScheduleTable();
    updateOptionSelect();
    showSection('groups'); // Показываем секцию групп по умолчанию
};