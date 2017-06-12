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
      latitude (float)
      longitude (float)
      menu (json)
      name (str)
      place_id (int)
      start_time (time)
```

## Heroku

https://limitless-brushlands-29690.herokuapp.com/

To add Heroku to your local machine and push to production do the following:
* Make sure you have the Heroku CLI tool
* Add Heroku alias `git remote add heroku git@heroku.com:limitless-brushlands-29690.git`
* Merge all pull requests and make sure Master branch is up to date
* To push to production, go to master branch: `git push heroku master`


