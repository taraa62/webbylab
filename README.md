## Description

Прийняті архітектурні рішення:
- Сервер побудований на фреймворку nestjs і відповідно прийнята модульна архітектура.
- База данних - postgres 12.6
- Була створена лише одна таблиця оскільки не було потреби розносити дані на кілька. 

Основні комменти по файлах папки `film`
- film.module.ts - модуль для імпортування в основний додаток 
- film.controller.ts/find-film.controller.ts - контроллери (описані ендпоінти)
- film.dto.ts/find.dto.ts - описані сладні об"єкти які будуть отримані чи віддані кліенту. Описана логіка для swagger а також валідація вхідних данних
- film.service.ts - сервіс для бізнес логіки по потребі
- film.model.ts - сервіс для виконная запитів до бд.
- film.entity.ts - описана таблиця в бд
- film.d.ts - описані інтерфейси і типи

Деякі нюанси які були виконані чи проігнорені для виконання
- Розподілення на ролі. Сильно глибокої реалізації не було виконано, тільки на примітивному рівні було добавлено роль адміна для таких команд як добавлення, видалення фільмів.
пароль для авторизації: 12345
- Під час добавлення нового фільма виконується логічна перевірка на існування даного фільму (перевірка по назві і року). Перевірка також примітивна, іде спочатку селект, і якщо такого не має, тоді добавлюємо новий.
- Загрузку великих файлів через файлів не добавлено, так як і не тестувалось.
- Дати валідується по принципу - 1900-2021 - тобто ми можемо добавити фільм тільки починаючи із 1900 року (не думаю що знімали раніше щось :)) 
- Пошук:
1. Добавлено відповідно тз ендпоїнти а також додатковий - універсальний із додатковими параметрами.
1. Пошук тексту (по імені чи по акторах відбувається автоматично до приведення у верхній регістр і по дефолту like %name%, для авторів, відповідно додатково перевіряється можливість пошуку по кількох авторах, перечислених через ",")
  

## Installation

```bash
$ npm install
```

## Running the app

```bash
# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test
```
