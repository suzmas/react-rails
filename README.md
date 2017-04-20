## Start server

```
foreman start -f Procfile.dev
```

## Configure database

- Duplicate the /config/database-example.yml file and rename to /config/database.yml
- Add PostgreSQL username/password into /config/database.yml

## Setup database

- `rake db:setup`

## Setup .env file

- Create `.env` file in root
- Add:
  - `export GOOGLE_API_KEY=YOUR KEY HERE`
