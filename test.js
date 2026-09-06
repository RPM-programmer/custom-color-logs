require("dotenv").config();
const loggerPath = "./index.js";
const { print } = require(loggerPath);
console.log("\n" + "=".repeat(20) + " ТЕСТ ВАШИХ СТИЛЕЙ ИЗ .ENV " + "=".repeat(20) + "\n");


console.log(print.ServerInfo("Тестовое информационное сообщение сервера"));
console.log(print.ServerWarn("Предупреждение: превышен лимит запросов"));
console.log(print.ServerError({ message: "Критический сбой базы данных" }));
console.log("-".repeat(60));


console.log(print.DatabaseFunctionInfo("authCheck", "Проверка сессии пользователя"));
console.log(print.DatabaseFunctionStatus("authCheck", "Успешная авторизация (ID: 777)"));
console.log(print.SocketFunctionPrint("emitEvent", "Отправка пакета всем активным клиентам"));
console.log("-".repeat(60));


console.log(print.ServerFunctionPositivePerformance("API_Request", "Время ответа в пределах нормы: 45ms"));
console.log(print.ServerFunctionNegativePerformance("DB_Backup", "ВНИМАНИЕ! Резервное копирование заняло 12.4с"));
console.log("-".repeat(60));


console.log(print.NodemailerFunctionPositiveSending("success-recipient@domain.com"));
console.log(print.NodemailerFunctionNegativeSending("failed-mailbox@domain.com"));

console.log("\n" + "=".repeat(23) + " КОНЕЦ ТЕСТИРОВАНИЯ " + "=".repeat(23) + "\n");
