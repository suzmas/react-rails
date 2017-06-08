## Start server

```
foreman start -f Procfile.dev
```

## Configure database

- Duplicate the /config/database-example.yml file and rename to /config/database.yml
- Add PostgreSQL username/password into /config/database.yml

## Setup database

* `rake db:setup`

## Testing
* Setup test db: `rake db:seed RAILS_ENV=test --trace`
* To create rspec features test: `rails g rspec:feature [FEATURE_NAME]`
* Update top line of generated feature to `RSpec.feature "[FEATURE_NAME]",
  type: :feature, js: true do` 

## Setup .env file

* Create `.env` file in root
* Add:
  - `export GOOGLE_API_KEY=YOUR KEY HERE`

## Props

* `all_prop` -> Contains Place paired with its events.
``` 
  all ->
    place -> 
      address1 (str)
      address2 (str)
      bearing (str)
      city (str)
      distance (float)
      latitude (float)
      longitude (float)
      name (str)
      neighborhood (str)
      phone (str)
      state (str)
      zip (str)

    events ->
      dow (str)
      end_time (time)
      has_drink (bool)
      has_food (bool)
      lat (float)
      lng (float)
      menu (json)
      name (str)
      place_id (int)
      start_time (time)
```
