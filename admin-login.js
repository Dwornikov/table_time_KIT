document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');

    // Простая проверка логина/пароля (в реальном проекте используйте серверную аутентификацию)
    if (username === 'admin' && password === '12345') {
        // Перенаправляем на страницу админ-панели
        window.location.href = 'admin-panel.html';
    } else {
        errorMessage.textContent = 'Неверный логин или пароль';
    }
});