# 🚀 custom-color-logs

> Продвинутая и гибкая система логирования для Node.js, которая превращает скучный вывод в терминале в структурированный, полностью безопасный и стильный инструмент мониторинга.


[<img src="https://img.icons8.ru/?size=100&id=24895&format=png&color=000000" height="60" align="center"> npm versions](https://www.npmjs.com/package/custom-color-logs?activeTab=versions)
[<img src="https://img.icons8.ru/?size=100&id=24895&format=png&color=000000" height="60" align="center"> На npm](https://www.npmjs.com/package/custom-color-logs)
[<img src="https://img.icons8.ru/?size=100&id=12599&format=png&color=000000" height="60" align="center"> На GitHub](LICENSE)
[<img src="https://img.icons8.ru/?size=100&id=dvsOEzqniDma&format=png&color=000000" height="60" align="center"> License](LICENSE)

---

## ✨ Особенности v2.0.0
* 🎨 **Полная кастомизация:** Тонкая настройка цветов (через `chalk-palette`) и префиксов для каждого системного компонента.
* 🛡️ **Абсолютная отказоустойчивость:** Больше никаких падений `TypeError: chalk[...] is not a function`. Если цвет в `.env` не задан, логгер безопасно выведет стандартный текст.
* 🔤 **Регистронезависимость:** Цвета автоматически преобразуются в CamelCase (например, `skyblue` станет `SkyBlue`), как требует `chalk-palette`.
* 📦 **Компонентная структура:** Изолированные пространства имен логов для `Server`, `Socket`, `Writter`, `Database` и `Nodemailer`.
* ⚡ **Performance-трекинг:** Специальные методы для красивой индикации быстрой или медленной работы функций.
* 🛡️ **Безопасность процессов:** Автоматический перехват критических ошибок `uncaughtException` и `unhandledRejection` с очисткой трейса от лишнего «мусора» Node.js.
* 💾 **Гарантия логирования:** Синхронная запись критических ошибок в файл `./logs/errors.log` до того, как упадет процесс.

---

## 📦 Установка

Вы можете установить модуль с помощью вашего любого пакетного менеджера:

```bash
npm install custom-color-logs
# или
yarn add custom-color-logs
```

---

## 🚨 Мажорные изменения (Миграция с v1.x на v2.x)

В версии **v2.0.0** были полностью вычищены исторические опечатки в динамических методах. Если вы использовали их, обновите названия в своём коде:

| Было в v1.x (С ошибками) | Стало в v2.x (Правильно) |
| :--- | :--- |
| `print.XFuctionPositivePerfomance` | `print.XFunctionPositivePerformance` |
| `print.XFunctionNegativePerfomance` | `print.XFunctionNegativePerformance` |
| `print.NodemailerFuctionPositiveSending` | `print.NodemailerFunctionPositiveSending` |

*(Где `X` — имя компонента: `Server`, `Socket`, `Database`, `Writter`, `Nodemailer`).*

---

## 💻 Пример использования и Тестирование

Для проверки того, как ваши стили и палитры выглядят вживую, вы можете использовать готовый скрипт-тестер. Подключите конфигурацию `.env` и выполните следующий код:

```javascript
// загрузка стилей из .env
require("dotenv").config();
// загрузка модуля
const { print } = require("custom-color-logs");

// использавоние:


// Информация о состоянии
// информация
console.log(print.ServerInfo("Тестовое информационное сообщение сервера"));
// предупреждение
console.log(print.ServerWarn("Предупреждение: превышен лимит запросов"));
// ошибка
console.log(print.ServerError({ message: "Критический сбой базы данных" }));


// Информация от функции
// информация от функции
console.log(print.DatabaseFunctionInfo("authCheck", "Проверка сессии пользователя"));
// статус выполнения функции
console.log(print.DatabaseFunctionStatus("authCheck", "Успешная авторизация (ID: 777)"));
// вывод функции
console.log(print.SocketFunctionPrint("emitEvent", "Отправка пакета всем активным клиентам"));
// положительное выполнение функции
console.log(print.ServerFunctionPositivePerformance("API_Request", "Время ответа в пределах нормы: 45ms"));
// отрицательное выполнение функции
console.log(print.ServerFunctionNegativePerformance("DB_Backup", "ВНИМАНИЕ! Резервное копирование заняло 12.4с"));


// NODEMAILER
// положительная отправка (письмо доставленно)
console.log(print.NodemailerFunctionPositiveSending("success-recipient@domain.com"));
// отрицательная отправка (письмо не отправленно)
console.log(print.NodemailerFunctionNegativeSending("failed-mailbox@domain.com"));
```

---

## 🛠 Гибкая настройка через `.env`

Логгер автоматически считывает настройки оформления из вашего файла окружения. Вы можете менять префиксы статусов и любые цвета (регистр больше не важен — логгер сам поймет и `blue`, и `Blue`):

```ini
# --- Управление поведением логов ---
SHOW_START_LOG                               = true
SHOW_MODULE_LOGS                             = false
SHOW_END_LOG                                 = true
SHOW_TIME_AT_LOG                             = true

# --- Основные статусы сообщений ---
INFO                                         = "@info"
INFO_COLOR                                   = "Blue"
WARNING                                      = "@warn"
WARNING_COLOR                                = "Orange"
ERROR                                        = "@error"
ERROR_COLOR                                  = "Red"
TIME_COLOR                                   = "White"

# --- Функции и логика компонентов ---
NAME_FUNCTION_COLOR                          = "Lime"
CUSTOM_TEXT_TO_FUNCTION_COLOR                = "Gray"
POSITIVE_COLOR                               = "Green"
NEGATIVE_COLOR                               = "Orange"
```

---

## 📂 Логирование сбоев (Error Logs)

При возникновении непредвиденной ошибки в коде вашего приложения логгер автоматически перехватит её, уберет лишние строки внутренних модулей Node.js (из `node_modules` и `node:internal`), после чего сформирует красивую запись в файле `./logs/errors.log`:

```text
------------------------------[ 05.09.2026, 20:15:30 ]------------------------------
TYPE: UNCAUGHT_EXCEPTION
MESSAGE: Критический сбой базы данных
STACK:
Error: Критический сбой базы данных
    at Object.<anonymous> (D:\project\test-logger.js:18:24)
------------------------------------------------------------------------------------
```

---

## 🛠 Разработка и тестирование (Development)

Для локального запуска и доработки проекта выполните следующие команды:

```bash
git clone https://github.com/RPM-programmer/custom-color-logs.git
cd custom-color-logs
npm install
node test.js
```

## 📄 Лицензия (License)

[MIT](LICENSE) © RPM-programmer
* [На GitHub](https://github.com/RPM-programmer)
* [На npm](https://www.npmjs.com/~prm-programmer)
