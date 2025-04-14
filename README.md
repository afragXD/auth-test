## Installation

```bash
$ npm install
```

## Docker
1) Add `.env`
2)
```bash
# linux
$ set -a && source .env && set +a

#or win

Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], [System.EnvironmentVariableTarget]::Process)
    }
}
```
3)
```bash
docker compose up -d
```

## Migration
```bash
# linux
$ set -a && source .env && set +a

#or win

Get-Content .env | ForEach-Object {
    if ($_ -match '^\s*([^=]+)=(.*)$') {
        [System.Environment]::SetEnvironmentVariable($matches[1], $matches[2], [System.EnvironmentVariableTarget]::Process)
    }
}


# create tables
npx prisma db push
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