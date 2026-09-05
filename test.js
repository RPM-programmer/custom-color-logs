const path = require('path');
const fs = require('fs');

// 1. Принудительно загружаем ваш .env, чтобы убедиться, что переменные доступны
require("dotenv").config();

// Путь к вашему файлу логгера (измените имя 'logger.js' на реальное, если оно другое)
const loggerPath = "./index.js"; 

// 2. Подключаем логгер
// В этот момент автоматически сработает ваш внутренний блок "if (shouldLog)"
const { print } = require(loggerPath);

// Делаем небольшую паузу в 100мс, чтобы системные логи из вашего файла успели напечататься первыми
setTimeout(() => {
    console.log("\n" + "=".repeat(20) + " ТЕСТ ВАШИХ СТИЛЕЙ ИЗ .ENV " + "=".repeat(20) + "\n");

    // --- БАЗОВЫЕ СТАТУСЫ ---
    console.log(print.ServerInfo("Тестовое информационное сообщение сервера"));
    console.log(print.ServerWarn("Предупреждение: превышен лимит запросов"));
    console.log(print.ServerError({ message: "Критический сбой базы данных" }));
    console.log("-".repeat(60));

    // --- ФУНКЦИИ И СТАТУСЫ ---
    console.log(print.DatabaseFunctionInfo("authCheck", "Проверка сессии пользователя"));
    console.log(print.DatabaseFunctionStatus("authCheck", "Успешная авторизация (ID: 777)"));
    console.log(print.SocketFunctionPrint("emitEvent", "Отправка пакета всем активным клиентам"));
    console.log("-".repeat(60));

    // ---ПЕРФОРМАНС ---
    console.log(print.ServerFuctionPositivePerfomance("API_Request", "Время ответа в пределах нормы: 45ms"));
    console.log(print.ServerFunctionNegativePerfomance("DB_Backup", "ВНИМАНИЕ! Резервное копирование заняло 12.4с"));
    console.log("-".repeat(60));

    // --- СУГУБО NODEMAILER ---
    console.log(print.NodemailerFuctionPositiveSending("success-recipient@domain.com"));
    console.log(print.NodemailerFunctionNegativeSending("failed-mailbox@domain.com"));

    console.log("\n" + "=".repeat(23) + " КОНЕЦ ТЕСТИРОВАНИЯ " + "=".repeat(23) + "\n");
    
    // --- ПРОВЕРКА ФАЙЛА ЛОГОВ ---
    const errorsLogPath = path.resolve("./logs/errors.log");
    if (fs.existsSync(errorsLogPath)) {
        console.log(`💡 Лог-файл ошибок существует по пути: ${errorsLogPath}`);
    } else {
        console.log(`⚠️ Лог-файл ошибок еще не создавался (папка ./logs/ пуста).`);
    }

}, 100);
