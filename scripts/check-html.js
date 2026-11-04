/**
 * scripts/check-html.js
 * Индивидуальный проект: простая проверка (линтинг) HTML-разметки
 * перед деплоем. Запускается в workflow до публикации сайта.
 *
 * Проверки для каждого HTML-файла в корне репозитория:
 *  1. Файл начинается с <!DOCTYPE html>
 *  2. Присутствуют <html lang="..."> и закрывающий </html>
 *  3. Присутствуют секции <head>...</head> и <body>...</body>
 *  4. Непустой <title>
 *  5. Указан <meta charset="...">
 *  6. Баланс парных тегов: section, header, footer, main, div
 */
'use strict';

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const files = fs.readdirSync(root)
  .filter(f => f.toLowerCase().endsWith('.html'))
  .sort();

if (files.length === 0) {
  console.error('FAIL: HTML-файлы не найдены в корне репозитория');
  process.exit(1);
}

let errors = 0;
const PAIRED = ['section', 'header', 'footer', 'main', 'div'];

for (const file of files) {
  const full = path.join(root, file);
  const html = fs.readFileSync(full, 'utf8');
  const problems = [];

  const doctype = html.slice(0, 200).toLowerCase().includes('<!doctype html');
  if (!doctype) problems.push('нет <!DOCTYPE html> в начале файла');

  if (!/<html\s+lang="[^"]+"/i.test(html)) problems.push('нет <html lang="...">');
  if (!/<\/html>/i.test(html)) problems.push('нет закрывающего </html>');
  if (!/<head[\s>]/i.test(html)) problems.push('нет <head>');
  if (!/<\/head>/i.test(html)) problems.push('нет </head>');
  if (!/<body[\s>]/i.test(html)) problems.push('нет <body>');
  if (!/<\/body>/i.test(html)) problems.push('нет </body>');

  const title = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (!title || !title[1].trim()) problems.push('пустой или отсутствующий <title>');

  if (!/<meta\s+charset=["']?utf-8/i.test(html)) problems.push('нет <meta charset="utf-8">');

  for (const tag of PAIRED) {
    const open = (html.match(new RegExp(`<${tag}[\\s>]`, 'gi')) || []).length;
    const close = (html.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (open !== close) {
      problems.push(`дисбаланс тегов <${tag}>: открыто ${open}, закрыто ${close}`);
    }
  }

  if (problems.length === 0) {
    console.log(`OK    ${file} (${(html.length / 1024).toFixed(1)} KB)`);
  } else {
    errors += problems.length;
    console.error(`FAIL  ${file}`);
    for (const p of problems) console.error(`      - ${p}`);
  }
}

console.log('');
console.log(`Проверено файлов: ${files.length}, найдено ошибок: ${errors}`);
if (errors > 0) {
  console.error('Проверка HTML-разметки НЕ пройдена — деплой отменён');
  process.exit(1);
}
console.log('Проверка HTML-разметки пройдена успешно');
