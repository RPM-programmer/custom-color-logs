require("./patch.js"); 

const process = require("process"); 
const chalk = require("./chalk-palette.js"); 
const converter = require("./converter.js"); 
const fs = require('fs'); 
const path = require('path'); 
require("dotenv").config(); 

const errorsFile = "./logs/errors.log"; 
const shouldLog = (process.env.SHOW_MODULE_LOGS === 'true' || process.env.SHOW_START_LOG === 'true'); 

// --- ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ---

function safeChalk(colorKey, text) {
    if (!text) return '';
    const colorName = process.env[colorKey] || colorKey;
    if (!colorName || typeof chalk !== 'object') return text;

    const cleanColor = colorName.replace(/;/g, '').trim().toLowerCase();
    const formattedColor = cleanColor.charAt(0).toUpperCase() + cleanColor.slice(1);

    if (typeof chalk[formattedColor] === 'function') {
        return chalk[formattedColor](text);
    }
    return text;
}

function formatAndCleanStack(error) {
    if (!error) return 'No error stack available';
    const stack = error.stack || String(error); 
    return stack
        .split('\n')
        .filter(line => !line.includes('node:internal') && !line.includes('(internal/') && !line.includes('node_modules')) 
        .join('\n'); 
}

function saveErrorLogSync(errorTitle, errorMessage, details = '') {
    const now = new Date().toLocaleString('ru-RU'); 
    const logData = `\n------------------------------[ ${now} ]------------------------------\n` +
                    `TYPE: ${errorTitle}\nMESSAGE: ${errorMessage}\n${details}\n` +
                    `----------------------------------------------------------------------\n`; 
    try {
        const dir = path.dirname(errorsFile); 
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); 
        fs.appendFileSync(errorsFile, logData, "utf8"); 
    } catch (fsErr) {
        console.error('Критический сбой: невозможно записать лог-файл:', fsErr.message); 
    }
}

function getSafeString(key, fallback = '') {
    return converter && converter[key] ? converter[key] : fallback;
}

// Умная функция сериализации данных для аргументов методов BaseLogger
function stringifyArg(arg, keyColor, valueColor) {
    if (typeof arg === 'string') return arg;
    
    if (typeof arg === 'object' && arg !== null) {
        try {
            if (global.customColorizeOutput) {
                return global.customColorizeOutput(arg, keyColor, valueColor);
            }
            return JSON.stringify(arg);
        } catch {
            return String(arg);
        }
    }
    return String(arg);
}

