const safeChalk = require("./index.js");

// ОКРАШИВАНИЕ ТЕКСТА
// Синий текст
console.log(safeChalk.Blue("Blue"));
// Зелёный текст
console.log(safeChalk.Green("Green"));
// Красный текст
console.log(safeChalk.Red("Red"));

// ОКРАШИВАНИЕ ТЕКСТА И ФОНА
// Окрашивание фона в синий и текста в белый
console.log(safeChalk.bgBlue().White("Blue background and white text"));
// Окрашивание фона в зелёный и текста в серый
console.log(safeChalk.bgGreen().Black("Green background and black text"));
// Окрашивание фона в красный и текста в белый
console.log(safeChalk.bgRed().White("Red background and white text"));

// СПЕЦИАЛЬНЫЕ СТИЛИ
// Подчёркивание текста
console.log(safeChalk.underline("Underline"));
// Жирный текст
console.log(safeChalk.bold('Bold'));
// Блеклый текст
console.log(safeChalk.dim('Dim'));
// Курсив
console.log(safeChalk.italic('Italic'));
// Зачёркнутый текст
console.log(safeChalk.strikethrough('Strikethrough'));
// Инверсия цветов
console.log(safeChalk.inverse('Inverse'));