// Получаем параметры из URL
const urlParams = new URLSearchParams(window.location.search);
const category = urlParams.get('category');
const option = urlParams.get('option');

// Загрузка данных из localStorage
let schedules = JSON.parse(localStorage.getItem('schedules'));
if (!schedules || Object.keys(schedules).length === 0) {
    console.warn("Данные в localStorage отсутствуют или пусты. Используем дефолтные данные.");
    schedules = {
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
    localStorage.setItem('schedules', JSON.stringify(schedules)); // Сохраняем дефолтные данные
} else {
    console.log("Данные из localStorage:", schedules);
}

function showSchedule() {
    console.log("Показ расписания...");
    console.log("Категория:", category, "Опция:", option);
    const tbody = document.getElementById("scheduleBody");
    const thead = document.querySelector("#scheduleTable thead tr");
    const scheduleTable = document.getElementById("scheduleTable");

    if (!tbody || !thead || !scheduleTable) {
        console.error("DOM-элементы не найдены!");
        return;
    }

    tbody.innerHTML = "";
    scheduleTable.classList.remove("hidden"); // Убедимся, что таблица видна

    if (category && option && schedules[category] && schedules[category][option]) {
        console.log("Данные для отображения:", schedules[category][option]);
        const data = schedules[category][option];
        const weekDates = getWeekDates(); // Получаем даты текущей недели

        // Обновляем заголовки таблицы с датами
        const days = ["Понедельник", "Вторник", "Среда", "Четверг", "Пятница"];
        const thCells = thead.querySelectorAll("th");
        thCells.forEach((th, index) => {
            if (index > 0) { // Пропускаем первый столбец (Время)
                th.innerHTML = `${days[index - 1]}<br>${weekDates[index - 1]}`;
            }
        });

        // Определим временные слоты
        const timeSlots = [
            "08:45-10:20",
            "10:35-12:10",
            "12:25-14:00",
            "14:45-16:20",
            "16:35-18:10",
            "18:25-20:00",
            "20:15-21:50"
        ];

        // Создаем карту данных по дням и времени
        const scheduleMap = {};
        data.forEach(item => {
            if (!scheduleMap[item.day]) scheduleMap[item.day] = {};
            scheduleMap[item.day][item.time] = item.subject;
        });

        // Создаем строки для каждого временного слота
        let hasData = false;
        timeSlots.forEach(time => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${time}</td>`; // Временной слот
            
            days.forEach(day => {
                const cell = document.createElement("td");
                const subject = scheduleMap[day] && scheduleMap[day][time] ? scheduleMap[day][time] : "";
                if (subject) {
                    cell.textContent = subject;
                    hasData = true;
                } else {
                    cell.textContent = "";
                }
                row.appendChild(cell);
            });
            
            tbody.appendChild(row);
        });

        if (!hasData) {
            console.log("Нет данных для отображения для выбранной комбинации.");
            tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #a83232;">Нет данных для отображения. Проверьте расписание в админ-панели.</td></tr>';
        }
    } else {
        console.log("Нет данных для отображения или выбор не сделан.");
        tbody.innerHTML = '<tr><td colspan="6" style="text-align: center; color: #a83232;">Ошибка: некорректные параметры. Вернитесь на главную страницу.</td></tr>';
    }
}

// Функция для возврата на главную страницу
function goBack() {
    window.location.href = 'index.html';
}

// Функция для получения начала текущей недели (понедельник)
function getWeekStart() {
    const now = new Date();
    const day = now.getDay() || 7; // 0 (воскресенье) -> 7 для корректного вычисления
    const diff = now.getDate() - day + (day === 7 ? 0 : 1); // Сдвиг на понедельник
    const monday = new Date(now.setDate(diff));
    return monday;
}

// Получаем массив дат для текущей недели (понедельник-пятница)
function getWeekDates() {
    const start = getWeekStart();
    const dates = [];
    const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
    for (let i = 0; i < 5; i++) { // 5 дней (пн-пт)
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        dates.push(date.toLocaleDateString('ru', { day: 'numeric', month: 'short' }).replace('.', ''));
        document.getElementById(`${days[i]}Date`).textContent = dates[i];
    }
    return dates;
}

// Вызываем функцию при загрузке страницы
window.onload = function() {
    showSchedule(); // Показываем расписание на основе параметров URL
};