// Вспомогательная функция для удаления кодов сброса стилей из середины строки
function bypassResetCode(text) {
    if (!text) return '';
    // Вырезаем невидимый код сброса \u001b[0m или \x1b[0m, который зашивается прокси-объектом chalk
    return text.replace(/\u001b\[0m/g, '').replace(/\x1b\[0m/g, '');
}

// --- ДИНАМИЧЕСКИЙ КЛАСС ЛОГЕРА ---

class BaseLogger {
    constructor(componentKey) {
        this.component = getSafeString(componentKey, componentKey);
    }

    _prefix() {
        const to = getSafeString('TO', ':');
        const and = getSafeString('AND', ' ');

        const rawSystem = process.env.PREFIX_TEXT || 'SYSTEM';
        const systemColor = process.env.PREFIX_TEXT_COLOR || 'Blue';
        const system = typeof converter.safeColor === 'function' 
            ? converter.safeColor(systemColor, rawSystem) 
            : rawSystem;

        const server = getSafeString('SERVER', 'SERVER');

        // Вырезаем код сброса стилей с конца префикса, чтобы цвет беспрепятственно шёл дальше
        if (this.component === server) {
            return bypassResetCode(`${system}${to}${server}${to}${and}`);
        }

        return bypassResetCode(`${system}${to}${server}${to}${this.component}${to}${and}`);
    }

    _parseArgs(args) {
        const kColor = process.env.KEY_COLOR || 'Yellow';
        const vColor = process.env.VALUE_COLOR || 'Green';
        return args.map(arg => stringifyArg(arg, kColor, vColor)).join(' ');
    }

    // --- МЕТОДЫ ЛОГЕРА С ГАРАНТИРОВАННЫМ ОКРАШИВАНИЕМ ТЕКСТА ---

    Info(...args) {
        const text = this._parseArgs(args);
        const tag = getSafeString('INFO', 'INFO');
        const and = getSafeString('AND', ' ');
        
        // Поко-ёкэ: Вырезаем сброс цвета после префикса и тега, а затем красим сообщение в COLOR (.env)
        const prefixAndTag = bypassResetCode(`${this._prefix()}${tag}${and}`);
        const coloredText = safeChalk('COLOR', text);
        return `${prefixAndTag}${coloredText}`;
    }

    Error(...args) {
        const firstArg = args[0];
        const errMsg = (firstArg && firstArg.message) ? firstArg.message : this._parseArgs(args);
        const tag = getSafeString('ERROR', 'ERROR');
        const and = getSafeString('AND', ' ');
        
        const prefixAndTag = bypassResetCode(`${this._prefix()}${tag}${and}`);
        const coloredText = safeChalk('ERROR_COLOR', errMsg);
        return `${prefixAndTag}${coloredText}`;
    }

    Warn(...args) {
        const text = this._parseArgs(args);
        const tag = getSafeString('WARN', 'WARN');
        const and = getSafeString('AND', ' ');
        
        const prefixAndTag = bypassResetCode(`${this._prefix()}${tag}${and}`);
        const coloredText = safeChalk('WARNING_COLOR', text);
        return `${prefixAndTag}${coloredText}`;
    }

    FunctionInfo(funName, ...args) {
        const text = this._parseArgs(args);
        const tag = getSafeString('FUNCTION_INFO', 'FUNC_INFO');
        const and = getSafeString('AND', ' ');
        const funcTag = safeChalk('NAME_FUNCTION_COLOR', `[-${funName}-]`);
        
        const prefixAndTag = bypassResetCode(`${this._prefix()}${tag}${and}${funcTag}${and}`);
        const coloredText = safeChalk('CUSTOM_TEXT_TO_FUNCTION_COLOR', text);
        return `${prefixAndTag}${coloredText}`;
    }

    FunctionStatus(function_name, ...args) {
        const text = this._parseArgs(args);
        const tag = getSafeString('FUNCTION_STATUS', 'FUNC_STATUS');
        const and = getSafeString('AND', ' ');
        const funcTag = safeChalk('NAME_FUNCTION_COLOR', `[-${function_name}-]`);
        
        const prefixAndTag = bypassResetCode(`${this._prefix()}${tag}${and}${funcTag}${and}status${and}`);
        const coloredText = safeChalk('CUSTOM_TEXT_TO_FUNCTION_COLOR', text);
        return `${prefixAndTag}${coloredText}`;
    }

    FunctionPrint(funName, ...args) {
        const text = this._parseArgs(args);
        const tag = getSafeString('LOG', 'LOG');
        const and = getSafeString('AND', ' ');
        const funcTag = safeChalk('NAME_FUNCTION_COLOR', `[-${funName}-]`);
        
        const prefixAndTag = bypassResetCode(`${this._prefix()}${tag}${and}${funcTag}${and}`);
        const coloredText = safeChalk('CUSTOM_TEXT_TO_FUNCTION_COLOR', text);
        return `${prefixAndTag}${coloredText}`;
    }

    FunctionPositivePerformance(funName, ...args) { 
        const text = this._parseArgs(args);
        const tag = getSafeString('POSITIVE', 'OK');
        const and = getSafeString('AND', ' ');
        const funcTag = safeChalk('PNAME_COLOR', funName);
        
        const prefixAndTag = bypassResetCode(`${this._prefix()}${tag}${and}${funcTag}${and}`);
        const coloredText = safeChalk('COLOR', text);
        return `${prefixAndTag}${coloredText}`;
    }

    FunctionNegativePerformance(funName, ...args) {
        const text = this._parseArgs(args);
        const tag = getSafeString('NEGATIVE', 'FAIL');
        const and = getSafeString('AND', ' ');
        const funcTag = safeChalk('NNAME_COLOR', funName);
        
        const prefixAndTag = bypassResetCode(`${this._prefix()}${tag}${and}${funcTag}${and}`);
        const coloredText = safeChalk('COLOR', text);
        return `${prefixAndTag}${coloredText}`;
    }
}

// --- АВТОМАТИЧЕСКАЯ СБОРКА ИНТЕРФЕЙСА ---

const components = {
    Server: 'SERVER', 
    Socket: 'SOCKET',
    Writter: 'WRITTER',
    Database: 'DATABASE',
    Nodemailer: 'NODEMAILER'
};

const print = {};

Object.entries(components).forEach(([className, targetKey]) => {
    const logger = new BaseLogger(targetKey);
    
    const methods = [
        'Info', 'Error', 'Warn', 'FunctionInfo', 'FunctionStatus', 'FunctionPrint', 
        'FunctionPositivePerformance', 'FunctionNegativePerformance'
    ];
    
    methods.forEach(method => {
        const finalMethodName = `${className}${method}`;
        print[finalMethodName] = (...args) => logger[method](...args);
    });
});

print.NodemailerFunctionPositiveSending = function(gmail) {
    const label = `Gmail - ${gmail}`;
    const coloredLabel = safeChalk('GMAIL_COLOR', label); 
    const prefix = bypassResetCode(`${getSafeString('SERVER', 'SERVER')}${getSafeString('TO', '->')}${getSafeString('NODEMAILER', 'NODEMAILER')}${getSafeString('TO', '->')}${getSafeString('AND', ' ')}${getSafeString('POSITIVE_SEND', 'SEND_OK')}${getSafeString('AND', ' ')}`);
    return `${prefix}${coloredLabel}`;
};

print.NodemailerFunctionNegativeSending = function(gmail) {
    const label = `Gmail - ${gmail}`;
    const coloredLabel = safeChalk('GMAIL_COLOR', label);
    const prefix = bypassResetCode(`${getSafeString('SERVER', 'SERVER')}${getSafeString('TO', '->')}${getSafeString('NODEMAILER', 'NODEMAILER')}${getSafeString('TO', '->')}${getSafeString('AND', ' ')}${getSafeString('NEGATIVE_SEND', 'SEND_FAIL')}${getSafeString('AND', ' ')}`);
    return `${prefix}${coloredLabel}`;
};

module.exports = { print };

// --- СИСТЕМНЫЕ ИНИЦИАЛИЗАЦИИ ---

const moduleNameCache = new Map();

function getModuleNameFromFile(filePath) {
    if (moduleNameCache.has(filePath)) return moduleNameCache.get(filePath);

    let currentDir = path.dirname(filePath);
    while (currentDir !== path.parse(currentDir).root) {
        const pkgPath = path.join(currentDir, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                const name = pkg.name || path.basename(currentDir);
                moduleNameCache.set(filePath, name);
                return name;
            } catch {
                const name = path.basename(currentDir);
                moduleNameCache.set(filePath, name);
                return name;}}currentDir = path.dirname(currentDir);
            }moduleNameCache.set(filePath, null);
            return null;
        }
        const activeModules = Object.keys(require.cache).filter(filePath => filePath !== __filename).map(filePath => getModuleNameFromFile(filePath)).filter(name => name !== null);
        const uniqueModules = [...new Set(activeModules)];
        function logModulesState(rawColor, activeMsg, emptyMsg) {
            const to = getSafeString('TO', ':');
            const nodePrefix = typeof converter.safeColor === 'function' ? converter.safeColor('Blue', 'NODE') : 'NODE';
            const modulesKey = getSafeString('MODULES', 'NODE-MODULES');
            const baseNodeModulesPrefix = `${nodePrefix}${to}${modulesKey}`;
            const infoKey = getSafeString('INFO', 'INFO');
            const openBracket = safeChalk('Cyan', '[');
            const closeBracket = safeChalk('Cyan', ']');
            if (uniqueModules.length === 0) {
                const coloredEmpty = converter && typeof converter.safeColor === 'function' ? converter.safeColor(rawColor, emptyMsg) : String(emptyMsg);
                console.log(bypassResetCode(`${baseNodeModulesPrefix} ${infoKey} ) + coloredEmpty`));
            } else {
                uniqueModules.forEach((mod) => {
                    const formattedMod = `${openBracket} ${safeChalk('Cyan', mod.toUpperCase())} ${closeBracket}`;
                    console.log(bypassResetCode(`${baseNodeModulesPrefix}${to}${formattedMod} ${infoKey}`) + converter.safeColor(rawColor, activeMsg));
                });
            }
        }
        if (shouldLog) {
            const to = getSafeString('TO', ':');
            const nodePrefix = typeof converter.safeColor === 'function' ? converter.safeColor('Blue', 'NODE') : 'NODE';
            const modulesKey = getSafeString('MODULES', 'NODE-MODULES');
            const moduleName = getSafeString('MODULE_NAME', 'LOGGER');
            const infoKey = getSafeString('INFO', 'INFO');
            const startMsg = getSafeString('CUSTOM_START_MESSAGE', 'Starting...');
            console.log(bypassResetCode(`${nodePrefix}${to}${modulesKey}${to}${moduleName} ${infoKey} `) + startMsg);
            logModulesState(process.env.CUSTOM_MODULES_START_MESSAGE_COLOR, process.env.CUSTOM_MODULES_START_MESSAGE, process.env.CUSTOM_MODULES_START_MESSAGE_IF_ISNT_MODULES);
        }
process.on("uncaughtException", (error) => {
    const cleanStack = formatAndCleanStack(error);
    const customMessage = process.env.CUSTOM_ERROR_MESSAGE || "Uncaught Exception Detected";
    
    const server = getSafeString('SERVER', 'SERVER');
    const to = getSafeString('TO', '->');
    const and = getSafeString('AND', ' ');
    const errorKey = getSafeString('ERROR', 'ERROR');

    console.error(`${server}${to}${and}${errorKey}${and}${safeChalk('CUSTOM_ERROR_MESSAGE_COLOR', customMessage)}\n${safeChalk('ERROR_COLOR', cleanStack)}`);
    
    // ИСПРАВЛЕНО: обернуто в обратные шаблонные кавычки ``
    saveErrorLogSync("UNCAUGHT_EXCEPTION", error ? error.message : '', `STACK:\n${cleanStack}`);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    const cleanStack = formatAndCleanStack(reason);
    const customMessage = process.env.CUSTOM_ERROR_MESSAGE || "Unhandled Rejection Detected";
    const errorMessage = reason instanceof Error ? reason.message : String(reason);
    
    const server = getSafeString('SERVER', 'SERVER');
    const to = getSafeString('TO', '->');
    const and = getSafeString('AND', ' ');
    const errorKey = getSafeString('ERROR', 'ERROR');

    console.error(`${server}${to}${and}${errorKey}${and}${safeChalk('CUSTOM_ERROR_MESSAGE_COLOR', customMessage)}\n${safeChalk('COLOR', cleanStack)}`);
    
    // ИСПРАВЛЕНО: обернуто в обратные шаблонные кавычки ``
    saveErrorLogSync("UNHANDLED_REJECTION", errorMessage, `STACK:\n${cleanStack}`);
    process.exit(1);
});
