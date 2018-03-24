# Web Crawler

### Scrapy: 1.5.0
### Python 3.6

### Instructions to Crawl
```
  cd ./webscraper/spiders
  scrapy crawl places -t jsonlines -o - > path/to/write/file.jl
```

### Objects in File
- Each object is placed into the JSONLines file(.jl)
- Each object is delimited by a newline character(`\n`)
- Each object is in the form of:
```
  {
    'name':         string,
    'address':      string,
    'phone_number': string,
    'daily_specials': {
      'sunday':
      'monday':
      'tuesday':
      'wednesday':
      'thursday':
      'friday':
      'saturday':
        [
          {
            specials_type: string,
            specials:      string, //NOTE: specials were concatenated with the delimiter "\n "
            time:          string
          }...
        ]
    }

  }
```
