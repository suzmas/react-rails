## Start server

```
foreman start -f Procfile.dev
```

## Configure database

- Duplicate the /config/database-example.yml file and rename to /config/database.yml
- Add PostgreSQL username/password into /config/database.yml

## Setup database

* `rake db:setup`

## Setup .env file

* Create `.env` file in root
* Add:
  - `export GOOGLE_API_KEY=YOUR KEY HERE`

## Props

* `all_prop` -> Contains Place paired with its events.
``` 
  all ->
    place ->
      name (str)
      address1 (str)
      address2 (str)
      city (str)
      state (str)
      zip (str)
      phone (str)
      latitude (float)
      longitude (float)

    events ->
      place_id (int)
      name (str)
      dow (str)
      start_time (time)
      end_time (time)
      menu (json)
      has_food (bool)
      has_drink (bool)
```

* `places_prop` -> Contains all Place.
``` 
  places ->
    (place - See above)
```

* `events_prop` -> Contains all Event.
``` 
  events ->
    (events - See above)
```
