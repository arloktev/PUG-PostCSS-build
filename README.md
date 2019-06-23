# Сборка для верстки (PUG+PostCSS) #

## Особенности сборки ##

- сборка для автоматизации задач в повседневной front-end разработке;
- автоматическая перезагрузка страницы в браузере с использованием ```browser-sync```;

## Старт проекта ##

### Клонирование репозитория и переход в папку проекта ###

```
git clone git@github.com:arloktev/PUG-PostCSS-build.git new-project && cd new-project
```

### Установка npm пакетов ###

``` npm i ```
или в разы быстрее с [yarn](https://yarnpkg.com/en/docs/install)
```yarn install```

> Yarn - это современная альтернатива npm. Yarn работает с тем же файлом ```package.json``` и так же скачивает необходимые модули в папку ```node_modules```, но делает это намного быстрее.

### Запуск проекта ###

```gulp```