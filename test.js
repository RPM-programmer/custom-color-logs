require("dotenv").config();
const loggerPath = "./index.js";
const { print } = require(loggerPath);

console.log("\n" + "=".repeat(20) + " ТЕСТ ВАШИХ СТИЛЕЙ ИЗ .ENV " + "=".repeat(20) + "\n");

// --- 1. Текстовые сообщения компонентов ---
console.log(print.ServerInfo("Тестовое информационное сообщение сервера"));
console.log(print.ServerWarn("Предупреждение: превышен лимит запросов"));

// Защита от дурака: Теперь сюда можно спокойно передавать нативный объект ошибки!
console.log(print.ServerError(new Error("Критический сбой базы данных")));
console.log("-".repeat(60));

// --- 2. Логирование внутренних процессов функций ---
console.log(print.DatabaseFunctionInfo("authCheck", "Проверка сессии пользователя"));
console.log(print.DatabaseFunctionStatus("authCheck", "Успешная авторизация (ID: 777)"));
console.log(print.SocketFunctionPrint("emitEvent", "Отправка пакета всем активным клиентам"));
console.log("-".repeat(60));

// --- 3. Логи метрик производительности ---
console.log(print.ServerFunctionPositivePerformance("API_Request", "Время ответа в пределах нормы: 45ms"));
console.log(print.ServerFunctionNegativePerformance("DB_Backup", "ВНИМАНИЕ! Резервное копирование заняло 12.4с"));
console.log("-".repeat(60));

// --- 4. Логи сервиса Nodemailer ---
console.log(print.NodemailerFunctionPositiveSending("success-recipient@domain.com"));
console.log(print.NodemailerFunctionNegativeSending("failed-mailbox@domain.com"));
console.log("-".repeat(60));

// --- 5. Самый главный тест: Вывод объектов напрямую через методы логгера ---
console.log("\x1b[36m[ ТЕСТ ] Передача объекта и массива напрямую в методы логгера:\x1b[0m");

const userData = {
    name: "Иван",
    role: "Administrator",
    age: 25,
    permissions: ["read", "write", "delete"],
    serverDetails: { uptime: "45h", secure: true }
};

// Метод теперь сам применит KEY_COLOR к ключам и VALUE_COLOR к содержимому!
console.log(print.DatabaseInfo(userData));

console.log("\n" + "=".repeat(23) + " КОНЕЦ ТЕСТИРОВАНИЯ " + "=".repeat(23) + "\n");

// Прямой вызов оригинального консоль-лога для проверки перехвата patch.js
console.log("Обычный console.log с объектом:", { status: "работает", версия: "2.0.0" });
