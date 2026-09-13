# 🎨 custom-color-logs (v3.0.0)

> Продвинутая, легковесная и абсолютно отказоустойчивая (**Poka-yoke**) система логирования для Node.js с динамической кастомизацией цветов через `.env`.

[<img src="https://img.icons8.ru/?size=100&id=24895&format=png&color=000000" height="60" align="center"> npm versions](https://www.npmjs.com/package/custom-color-logs?activeTab=versions)
[<img src="https://img.icons8.ru/?size=100&id=24895&format=png&color=000000" height="60" align="center"> На npm](https://www.npmjs.com/package/custom-color-logs/v3.0.0)
[<img src="https://img.icons8.ru/?size=100&id=12599&format=png&color=000000" height="60" align="center"> На GitHub](LICENSE)
[<img src="https://img.icons8.ru/?size=100&id=dvsOEzqniDma&format=png&color=000000" height="60" align="center"> License](LICENSE)

---

## ⚠️ ВАЖНО: Что нового в v3.0.0 (Breaking Changes)

Если вы обновляетесь с версии `1.x.x` или `2.x.x`, ваш код может сломаться. Мы полностью изменили архитектуру для повышения производительности и безопасности:
1. **Отдельный объект вместо класса:** Модуль `print` теперь является **чистым объектом**, а не классом. Больше не нужно использовать `static` или создавать экземпляры.
2. **Прямая передача объектов:** Больше не нужно делать `JSON.stringify(obj)` перед отправкой в логгер. Передавайте объекты, массивы и нативные ошибки `new Error()` напрямую!
3. **Умный перехват `console.log`:** Логгер автоматически внедряется в стандартную консоль и раскрашивает сторонние логи в цвет по умолчанию, бережно обходя префиксы `print`.

---

## ✨ Ключевые фичи

* 🚀 **Умная раскраска объектов:** Автоматически парсит объекты и массивы. Ключи (properties) и значения (values) красятся в РАЗНЫЕ цвета, заданные в `.env`.
* 🪵 **Иерархия префиксов:** Логи автоматически группируются по красивой структуре (`SYSTEM:SERVER:DATABASE:`, `NODE:NODE-MODULES:[ LOGGER ]`).
* 🔒 **Абсолютная отказоустойчивость (Poka-yoke):** Если вы опечатаетесь в названии цвета в файле `.env` (например, напишете `Reddd` вместо `Red` или оставите лишние пробелы), приложение **не упадет**. Логгер автоматически применит безопасный дефолтный цвет.

---

## 📦 Установка

```bash
npm install custom-color-logs
# или 
yarn add custom-color-logs
```

---

## 🛠 Настройка через `.env`

При первом запуске логгер автоматически создаст или дополнит ваш файл `.env` дефолтными настройками. Вы можете изменить их в любой момент:

```env
# Активация логов и времени
SHOW_START_LOG=true
SHOW_MODULE_LOGS=true
SHOW_TIME_AT_LOG=true

# Главный префикс и его цвет
PREFIX_TEXT="SYSTEM"
PREFIX_TEXT_COLOR=Blue

# Настройка умного окрашивания объектов (Фича v3.0.0!)
KEY_COLOR=Magenta      # Цвет для ключей (например, name, age)
VALUE_COLOR=Yellow     # Цвет для значений (например, "Иван", 25)

# Цвета для обычного текста и времени
COLOR=Gray
TIME_COLOR=White

# Системные теги
INFO_COLOR=Blue
WARNING_COLOR=Orange
ERROR_COLOR=Red
ERROR_STACK_COLOR=Red
NAME_FUNCTION_COLOR=Lime
CUSTOM_TEXT_TO_FUNCTION_COLOR=Gray
```

---

## 🚀 Примеры использования

### 1. Импорт логгера
```javascript
// Больше не нужно деструктурировать класс! Просто забираем объект print
const { print } = require("custom-color-logs");
```

### 2. Базовые логи
```javascript
print.ServerInfo("Информационное сообщение сервера"); 
// Выведет: [12:00:00] SYSTEM:SERVER: @info Информационное сообщение (серым цветом)

print.ServerWarn("Превышен лимит запросов");
// Выведет оранжевым цветом

print.ServerError(new Error("Сбой базы данных"));
// Безопасно выведет message ошибки красным цветом
```

### 3. Логирование внутри функций и производительность
```javascript
print.DatabaseFunctionInfo("authCheck", "Проверка сессии пользователя");
print.DatabaseFunctionStatus("authCheck", "Успешная авторизация (ID: 777)");
print.ServerFunctionPositivePerformance("API_Request", "Время ответа: 45ms");
```

### 4. Умный вывод объектов
```javascript
const user = {
    name: "Иван",
    age: 25,
    roles: ["admin", "user"],
    meta: { active: true }
};

// Передаем объект НАПРЯМУЮ в любой метод
print.DatabaseInfo(user);
// В консоли развернется красивый JSON, где 'name' будет Magenta, а '"Иван"' - Yellow!
```

---

## 🟦 Поддержка TypeScript

Начиная с версии `v3.0.0`, библиотека поставляется со встроенными и полностью обновленными декларациями типов (`index.d.ts`). 

Вам больше не нужно вручную описывать интерфейсы для динамических методов (таких как `print.ServerInfo` или `print.DatabaseError`). Благодаря продвинутой маппинг-типизации TypeScript автоматически распознает все 40+ комбинаций компонентов и методов.

### Пример использования в TS:

```typescript
import { print } from "custom-color-logs";

// 🚀 Полная поддержка автодополнения (IntelliSense) прямо в редакторе!
print.ServerInfo("Информационное сообщение сервера");

// Защита от дурака: аргументы сообщений типизированы как `any`. 
// Вы можете безопасно передавать сложные объекты, типы не "заругаются":
interface UserData {
  id: number;
  name: string;
}

const user: UserData = { id: 1, name: "Иван" };
print.DatabaseInfo(user); // TS идеально поймет этот вызов
```

### Безопасность типов (Readonly)
Экспортируемый объект `print` защищен на уровне компиляции модификатором `Readonly`. Это означает, что сторонний код вашего проекта не сможет случайно перезаписать методы логгера (например, действие `print.ServerInfo = null` вызовет ошибку компиляции).

---

## 📝 [Лицензия](LICENSE)

ISC © prm-programmer

* 👋 **Контакты:** [GitHub](https://github.com) | [npm Profile](https://npmjs.com)
* 📧 **Почта:** [p7841744@gmail.com](mailto:p7841744@gmail.com)
* 📱 **Viber:** [+375 (44) 521-45-73](viber://chat?number=+375445214573)

### 🐛 Нашли ошибку? 
Пишите на [Gmail](mailto:p7841744@gmail.com?subject=Нахождение%20ошибки%20в%20коде&body=Здраствуйте!%20Я%20обнаружил%20ошибку%20в%20коде.%20Она%20появляется%20если%20вызвать%20%28название%20фунции%29.%20Вот%20лог%20ошибки%3A%20%28лог%29%3B%20код%3A%20%28код%20файла%20где%20появляется%20ошибка%29) или в [Viber](viber://chat?number=+375445214573). Пожалуйста, приложите логи и участок кода, вызывающий сбой.
