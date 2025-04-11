## Installation

```bash
$ npm install
```

## Migration
```bash
$ set -a && source .env && set +a

#or

Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], [System.EnvironmentVariableTarget]::Process)
    }
}


# create table Todos
$ npx sequelize-cli db:migrate

# drop table Todos
$ npx sequelize-cli db:migrate:undo
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```