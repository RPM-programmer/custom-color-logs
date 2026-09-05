const process = require("process");
const chalk = require("chalk-palette");
const converter = require("./converter.js");
const fs = require('fs');
const path = require('path');
require("dotenv").config();

const shouldLog = (process.env.SHOW_MODULE_LOGS === 'true' || process.env.SHOW_START_LOG === 'true');

// Функция поиска имени модуля
function getModuleNameFromFile(filePath) {
    let currentDir = path.dirname(filePath);
    while (currentDir !== path.parse(currentDir).root) {
        const pkgPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                return pkg.name || path.basename(currentDir); 
            } catch {
                return path.basename(currentDir);
            }
        }
        currentDir = path.dirname(currentDir);
    }
    return null;
}

// Сбор активных модулей из кэша
const activeModules = Object.keys(require.cache)
    .filter(filePath => filePath !== __filename)
    .map(filePath => getModuleNameFromFile(filePath))
    .filter(name => name !== null);
const uniqueModules = [...new Set(activeModules)];

// Вспомогательная функция для красивого вывода состояний модулей
function logModulesState(rawColor, activeMsg, emptyMsg) {
    if (uniqueModules.length === 0) {
        console.log(`${converter.SERVER}${converter.TO}${converter.MODULES} ${converter.INFO} ${converter.safeColor(rawColor, emptyMsg)}`);
    } else {
        uniqueModules.forEach((mod) => {
            const formattedMod = typeof chalk.Cyan === 'function' ? `${chalk.Cyan('[')} ${chalk.Cyan(mod.toUpperCase())} ${chalk.Cyan(']')}` : `[ ${mod.toUpperCase()} ]`;
            console.log(`${converter.SERVER}${converter.TO}${converter.MODULES}${converter.TO}${formattedMod} ${converter.INFO} ${converter.safeColor(rawColor, activeMsg)}`);
        });
    }
}

// --- Старт процесса ---
if (shouldLog) {
    // Единичный стартовый лог
    console.log(`${converter.SERVER}${converter.TO}${converter.MODULES}${converter.TO}${converter.MODULE_NAME} ${converter.INFO} ${converter.CUSTOM_START_MESSAGE}`);
    
    // Логирование состояний каждого модуля на старте
    logModulesState(
        process.env.CUSTOM_MODULES_START_MESSAGE_COLOR,
        process.env.CUSTOM_MODULES_START_MESSAGE,
        process.env.CUSTOM_MODULES_START_MESSAGE_IF_ISNT_MODULES
    );
}

class print {
    static ServerProcessEnd(text) {}
}

// --- Завершение процесса ---
process.on("beforeExit", () => {
    if (process.env.SHOW_END_LOG === "true") {
        // Логирование состояний каждого модуля при остановке
        logModulesState(
            process.env.CUSTOM_MODULES_STOP_MESSAGE_COLOR,
            process.env.CUSTOM_MODULES_STOP_MESSAGE,
            process.env.CUSTOM_MODULES_STOP_MESSAGE_IF_ISNT_MODULES
        );

        // Финальный лог закрытия кода ядра
        const finalMessage = process.env.CUSTOM_MODULE_STOP_MESSAGE || "Code is stop!";
        console.log(`${converter.SERVER}${converter.TO}${converter.MODULES}${converter.TO}${converter.MODULE_NAME} ${converter.INFO} ${converter.safeColor(process.env.COLOR, finalMessage)}`);
    }
});

module.exports = { print };
