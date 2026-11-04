# Project Miku: restart — автодеплой через GitHub Actions

Статический сайт (аниме-ММОРПГ лендинг), развёртываемый на **GitHub Pages**
с помощью CI/CD-пайплайна **GitHub Actions**.

[![Deploy static site](https://github.com/ArtyRay/Project_Miku_Restart/actions/workflows/deploy.yml/badge.svg)](https://github.com/ArtyRay/Project_Miku_Restart/actions/workflows/deploy.yml)

## Состав проекта

- `index.html` — главная страница сайта
- `style.css` — стили сайта
- `assets/` — изображения и видео
- `.github/workflows/deploy.yml` — workflow автоматического деплоя
- `scripts/check-html.js` — проверка HTML-разметки перед публикацией

## Как работает CI/CD

1. При каждом `push` в ветку `main` GitHub Actions запускает workflow `Deploy static site`.
2. Job **quality** проверяет корректность HTML-разметки (DOCTYPE, парность тегов, title, кодировку).
3. Job **deploy** публикует сайт на GitHub Pages через `actions/deploy-pages`.
4. Сайт обновляется автоматически, без ручных действий.

## Локальная проверка

```bash
node scripts/check-html.js
```

## Публикация

Настройки: **Settings → Pages → Source: GitHub Actions**.
Адрес сайта: https://artyray.github.io/Project_Miku_Restart/
