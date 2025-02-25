// Загрузка данных из localStorage с проверкой
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

function updateOptions() {
    console.log("Обновление опций...");
    const category = document.getElementById("category").value;
    console.log("Категория:", category);
    const optionSelect = document.getElementById("option");
    optionSelect.innerHTML = '<option value="">Выберите...</option>';
    optionSelect.disabled = false;

    if (category && schedules[category]) {
        for (let key in schedules[category]) {
            console.log("Добавлена опция:", key);
            const option = document.createElement("option");
            option.value = key;
            option.textContent = key;
            optionSelect.appendChild(option);
        }
    }
    // Не вызываем redirectToSchedule, так как переход только по кнопке
}

function redirectToSchedule() {
    console.log("Перенаправление на страницу расписания...");
    const category = document.getElementById("category").value;
    const option = document.getElementById("option").value;
    console.log("Категория:", category, "Опция:", option);

    if (category && option && schedules[category] && schedules[category][option]) {
        window.location.href = `schedule.html?category=${encodeURIComponent(category)}&option=${encodeURIComponent(option)}`;
    } else {
        console.log("Некорректный выбор. Выберите категорию и группу/преподавателя.");
        alert("Пожалуйста, выберите категорию и группу или преподавателя.");
    }
}

// Функции для работы с модальным окном входа админа
document.getElementById('adminLoginBtn').addEventListener('click', function() {
    document.getElementById('adminLoginModal').classList.add('show');
});

function closeModal() {
    const modal = document.getElementById('adminLoginModal');
    modal.classList.remove('show');
    modal.classList.add('hide');
    setTimeout(() => {
        modal.classList.remove('hide');
        modal.classList.add('hidden');
        document.getElementById('adminErrorMessage').textContent = '';
        document.getElementById('adminUsername').value = '';
        document.getElementById('adminPassword').value = '';
    }, 300); // Задержка для анимации
}

document.getElementById('adminLoginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('adminUsername').value;
    const password = document.getElementById('adminPassword').value;
    const errorMessage = document.getElementById('adminErrorMessage');

    // Простая проверка логина/пароля (в реальном проекте используйте серверную аутентификацию)
    if (username === 'admin' && password === '12345') {
        closeModal();
        window.location.href = 'admin-panel.html';
    } else {
        errorMessage.textContent = 'Неверный логин или пароль';
    }
});

// Вызываем функцию при загрузке страницы для инициализации
window.onload = function() {
    updateOptions(); // Инициализация списка опций
};